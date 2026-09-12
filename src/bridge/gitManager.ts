import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import { GitStatusInfo } from '../webview/types/workbench';

export class GitManager {
  private static execGit(args: string, cwd: string): Promise<string> {
    return new Promise((resolve) => {
      exec(`git ${args}`, { cwd, timeout: 5000 }, (err, stdout) => {
        if (err) {
          resolve('');
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  public static async getWorkspaceGitStatus(): Promise<GitStatusInfo> {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      return {
        workspace: 'No Workspace',
        worktree: 'default',
        branch: 'main',
        modified: 0,
        staged: 0,
        untracked: 0,
        divergence: 0,
      };
    }

    const cwd = folders[0].uri.fsPath;
    const workspaceName = path.basename(cwd);

    try {
      const branch = await this.execGit('rev-parse --abbrev-ref HEAD', cwd) || 'main';
      const statusOut = await this.execGit('status --porcelain', cwd);

      let modified = 0;
      let staged = 0;
      let untracked = 0;

      const lines = statusOut.split('\n').filter(Boolean);
      for (const line of lines) {
        const x = line[0];
        const y = line[1];
        if (x === '?' && y === '?') {
          untracked++;
        } else {
          if (x !== ' ' && x !== '?') staged++;
          if (y !== ' ' && y !== '?') modified++;
        }
      }

      // Check divergence
      const divergenceOut = await this.execGit('rev-list --left-right --count HEAD...@{upstream}', cwd);
      let divergence = 0;
      if (divergenceOut) {
        const [ahead, behind] = divergenceOut.split('\t').map((n) => parseInt(n, 10) || 0);
        divergence = ahead - behind;
      }

      return {
        workspace: workspaceName,
        worktree: path.basename(cwd),
        branch,
        modified,
        staged,
        untracked,
        divergence,
      };
    } catch {
      return {
        workspace: workspaceName,
        worktree: 'default',
        branch: 'main',
        modified: 0,
        staged: 0,
        untracked: 0,
        divergence: 0,
      };
    }
  }

  public static async getActiveEditorContext(): Promise<{ title: string; content: string; type: string } | null> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return null;

    const doc = editor.document;
    const fileName = path.basename(doc.fileName);
    const selection = editor.selection;
    let content = '';

    if (!selection.isEmpty) {
      content = doc.getText(selection);
    } else {
      content = doc.getText();
    }

    return {
      title: `${fileName}${!selection.isEmpty ? ' (Selection)' : ''}`,
      content,
      type: 'file',
    };
  }

  public static async getGitDiffContext(): Promise<{ title: string; content: string; type: string } | null> {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) return null;
    const cwd = folders[0].uri.fsPath;

    const diff = await this.execGit('diff HEAD', cwd);
    if (!diff) return null;

    return {
      title: 'Workspace Git Diff',
      content: diff,
      type: 'git-diff',
    };
  }
}
