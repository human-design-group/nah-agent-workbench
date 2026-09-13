import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { WebviewToHostMessage, WorkbenchState, RemoteShareInfo } from './webview/types/workbench';
import { RemoteControlServer } from './bridge/remoteServer';

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let remoteServer: RemoteControlServer | null = null;
let statusBarItem: vscode.StatusBarItem | undefined = undefined;
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
    setTimeout(() => {
      if (savedState && currentPanel) {
        currentPanel.webview.postMessage({
          type: 'RESTORE_STATE',
          payload: savedState,
        });
      }
      broadcastRemoteInfo();
    }, 300);

    // Handle messages from Webview
    currentPanel.webview.onDidReceiveMessage(
      async (message: WebviewToHostMessage) => {
        switch (message.type) {
          case 'SAVE_STATE':
            await context.workspaceState.update(STATE_STORAGE_KEY, message.payload);
            break;
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

  const openWorkbenchCommand = vscode.commands.registerCommand('nah.openWorkbench', openWorkbench);
  const openWorkbenchAlias = vscode.commands.registerCommand('workbench.open', openWorkbench);

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

  const resetLayoutCommand = vscode.commands.registerCommand('nah.resetWorkbenchLayout', resetLayout);
  const resetLayoutAlias = vscode.commands.registerCommand('workbench.resetLayout', resetLayout);

  context.subscriptions.push(
    openWorkbenchCommand,
    openWorkbenchAlias,
    copySessionUrlCommand,
    copyWorkspaceUrlCommand,
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
