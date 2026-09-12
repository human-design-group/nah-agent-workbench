import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as http from 'http';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export interface DetectedAgentRuntime {
  id: string;
  name: string;
  cliName: string;
  installed: boolean;
  version?: string;
  binPath?: string;
  status: 'ready' | 'missing' | 'error';
  description: string;
  installCommand?: string;
}

export interface GatewayStatus {
  connected: boolean;
  endpoint: string;
  version?: string;
  providerCount?: number;
  activeModelCount?: number;
  error?: string;
}

export interface SystemEnvironmentScan {
  timestamp: string;
  platform: string;
  workspacePath?: string;
  gitDetected: boolean;
  gateway: GatewayStatus;
  agents: DetectedAgentRuntime[];
  recommendedTeamMode: 'independent' | 'team';
}

const KNOWN_AGENTS: Array<{
  id: string;
  name: string;
  cliName: string;
  versionFlag: string;
  description: string;
  installCommand: string;
}> = [
  {
    id: 'astro',
    name: 'Astro (Generalist)',
    cliName: 'gemini',
    versionFlag: '--version',
    description: 'Autonomous multi-file developer & generalist reasoning agent',
    installCommand: 'npm i -g @google/gemini-cli',
  },
  {
    id: 'humano',
    name: 'Humano (Operator)',
    cliName: 'openclaw',
    versionFlag: '--version',
    description: 'System automation, browser control, and terminal execution',
    installCommand: 'npm i -g openclaw',
  },
  {
    id: 'uno',
    name: 'Uno (Strategist)',
    cliName: 'hermes',
    versionFlag: '--version',
    description: 'Task planning, Kanban lifecycle, and institutional memory',
    installCommand: 'pip install hermes-agent',
  },
  {
    id: 'omo',
    name: 'Omo (Architect)',
    cliName: 'opencode',
    versionFlag: '--version',
    description: 'Deep codebase architecture, refactoring, and code review',
    installCommand: 'npm i -g opencode-ai',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    cliName: 'claude',
    versionFlag: '--version',
    description: 'Anthropic agentic CLI coding companion',
    installCommand: 'npm i -g @anthropic-ai/claude-code',
  },
];

export class AgentScanner {
  private static execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
    const extendedPath = [
      process.env.PATH || '',
      '/usr/local/bin',
      '/opt/homebrew/bin',
      path.join(os.homedir(), '.npm-global/bin'),
      path.join(os.homedir(), '.local/bin'),
      path.join(os.homedir(), '.cargo/bin'),
    ].join(':');

    return new Promise((resolve, reject) => {
      exec(command, { env: { ...process.env, PATH: extendedPath }, timeout: 4000 }, (err, stdout, stderr) => {
        if (err) {
          resolve({ stdout: '', stderr: err.message });
        } else {
          resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
        }
      });
    });
  }

  public static async checkGateway(endpoint: string = 'http://localhost:20128'): Promise<GatewayStatus> {
    return new Promise((resolve) => {
      try {
        const url = new URL(endpoint);
        const req = http.request(
          {
            hostname: url.hostname,
            port: url.port || 80,
            path: '/api/monitoring/health',
            method: 'GET',
            timeout: 2500,
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              if (res.statusCode && res.statusCode < 400) {
                try {
                  const parsed = JSON.parse(data);
                  resolve({
                    connected: true,
                    endpoint,
                    version: parsed.version || 'v16.3.1',
                    providerCount: parsed.providerSummary?.catalogCount || 299,
                    activeModelCount: parsed.providerSummary?.configuredCount || 8,
                  });
                } catch {
                  resolve({ connected: true, endpoint, version: 'active' });
                }
              } else {
                resolve({ connected: false, endpoint, error: `HTTP ${res.statusCode}` });
              }
            });
          }
        );

        req.on('error', (err) => {
          resolve({ connected: false, endpoint, error: err.message });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({ connected: false, endpoint, error: 'Connection timeout' });
        });

        req.end();
      } catch (e: any) {
        resolve({ connected: false, endpoint, error: e.message });
      }
    });
  }

  public static async scanEnvironment(): Promise<SystemEnvironmentScan> {
    const gateway = await this.checkGateway('http://localhost:20128');

    // Check Git
    const gitCheck = await this.execPromise('git --version');
    const gitDetected = gitCheck.stdout.length > 0;

    // Check Agents in Parallel
    const agentResults = await Promise.all(
      KNOWN_AGENTS.map(async (spec) => {
        const whichRes = await this.execPromise(`which ${spec.cliName}`);
        if (whichRes.stdout) {
          const verRes = await this.execPromise(`${spec.cliName} ${spec.versionFlag}`);
          const version = verRes.stdout.split('\n')[0] || 'installed';
          return {
            id: spec.id,
            name: spec.name,
            cliName: spec.cliName,
            installed: true,
            version,
            binPath: whichRes.stdout,
            status: 'ready' as const,
            description: spec.description,
            installCommand: spec.installCommand,
          };
        } else {
          return {
            id: spec.id,
            name: spec.name,
            cliName: spec.cliName,
            installed: false,
            status: 'missing' as const,
            description: spec.description,
            installCommand: spec.installCommand,
          };
        }
      })
    );

    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspacePath = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;

    return {
      timestamp: new Date().toISOString(),
      platform: `${os.type()} ${os.arch()}`,
      workspacePath,
      gitDetected,
      gateway,
      agents: agentResults,
      recommendedTeamMode: gateway.connected ? 'team' : 'independent',
    };
  }
}
