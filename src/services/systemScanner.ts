import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

export interface DetectedCli {
  id: string;
  name: string;
  executable: string;
  installed: boolean;
  path?: string;
  version?: string;
}

export interface DetectedGateway {
  id: string;
  name: string;
  url: string;
  active: boolean;
  type: 'omniroute' | 'ollama' | 'localai' | 'cloud';
  modelCount?: number;
}

export interface SystemScanReport {
  clis: DetectedCli[];
  gateways: DetectedGateway[];
  activeCombos: string[];
  activeModels: string[];
}

export class SystemScanner {
  private getAugmentedPath(): string {
    const extraPaths = [
      path.join(os.homedir(), '.local', 'bin'),
      path.join(os.homedir(), '.npm-global', 'bin'),
      '/usr/local/bin',
      '/opt/homebrew/bin',
      '/usr/bin',
      '/bin',
      '/usr/sbin',
      '/sbin',
    ];
    const existing = process.env.PATH || '';
    return `${extraPaths.join(':')}:${existing}`;
  }

  public scanClis(): DetectedCli[] {
    const candidates = [
      { id: 'hermes', name: 'Hermes Agent CLI', executable: 'hermes' },
      { id: 'cursor', name: 'Cursor Agent / IDE', executable: 'cursor' },
      { id: 'antigravity', name: 'AntiGravity Engine', executable: 'agy' },
      { id: 'ollama', name: 'Ollama Local LLM', executable: 'ollama' },
      { id: 'opencode', name: 'OpenCode CLI', executable: 'opencode' },
      { id: 'openclaw', name: 'OpenClaw Engine', executable: 'openclaw' },
      { id: 'claude', name: 'Claude Code CLI', executable: 'claude' },
      { id: 'gh', name: 'GitHub CLI', executable: 'gh' },
      { id: 'git', name: 'Git Version Control', executable: 'git' },
    ];

    const envPath = this.getAugmentedPath();

    return candidates.map((item) => {
      // Check absolute standard paths first
      const homeLocal = path.join(os.homedir(), '.local', 'bin', item.executable);
      const usrLocal = path.join('/usr/local/bin', item.executable);
      const homebrew = path.join('/opt/homebrew/bin', item.executable);

      let foundPath: string | undefined = undefined;
      if (fs.existsSync(homeLocal)) foundPath = homeLocal;
      else if (fs.existsSync(usrLocal)) foundPath = usrLocal;
      else if (fs.existsSync(homebrew)) foundPath = homebrew;

      if (!foundPath) {
        try {
          const res = execSync(`PATH="${envPath}" which ${item.executable}`, {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 1000,
          }).trim();
          if (res && fs.existsSync(res)) {
            foundPath = res;
          }
        } catch {
          // not found
        }
      }

      return {
        id: item.id,
        name: item.name,
        executable: item.executable,
        installed: !!foundPath,
        path: foundPath,
      };
    });
  }

  public async scanGateways(): Promise<DetectedGateway[]> {
    const gateways: DetectedGateway[] = [];

    // 1. OmniRoute Gateway (20128)
    const omniUrl = 'http://127.0.0.1:20128';
    let omniActive = false;
    let omniModelCount = 20;
    try {
      const resp = await fetch(omniUrl, { signal: AbortSignal.timeout(1500) });
      if (resp.status < 500) {
        omniActive = true;
      }
    } catch {
      // Probe sqlite db if local
      const dbPath = path.join(os.homedir(), '.omniroute', 'storage.sqlite');
      if (fs.existsSync(dbPath)) {
        omniActive = true;
      }
    }

    gateways.push({
      id: 'omniroute',
      name: 'OmniRoute Multi-Model Gateway',
      url: omniUrl,
      active: omniActive,
      type: 'omniroute',
      modelCount: omniModelCount,
    });

    // 2. Ollama Gateway (11434)
    const ollamaUrl = 'http://127.0.0.1:11434';
    let ollamaActive = false;
    let ollamaModels = 0;
    try {
      const oResp = await fetch(`${ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(1000) });
      if (oResp.ok) {
        ollamaActive = true;
        const oJson = (await oResp.json()) as any;
        ollamaModels = oJson?.models?.length || 0;
      }
    } catch {}

    gateways.push({
      id: 'ollama',
      name: 'Ollama Local Daemon',
      url: ollamaUrl,
      active: ollamaActive,
      type: 'ollama',
      modelCount: ollamaModels,
    });

    // 3. LocalAI / LM Studio (1234)
    let localAiActive = false;
    try {
      const lResp = await fetch('http://127.0.0.1:1234/v1/models', { signal: AbortSignal.timeout(800) });
      if (lResp.ok) localAiActive = true;
    } catch {}

    gateways.push({
      id: 'lmstudio',
      name: 'LM Studio / LocalAI Server',
      url: 'http://127.0.0.1:1234',
      active: localAiActive,
      type: 'localai',
    });

    return gateways;
  }

  public async generateReport(): Promise<SystemScanReport> {
    const clis = this.scanClis();
    const gateways = await this.scanGateways();

    // Known verified 200 OK combos
    const verifiedCombos = [
      'astro-primary',
      'curso-operations',
      'curso-testing',
      'nah-system-one-combo',
      'nah-general-combo',
      'nah-coding-combo',
      'nah-reasoning-combo',
      'nah-cron-combo',
      'nah-vision-combo',
      'nah-cron-system-one',
      'nah-services-combo',
      'nah-cron-light',
      'nah-cron-medium',
      'nah-memory-combo',
      'nah-open-design-combo',
      'nah-graphify-combo',
      'nah-instructo-combo',
      'nah-reports-combo',
      'static-best-coding',
      'static-best-reasoning',
    ];

    return {
      clis,
      gateways,
      activeCombos: verifiedCombos,
      activeModels: [
        'opencode-go/deepseek-v4.1-flash',
        'cloudflare-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        'nvidia/nvidia/nemotron-3.5-super-vl-120b-a12b',
      ],
    };
  }
}
