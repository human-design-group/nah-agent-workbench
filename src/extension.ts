import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { WebviewToHostMessage, WorkbenchState, RemoteShareInfo, AttachedContextItem } from './webview/types/workbench';
import { RemoteControlServer } from './bridge/remoteServer';
import { AgentScanner } from './bridge/agentScanner';
import { AgentRunner } from './bridge/agentRunner';
import { GitManager } from './bridge/gitManager';

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let remoteServer: RemoteControlServer | null = null;
let statusBarItem: vscode.StatusBarItem | undefined = undefined;
const STATE_STORAGE_KEY = 'nahWorkbench.persistedState';

export function activate(context: vscode.ExtensionContext) {
  console.log('notahuman Agent Workbench extension activated');

  // 1. Initialize Remote Control Server
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

  // 2. Status Bar Item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'nah.openWorkbench';
  statusBarItem.text = '$(hubot) Workbench:4545';
  statusBarItem.tooltip = 'Agent Workbench Remote Bridge Active (Click to open)';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // 3. Register Commands
  const openWorkbenchCommand = vscode.commands.registerCommand('nah.openWorkbench', async () => {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      currentPanel.reveal(column);
      return;
    }

    currentPanel = vscode.window.createWebviewPanel(
      'nahWorkbench',
      'Agent Workbench',
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
      light: vscode.Uri.file(path.join(context.extensionPath, 'media', 'icon-bot.svg')),
      dark: vscode.Uri.file(path.join(context.extensionPath, 'media', 'icon-bot.svg')),
    };

    currentPanel.webview.html = getWebviewContent(context, currentPanel.webview);

    // Send restored state to webview once ready
    const savedState = context.workspaceState.get<WorkbenchState>(STATE_STORAGE_KEY);
    setTimeout(async () => {
      if (savedState && currentPanel) {
        currentPanel.webview.postMessage({
          type: 'RESTORE_STATE',
          payload: savedState,
        });
      }

      // Trigger automatic environment scan & git status on startup
      const scanResult = await AgentScanner.scanEnvironment();
      const gitStatus = await GitManager.getWorkspaceGitStatus();

      if (currentPanel) {
        currentPanel.webview.postMessage({
          type: 'ENVIRONMENT_SCAN_RESULT',
          payload: scanResult,
        });
        currentPanel.webview.postMessage({
          type: 'GIT_STATUS_UPDATE',
          payload: gitStatus,
        });
      }

      broadcastRemoteInfo();
    }, 400);

    // Handle messages from Webview
    currentPanel.webview.onDidReceiveMessage(
      async (message: WebviewToHostMessage) => {
        switch (message.type) {
          case 'SAVE_STATE':
            await context.workspaceState.update(STATE_STORAGE_KEY, message.payload);
            break;

          case 'REQUEST_ENVIRONMENT_SCAN': {
            const scan = await AgentScanner.scanEnvironment();
            if (currentPanel) {
              currentPanel.webview.postMessage({
                type: 'ENVIRONMENT_SCAN_RESULT',
                payload: scan,
              });
            }
            break;
          }

          case 'COMPLETE_ONBOARDING': {
            const existing = context.workspaceState.get<WorkbenchState>(STATE_STORAGE_KEY) || ({} as WorkbenchState);
            existing.isOnboarded = true;
            existing.sessionMode = message.payload.teamMode;
            existing.panelSlots = message.payload.selectedAgents;
            await context.workspaceState.update(STATE_STORAGE_KEY, existing);
            vscode.window.showInformationMessage('Agent Workbench setup complete! Mission Control ready.');
            break;
          }

          case 'REQUEST_ATTACH_CONTEXT': {
            const { agentId, type } = message.payload;
            let attachedItem: AttachedContextItem | null = null;

            if (type === 'file') {
              const fileCtx = await GitManager.getActiveEditorContext();
              if (fileCtx) {
                attachedItem = {
                  id: 'att_' + Date.now(),
                  title: fileCtx.title,
                  content: fileCtx.content,
                  type: 'file',
                };
              }
            } else if (type === 'git-diff') {
              const diffCtx = await GitManager.getGitDiffContext();
              if (diffCtx) {
                attachedItem = {
                  id: 'att_' + Date.now(),
                  title: diffCtx.title,
                  content: diffCtx.content,
                  type: 'git-diff',
                };
              }
            }

            if (attachedItem && currentPanel) {
              currentPanel.webview.postMessage({
                type: 'CONTEXT_ATTACHED',
                payload: { agentId, item: attachedItem },
              });
              vscode.window.showInformationMessage(`Attached [${attachedItem.type}] ${attachedItem.title} to ${agentId}`);
            } else {
              vscode.window.showWarningMessage('No active editor selection or workspace diff available to attach.');
            }
            break;
          }

          case 'SEND_AGENT_MESSAGE': {
            const { agentId, text, model, attachments } = message.payload;
            const saved = context.workspaceState.get<WorkbenchState>(STATE_STORAGE_KEY);
            const agentConfig = saved?.agents?.find((a) => a.id === agentId || a.key === agentId);
            const history = agentConfig?.messages || [];

            await AgentRunner.executeAgentPrompt({
              agentId,
              agentName: agentConfig?.name || agentId,
              userPrompt: text,
              history,
              model: model || agentConfig?.selectedModel,
              contextAttachments: attachments,
              onChunk: (delta, fullContent) => {
                if (currentPanel) {
                  currentPanel.webview.postMessage({
                    type: 'AGENT_STREAM_CHUNK',
                    payload: { agentId, delta, fullContent },
                  });
                }
              },
              onComplete: (completedMessage) => {
                if (currentPanel) {
                  currentPanel.webview.postMessage({
                    type: 'AGENT_MESSAGE_RECEIVED',
                    payload: { agentId, message: completedMessage },
                  });
                }
              },
              onError: (err) => {
                vscode.window.showErrorMessage(`Agent execution error (${agentId}): ${err.message}`);
                if (currentPanel) {
                  currentPanel.webview.postMessage({
                    type: 'AGENT_MESSAGE_RECEIVED',
                    payload: {
                      agentId,
                      message: {
                        id: 'err_' + Date.now(),
                        sender: 'system',
                        content: `⚠️ Error executing prompt: ${err.message}`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    },
                  });
                }
              },
            });
            break;
          }

          case 'LOG':
            console.log(`[nah-workbench webview ${message.payload.level}] ${message.payload.message}`);
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

          case 'EXPORT_SESSION': {
            const saved = context.workspaceState.get<WorkbenchState>(STATE_STORAGE_KEY);
            const markdown = `# Agent Workbench Session Export\n\nGenerated: ${new Date().toISOString()}\n\n` +
              (saved?.agents || [])
                .map((a) => `## Agent: ${a.name} (${a.runtime})\nModel: ${a.selectedModel}\n\n` +
                  a.messages.map((m) => `**[${m.timestamp}] ${m.sender.toUpperCase()}:**\n${m.content}\n`).join('\n'))
                .join('\n\n---\n\n');

            const doc = await vscode.workspace.openTextDocument({ content: markdown, language: 'markdown' });
            await vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage('Session exported to new Markdown document.');
            break;
          }

          case 'DUPLICATE_SESSION':
            vscode.window.showInformationMessage('Session duplicated successfully.');
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
  });

  const runSetupWizardCommand = vscode.commands.registerCommand('nah.runSetupWizard', async () => {
    if (currentPanel) {
      currentPanel.webview.postMessage({ type: 'REQUEST_ENVIRONMENT_SCAN' });
    }
  });

  const resetLayoutCommand = vscode.commands.registerCommand('nah.resetWorkbenchLayout', async () => {
    await context.workspaceState.update(STATE_STORAGE_KEY, undefined);
    if (currentPanel) {
      currentPanel.webview.postMessage({ type: 'RESET_LAYOUT' });
    }
  });

  context.subscriptions.push(
    openWorkbenchCommand,
    runSetupWizardCommand,
    resetLayoutCommand
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

  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline'; font-src ${webview.cspSource};">
  <link href="${cssUri}" rel="stylesheet">
  <title>Agent Workbench</title>
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
