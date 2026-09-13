import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as http from 'http';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export interface DetectedAgentRuntime {
  id: string;
  name: string;
  provider: string;
  cliName: string;
  category: 'coding' | 'general' | 'terminal' | 'local' | 'ide';
  installed: boolean;
  version?: string;
  binPath?: string;
  status: 'ready' | 'missing' | 'error';
  description: string;
  installCommand: string;
  docsUrl: string;
}

export interface GatewayStatus {
  connected: boolean;
  endpoint: string;
  type?: 'omniroute' | 'ollama' | 'openai-compatible' | 'none';
  version?: string;
  providerCount?: number;
  activeModelCount?: number;
  error?: string;
}

export interface SystemEnvironmentScan {
  timestamp: string;
  platform: 'darwin' | 'win32' | 'linux';
  platformName: string;
  arch: string;
  workspacePath?: string;
  gitDetected: boolean;
  gitVersion?: string;
  gateway: GatewayStatus;
  agents: DetectedAgentRuntime[];
  hasAnyCliInstalled: boolean;
  recommendedTeamMode: 'independent' | 'team';
}

const UNIVERSAL_AGENTS: Array<{
  id: string;
  name: string;
  provider: string;
  cliName: string;
  category: 'coding' | 'general' | 'terminal' | 'local' | 'ide';
  versionFlag: string;
  description: string;
  installCommand: string;
  docsUrl: string;
}> = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    provider: 'Anthropic',
    cliName: 'claude',
    category: 'coding',
    versionFlag: '--version',
    description: 'Agentic coding companion by Anthropic running in your terminal',
    installCommand: 'npm i -g @anthropic-ai/claude-code',
    docsUrl: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code',
  },
  {
    id: 'codex-chatgpt',
    name: 'ChatGPT / Codex CLI',
    provider: 'OpenAI',
    cliName: 'codex',
    category: 'coding',
    versionFlag: '--version',
    description: 'Autonomous coding agent powered by OpenAI GPT-5 & Codex models',
    installCommand: 'npm i -g @openai/codex',
    docsUrl: 'https://openai.com/codex',
  },
  {
    id: 'cursor-agent',
    name: 'Cursor Native Agent',
    provider: 'Cursor',
    cliName: 'cursor',
    category: 'ide',
    versionFlag: '--version',
    description: 'Deep IDE context, background indexing, and multi-file code editor',
    installCommand: 'Available inside Cursor IDE',
    docsUrl: 'https://cursor.com',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    provider: 'OpenCode AI',
    cliName: 'opencode',
    category: 'coding',
    versionFlag: '--version',
    description: 'Open-source autonomous terminal software engineer and code architect',
    installCommand: 'npm i -g opencode-ai',
    docsUrl: 'https://github.com/opencode-ai/opencode',
  },
  {
    id: 'hermes',
    name: 'Hermes Agent',
    provider: 'Nous Research',
    cliName: 'hermes',
    category: 'general',
    versionFlag: '--version',
    description: 'Advanced reasoning, autonomous planning, and task execution coordinator',
    installCommand: 'pip install hermes-agent',
    docsUrl: 'https://github.com/NousResearch/Hermes-Function-Calling',
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    provider: 'OpenClaw Ecosystem',
    cliName: 'openclaw',
    category: 'terminal',
    versionFlag: '--version',
    description: 'System automation, terminal workflow scripting, and browser automation',
    installCommand: 'npm i -g openclaw',
    docsUrl: 'https://openclaw.ai',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI / Astro',
    provider: 'Google',
    cliName: 'gemini',
    category: 'general',
    versionFlag: '--version',
    description: 'Multi-modal generalist reasoning and coding assistant from Google',
    installCommand: 'npm i -g @google/gemini-cli',
    docsUrl: 'https://ai.google.dev',
  },
  {
    id: 'aider',
    name: 'Aider',
    provider: 'Aider AI',
    cliName: 'aider',
    category: 'coding',
    versionFlag: '--version',
    description: 'AI pair programming tool in your terminal with git auto-commits',
    installCommand: 'pip install aider-chat',
    docsUrl: 'https://aider.chat',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local Models)',
    provider: 'Ollama',
    cliName: 'ollama',
    category: 'local',
    versionFlag: '--version',
    description: 'Run open-weight models (Llama 3.3, Qwen 2.5, DeepSeek) locally on your GPU/CPU',
    installCommand: 'https://ollama.com/download',
    docsUrl: 'https://ollama.com',
  },
];

export class AgentScanner {
  private static getExtendedPath(): string {
    const isWin = process.platform === 'win32';
    const home = os.homedir();

    if (isWin) {
      const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
      const localAppData = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
      return [
        process.env.PATH || '',
        path.join(appData, 'npm'),
        path.join(localAppData, 'Programs', 'Python'),
        path.join(localAppData, 'Programs', 'cursor', 'resources', 'app', 'bin'),
        path.join(localAppData, 'Programs', 'Microsoft VS Code', 'bin'),
        path.join(home, '.cargo', 'bin'),
      ].join(';');
    } else {
      return [
        process.env.PATH || '',
        '/usr/local/bin',
        '/opt/homebrew/bin',
        path.join(home, '.npm-global', 'bin'),
        path.join(home, '.local', 'bin'),
        path.join(home, '.cargo', 'bin'),
        '/Applications/Cursor.app/Contents/Resources/app/bin',
        '/Applications/Visual Studio Code.app/Contents/Resources/app/bin',
      ].join(':');
    }
  }

