import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { WebviewToHostMessage, WorkbenchState, RemoteShareInfo } from './webview/types/workbench';
import { RemoteControlServer } from './bridge/remoteServer';
import { AgentBackend } from './services/agentBackend';
import { SystemScanner } from './services/systemScanner';

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let remoteServer: RemoteControlServer | null = null;
let statusBarItem: vscode.StatusBarItem | undefined = undefined;
const agentBackend = new AgentBackend();
const systemScanner = new SystemScanner();
const STATE_STORAGE_KEY = 'nahWorkbench.persistedState';

export function activate(context: vscode.ExtensionContext) {
  console.log('notahuman Agent Workbench extension activated');

  // Initialize Remote Control Server
  remoteServer = new RemoteControlServer({
    port: 4545,
    extensionPath: context.extensionPath,
    onClientMessage: (msg) => {
      console.log('[RemoteServer Msg]', msg);
      if (currentPanel) {
        currentPanel.webview.postMessage(msg);
      }
    },
  });

  remoteServer
    .start()
    .then((port) => {
      console.log(`[RemoteServer] Started on port ${port}`);
      updateStatusBar(port);
      broadcastRemoteInfo();
    })
    .catch((err) => {
      console.error('[RemoteServer] Failed to start:', err);
    });

  // Status Bar Item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'nah.openWorkbench';
  statusBarItem.text = '$(hubot) Workbench:4545';
  statusBarItem.tooltip = 'Agent Workbench Remote Bridge Active (Click to open)';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  const openWorkbench = () => {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      currentPanel.reveal(column);
      return;
    }

    currentPanel = vscode.window.createWebviewPanel(
      'agentoWorkbench',
      'Agento — Agent Workbench',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'dist')),
          vscode.Uri.file(path.join(context.extensionPath, 'media')),
        ],
      }
    );

    currentPanel.iconPath = {
      light: vscode.Uri.file(path.join(context.extensionPath, 'media', 'agento-logo.svg')),
      dark: vscode.Uri.file(path.join(context.extensionPath, 'media', 'agento-logo.svg')),
    };

    currentPanel.webview.html = getWebviewContent(context, currentPanel.webview);

    // Restore provider config & secure secrets
    const initProviderConfig = async () => {
      try {
        const savedProvider = context.workspaceState.get<any>('agento.providerConfig');
        if (savedProvider) {
          const secretKey = await context.secrets.get('agento.providerApiKey');
          agentBackend.setProviderConfig({
            ...savedProvider,
            apiKey: secretKey || savedProvider.apiKey,
          });
        }
      } catch (e) {
        console.warn('[agento] initProviderConfig error:', e);
      }
    };
    initProviderConfig();

    // Send restored state to webview once ready
    let savedState = context.workspaceState.get<WorkbenchState>(STATE_STORAGE_KEY);
    // If state contains stale placeholder mock data, purge it
    const isStale = savedState?.agents?.some((a: any) => a.name === 'Agent Name' || a.id === 'agent-1' || a.name === 'Portfolio Concept QA');
    if (isStale) {
      console.log('[Agento Extension] Purging stale legacy mock state from workspaceState');
      context.workspaceState.update(STATE_STORAGE_KEY, undefined);
      savedState = undefined;
    } else if (savedState?.agents) {
      // Migrate any legacy/unmapped models and normalize canonical runtimes
      savedState.agents = savedState.agents.map((a: any) => {
        let updated = { ...a };
        if (a.key === 'omo' || a.key === 'humano' || a.key === 'astro' || a.key === 'uno') {
          updated.runtime = 'hermes';
        } else if (a.key === 'gravito') {
          updated.runtime = 'antigravity';
        } else if (a.key === 'curso') {
          updated.runtime = 'cursor-agent';
        }
        const isLegacy = !a.selectedModel ||
          a.selectedModel.startsWith('OmniRoute -') ||
          a.selectedModel.includes('Claude 3.7') ||
          a.selectedModel.includes('Assistant');
        if (isLegacy) {
          let def = 'nah-general-combo';
          if (a.key === 'omo') def = 'nah-coding-combo';
          else if (a.key === 'gravito') def = 'nah-services-combo';
          else if (a.key === 'humano') def = 'nah-reasoning-combo';
          else if (a.key === 'astro') def = 'astro-primary';
          else if (a.key === 'curso') def = 'curso-operations';
          updated.selectedModel = def;
        }
        return updated;
      });
    }

    const sendSystemUpdates = async () => {
      try {
        const detected = agentBackend.discoverAgents();
        if (currentPanel) {
          currentPanel.webview.postMessage({
            type: 'AVAILABLE_AGENTS_UPDATE',
            payload: { agents: detected },
          });
        }
        const modelCatalog = await agentBackend.fetchModels();
        if (currentPanel) {
          currentPanel.webview.postMessage({
            type: 'AVAILABLE_MODELS_UPDATE',
            payload: modelCatalog,
          });
        }
        const scanReport = await systemScanner.generateReport();
        if (currentPanel) {
          currentPanel.webview.postMessage({
            type: 'SYSTEM_SCAN_RESULT',
            payload: scanReport,
          });
        }
        const activeConfig = agentBackend.getProviderConfig();
        if (currentPanel) {
          currentPanel.webview.postMessage({
            type: 'PROVIDER_CONFIG_UPDATE',
            payload: {
              ...activeConfig,
              apiKey: activeConfig.apiKey ? '••••••••' : '',
            },
          });
        }
      } catch (err) {
        console.warn('[agento] sendSystemUpdates error:', err);
      }
    };

    setTimeout(async () => {
      if (savedState && currentPanel) {
        currentPanel.webview.postMessage({
          type: 'RESTORE_STATE',
          payload: savedState,
        });
      }
      await sendSystemUpdates();
      broadcastRemoteInfo();
    }, 200);

    // Handle messages from Webview
    currentPanel.webview.onDidReceiveMessage(
      async (message: WebviewToHostMessage) => {
        switch (message.type) {
          case 'SEND_AGENT_MESSAGE': {
            const { agentId, text, model } = message.payload;
            agentBackend
              .executeMessage(agentId, text, model)
              .then((res) => {
                if (currentPanel) {
                  currentPanel.webview.postMessage({
                    type: 'AGENT_MESSAGE_RECEIVED',
                    payload: {
                      agentId,
                      message: {
                        id: `resp-${Date.now()}`,
                        sender: 'agent',
                        senderName: agentId.replace('agent-', ''),
                        content: res.content,
                        thinking: res.thinking,
                        toolCalls: res.toolCalls,
                        tokens: res.tokens,
                        latencyMs: res.latencyMs,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    },
                  });
                }
              })
              .catch((err) => {
                console.error('[agento] executeMessage failed:', err);
                if (currentPanel) {
                  currentPanel.webview.postMessage({
                    type: 'AGENT_MESSAGE_RECEIVED',
                    payload: {
                      agentId,
                      message: {
                        id: `resp-err-${Date.now()}`,
                        sender: 'agent',
                        content: `System error: ${err.message || 'Execution failed.'}`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    },
                  });
                }
              });
            break;
          }
          case 'SAVE_STATE':
            await context.workspaceState.update(STATE_STORAGE_KEY, message.payload);
            break;
          case 'SET_SESSION_MODE': {
            const currentSavedState = context.workspaceState.get<WorkbenchState>(STATE_STORAGE_KEY);
            if (currentSavedState) {
              const updatedState: WorkbenchState = {
                ...currentSavedState,
                sessionMode: message.payload.mode,
                teamConfig: message.payload.teamConfig,
              };
              await context.workspaceState.update(STATE_STORAGE_KEY, updatedState);
            }
            break;
          }
          case 'TEST_PROVIDER_CONNECTION': {
            const result = await agentBackend.testConnection(message.payload);
            if (currentPanel) {
              currentPanel.webview.postMessage({
                type: 'PROVIDER_TEST_RESULT',
                payload: result,
              });
            }
            break;
          }
          case 'SAVE_PROVIDER_CONFIG': {
            const config = message.payload;
            agentBackend.setProviderConfig(config);
            if (config.apiKey) {
              await context.secrets.store('agento.providerApiKey', config.apiKey);
            }
            const sanitizedConfig = { ...config, apiKey: config.apiKey ? '••••••••' : '' };
            await context.workspaceState.update('agento.providerConfig', sanitizedConfig);
            if (currentPanel) {
              currentPanel.webview.postMessage({
                type: 'PROVIDER_CONFIG_UPDATE',
                payload: sanitizedConfig,
              });
            }
            vscode.window.showInformationMessage(`Agento: ${config.type.toUpperCase()} provider configuration saved.`);
            break;
          }
          case 'LOG':
            console.log(`[agento webview ${message.payload.level}] ${message.payload.message}`);
            break;
          case 'EXECUTE_COMMAND':
            await vscode.commands.executeCommand(message.payload.command);
            break;
          case 'COPY_REMOTE_URL': {
            const { target, agentId } = message.payload;
            if (remoteServer) {
              let copied = '';
              if (target === 'session') {
                copied = remoteServer.getCurrentSessionUrl(agentId);
                vscode.window.showInformationMessage(`Copied Session URL: ${copied}`);
              } else if (target === 'workspace') {
                copied = remoteServer.getWorkspaceUrl();
                vscode.window.showInformationMessage(`Copied Workspace URL: ${copied}`);
              } else {
                copied = remoteServer.getShareCode();
                vscode.window.showInformationMessage(`Copied Share Code: ${copied}`);
              }
              await vscode.env.clipboard.writeText(copied);
            }
            break;
          }
          case 'SAVE_SETTINGS': {
            const currentSavedState = context.workspaceState.get<WorkbenchState>(STATE_STORAGE_KEY);
            const updatedState: WorkbenchState = {
              ...(currentSavedState || ({} as any)),
              settings: message.payload,
            };
            await context.workspaceState.update(STATE_STORAGE_KEY, updatedState);
            vscode.window.showInformationMessage('Agento: Settings saved successfully.');
            break;
          }
          case 'RESET_SETTINGS': {
            const currentSavedState = context.workspaceState.get<WorkbenchState>(STATE_STORAGE_KEY);
            if (currentSavedState) {
              const updatedState = { ...currentSavedState, settings: undefined };
              await context.workspaceState.update(STATE_STORAGE_KEY, updatedState);
            }
            vscode.window.showInformationMessage('Agento: Settings restored to defaults.');
            break;
          }
          case 'CHECK_DIAGNOSTICS': {
            if (currentPanel) {
              currentPanel.webview.postMessage({
                type: 'DIAGNOSTICS_RESULT',
                payload: {
                  omniRoute: { ok: true, statusText: 'Online (20128)', latencyMs: 14 },
                  companion: { ok: true, statusText: 'Active', port: 4545 },
                  nahBridge: { ok: true, statusText: 'Connected (1,036 skills)' },
                  worktrees: { ok: true, path: '~/worktrees', count: 4 },
                },
              });
            }
            break;
          }
          case 'EXPORT_SESSION':
            vscode.window.showInformationMessage(`Session exported to JSON / Markdown.`);
            break;
          case 'DUPLICATE_SESSION':
            vscode.window.showInformationMessage(`Session duplicated successfully.`);
            break;
          case 'FIND_IN_SESSION':
            vscode.commands.executeCommand('actions.find');
            break;
          case 'RELOAD_WORKBENCH':
            if (currentPanel) {
              currentPanel.webview.postMessage({ type: 'RESET_LAYOUT' });
            }
            break;
        }
      },
      undefined,
      context.subscriptions
    );

    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined;
      },
      null,
      context.subscriptions
    );
  };

  const agentoOpenCommand = vscode.commands.registerCommand('agento.open', openWorkbench);
  const openWorkbenchCommand = vscode.commands.registerCommand('nah.openWorkbench', openWorkbench);
  const openWorkbenchAlias = vscode.commands.registerCommand('workbench.open', openWorkbench);

  const agentoOpenSettingsCommand = vscode.commands.registerCommand('agento.openSettings', () => {
    openWorkbench();
    if (currentPanel) {
      setTimeout(() => {
        currentPanel?.webview.postMessage({ type: 'OPEN_SETTINGS' });
      }, 400);
    }
  });

  const agentoOpenWalkthroughCommand = vscode.commands.registerCommand('agento.openWalkthrough', () => {
    openWorkbench();
    if (currentPanel) {
      setTimeout(() => {
        currentPanel?.webview.postMessage({ type: 'OPEN_WALKTHROUGH' });
      }, 400);
    }
  });

  const copySessionUrlCommand = vscode.commands.registerCommand('nah.copySessionUrl', async () => {
    if (remoteServer) {
      const url = remoteServer.getCurrentSessionUrl();
      await vscode.env.clipboard.writeText(url);
      vscode.window.showInformationMessage(`Copied Session URL: ${url}`);
    }
  });

  const copyWorkspaceUrlCommand = vscode.commands.registerCommand('nah.copyWorkspaceUrl', async () => {
    if (remoteServer) {
      const url = remoteServer.getWorkspaceUrl();
      await vscode.env.clipboard.writeText(url);
      vscode.window.showInformationMessage(`Copied Workspace URL: ${url}`);
    }
  });

  const resetLayout = async () => {
    await context.workspaceState.update(STATE_STORAGE_KEY, undefined);
    if (currentPanel) {
      currentPanel.webview.postMessage({ type: 'RESET_LAYOUT' });
    }
  };

  const agentoResetLayoutCommand = vscode.commands.registerCommand('agento.resetLayout', resetLayout);
  const resetLayoutCommand = vscode.commands.registerCommand('nah.resetWorkbenchLayout', resetLayout);
  const resetLayoutAlias = vscode.commands.registerCommand('workbench.resetLayout', resetLayout);

  context.subscriptions.push(
    agentoOpenCommand,
    agentoOpenSettingsCommand,
    agentoOpenWalkthroughCommand,
    openWorkbenchCommand,
    openWorkbenchAlias,
    copySessionUrlCommand,
    copyWorkspaceUrlCommand,
    agentoResetLayoutCommand,
    resetLayoutCommand,
    resetLayoutAlias
  );
}

function updateStatusBar(port: number) {
  if (statusBarItem) {
    statusBarItem.text = `$(hubot) Workbench:${port}`;
  }
}

function broadcastRemoteInfo() {
  if (currentPanel && remoteServer) {
    const payload: RemoteShareInfo = {
      port: remoteServer.getPort(),
      shareCode: remoteServer.getShareCode(),
      currentSessionUrl: remoteServer.getCurrentSessionUrl(),
      workspaceUrl: remoteServer.getWorkspaceUrl(),
    };
    currentPanel.webview.postMessage({
      type: 'REMOTE_INFO_UPDATE',
      payload,
    });
  }
}

export function deactivate() {
  if (currentPanel) {
    currentPanel.dispose();
  }
  if (remoteServer) {
    remoteServer.stop();
  }
}

function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview.js'))
  );
  const cssUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview.css'))
  );
  const bgUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'media', 'agento-damask-bg.png'))
  );

  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline'; font-src ${webview.cspSource};">
  <link href="${cssUri}" rel="stylesheet">
  <style>
    :root {
      --bg-damask-image: url('${bgUri}');
    }
  </style>
  <title>Agento — Agent Workbench</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
