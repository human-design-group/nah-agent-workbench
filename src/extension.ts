import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { WebviewToHostMessage, WorkbenchState } from './webview/types/workbench.js';

let currentPanel: vscode.WebviewPanel | undefined = undefined;
const STATE_STORAGE_KEY = 'nahWorkbench.persistedState';

export function activate(context: vscode.ExtensionContext) {
  console.log('notahuman Workbench extension activated');

  const openWorkbenchCommand = vscode.commands.registerCommand('nah.openWorkbench', () => {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      currentPanel.reveal(column);
      return;
    }

    currentPanel = vscode.window.createWebviewPanel(
      'nahWorkbench',
      'notahuman Workbench',
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
    if (savedState) {
      setTimeout(() => {
        currentPanel?.webview.postMessage({
          type: 'RESTORE_STATE',
          payload: savedState,
        });
      }, 300);
    }

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

  const resetLayoutCommand = vscode.commands.registerCommand('nah.resetWorkbenchLayout', async () => {
    await context.workspaceState.update(STATE_STORAGE_KEY, undefined);
    if (currentPanel) {
      currentPanel.webview.postMessage({ type: 'RESET_LAYOUT' });
    }
  });

  context.subscriptions.push(openWorkbenchCommand, resetLayoutCommand);
}

export function deactivate() {
  if (currentPanel) {
    currentPanel.dispose();
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
  <title>notahuman Workbench</title>
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