  private static execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
    const isWin = process.platform === 'win32';
    const extendedPath = this.getExtendedPath();

    return new Promise((resolve) => {
      exec(
        command,
        {
          env: { ...process.env, PATH: extendedPath },
          timeout: 3500,
          shell: isWin ? 'cmd.exe' : '/bin/sh',
        },
        (err, stdout, stderr) => {
          if (err) {
            resolve({ stdout: '', stderr: err.message });
          } else {
            resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
          }
        }
      );
    });
  }

  public static async checkGateway(endpoint: string = 'http://localhost:20128'): Promise<GatewayStatus> {
    // 1. First check OmniRoute / OpenAI Gateway at port 20128
    const checkPort = (urlStr: string): Promise<{ connected: boolean; data: string; statusCode: number }> => {
      return new Promise((resolve) => {
        try {
          const url = new URL(urlStr);
          const req = http.request(
            {
              hostname: url.hostname,
              port: url.port || (url.protocol === 'https:' ? 443 : 80),
              path: url.pathname + (url.search || ''),
              method: 'GET',
              timeout: 2000,
            },
            (res) => {
              let body = '';
              res.on('data', (d) => (body += d));
              res.on('end', () => {
                resolve({ connected: res.statusCode !== undefined && res.statusCode < 400, data: body, statusCode: res.statusCode || 0 });
              });
            }
          );
          req.on('error', () => resolve({ connected: false, data: '', statusCode: 0 }));
          req.on('timeout', () => {
            req.destroy();
            resolve({ connected: false, data: '', statusCode: 0 });
          });
          req.end();
        } catch {
          resolve({ connected: false, data: '', statusCode: 0 });
        }
      });
    };

    // Check OmniRoute
    const omniRes = await checkPort('http://localhost:20128/api/monitoring/health');
    if (omniRes.connected) {
      try {
        const parsed = JSON.parse(omniRes.data);
        return {
          connected: true,
          endpoint: 'http://localhost:20128',
          type: 'omniroute',
          version: parsed.version || 'v16.3.1',
          providerCount: parsed.providerSummary?.catalogCount || 299,
          activeModelCount: parsed.providerSummary?.configuredCount || 8,
        };
      } catch {
        return { connected: true, endpoint: 'http://localhost:20128', type: 'omniroute', version: 'active' };
      }
    }

    // Check Ollama at port 11434
    const ollamaRes = await checkPort('http://localhost:11434/api/tags');
    if (ollamaRes.connected) {
      return {
        connected: true,
        endpoint: 'http://localhost:11434',
        type: 'ollama',
        version: 'Ollama Local Daemon',
        providerCount: 1,
        activeModelCount: 5,
      };
    }

    return { connected: false, endpoint, type: 'none', error: 'No local gateway daemon detected' };
  }

  public static async scanEnvironment(): Promise<SystemEnvironmentScan> {
    const isWin = process.platform === 'win32';
    const whichCmd = isWin ? 'where' : 'which';

    const gateway = await this.checkGateway();

    // Check Git
    const gitCheck = await this.execPromise('git --version');
    const gitDetected = gitCheck.stdout.length > 0;
    const gitVersion = gitDetected ? gitCheck.stdout : undefined;

    // Scan all universal agents in parallel
    const agentResults = await Promise.all(
      UNIVERSAL_AGENTS.map(async (spec) => {
        // Special case for Cursor Agent inside Cursor
        if (spec.id === 'cursor-agent') {
          return {
            id: spec.id,
            name: spec.name,
            provider: spec.provider,
            cliName: spec.cliName,
            category: spec.category,
            installed: true,
            version: vscode.version || 'Active IDE',
            binPath: 'Built-in Cursor Editor Bridge',
            status: 'ready' as const,
            description: spec.description,
            installCommand: spec.installCommand,
            docsUrl: spec.docsUrl,
          };
        }

        const whichRes = await this.execPromise(`${whichCmd} ${spec.cliName}`);
        if (whichRes.stdout) {
          const binPath = whichRes.stdout.split('\n')[0];
          const verRes = await this.execPromise(`${spec.cliName} ${spec.versionFlag}`);
          const version = verRes.stdout.split('\n')[0] || 'installed';

          return {
            id: spec.id,
            name: spec.name,
            provider: spec.provider,
            cliName: spec.cliName,
            category: spec.category,
            installed: true,
            version,
            binPath,
            status: 'ready' as const,
            description: spec.description,
            installCommand: spec.installCommand,
            docsUrl: spec.docsUrl,
          };
        } else {
          return {
            id: spec.id,
            name: spec.name,
            provider: spec.provider,
            cliName: spec.cliName,
            category: spec.category,
            installed: false,
            status: 'missing' as const,
            description: spec.description,
            installCommand: spec.installCommand,
            docsUrl: spec.docsUrl,
          };
        }
      })
    );

    const hasAnyCliInstalled = agentResults.some((a) => a.installed);
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspacePath = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;

    let platformName = 'macOS';
    if (isWin) platformName = 'Windows';
    else if (process.platform === 'linux') platformName = 'Linux';

    return {
      timestamp: new Date().toISOString(),
      platform: process.platform as 'darwin' | 'win32' | 'linux',
      platformName,
      arch: os.arch(),
      workspacePath,
      gitDetected,
      gitVersion,
      gateway,
      agents: agentResults,
      hasAnyCliInstalled,
      recommendedTeamMode: gateway.connected ? 'team' : 'independent',
    };
  }
}
