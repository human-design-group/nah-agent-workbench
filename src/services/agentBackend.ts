import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawn, execSync } from 'child_process';

export interface DiscoveredAgent {
  key: string;
  name: string;
  runtime: string;
  role: string;
  detected: boolean;
  defaultModel: string;
}

export interface ModelCatalog {
  combos: string[];
  models: string[];
}

export type ProviderType =
  | 'omniroute'
  | 'openrouter'
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'ollama'
  | 'lmstudio'
  | 'custom';

export interface ProviderConfig {
  type: ProviderType;
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
}

export interface ProviderTestResult {
  ok: boolean;
  message: string;
  latencyMs: number;
  models?: string[];
}

export interface AgentExecutionResult {
  content: string;
  thinking?: string;
  toolCalls?: { name: string; status: 'running' | 'done' | 'error'; summary?: string }[];
  tokens: number;
  latencyMs: number;
}

export class AgentBackend {
  private omniRouteKey: string = '';
  private omniRouteBaseUrl: string = 'http://127.0.0.1:20128';
  private providerConfig: ProviderConfig = {
    type: 'omniroute',
    baseUrl: 'http://127.0.0.1:20128',
  };

  constructor() {
    this.loadOmniRouteKey();
    this.detectInitialProvider();
  }

  public setProviderConfig(config: ProviderConfig): void {
    this.providerConfig = { ...this.providerConfig, ...config };
    if (config.baseUrl && config.type === 'omniroute') {
      this.omniRouteBaseUrl = config.baseUrl;
    }
  }

  public getProviderConfig(): ProviderConfig {
    return { ...this.providerConfig };
  }

  private detectInitialProvider(): void {
    // Default to local OmniRoute gateway on localhost:20128 for notahuman ecosystem
    this.providerConfig = {
      type: 'omniroute',
      baseUrl: 'http://127.0.0.1:20128',
    };
  }

  private loadOmniRouteKey(): string {
    if (this.omniRouteKey) return this.omniRouteKey;
    try {
      const envPath = path.join(os.homedir(), '.omniroute', '.env');
      if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, 'utf8').split('\n');
        for (const line of lines) {
          if (line.startsWith('OMNIROUTE_API_KEY=')) {
            this.omniRouteKey = line.split('=')[1].trim();
            break;
          }
        }
      }
    } catch (e) {
      console.warn('[AgentBackend] Failed to load OmniRoute key from .env:', e);
    }
    return this.omniRouteKey;
  }

  private findHermesBinary(): string {
    const candidates = [
      path.join(os.homedir(), '.local', 'bin', 'hermes'),
      '/usr/local/bin/hermes',
      '/opt/homebrew/bin/hermes',
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    return 'hermes';
  }

  private getAugmentedEnv(): NodeJS.ProcessEnv {
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
    return {
      ...process.env,
      PATH: `${extraPaths.join(':')}:${existing}`,
      TERM: 'dumb',
      HERMES_ACCEPT_HOOKS: '1',
    };
  }

  /**
   * Reads canonical active combos directly from OmniRoute SQLite database.
   */
  private getOmniRouteCombosFromSqlite(): string[] {
    const dbPath = path.join(os.homedir(), '.omniroute', 'storage.sqlite');
    if (!fs.existsSync(dbPath)) return [];
    try {
      const stdout = execSync(
        `/usr/bin/sqlite3 "${dbPath}" "SELECT name FROM combos ORDER BY sort_order ASC;"`,
        { encoding: 'utf8', timeout: 3000 }
      );
      return stdout
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.includes('╭') && !l.includes('│') && !l.includes('╞') && !l.includes('╰') && l !== 'name');
    } catch (err) {
      console.warn('[AgentBackend] SQLite query for combos failed:', err);
      return [];
    }
  }

  /**
   * Dynamically discovers agents by reading ~/.hermes/profiles and system CLIs.
   */
  public discoverAgents(): DiscoveredAgent[] {
    const hermesProfilesDir = path.join(os.homedir(), '.hermes', 'profiles');
    let hermesProfiles: string[] = [];

    if (fs.existsSync(hermesProfilesDir)) {
      try {
        hermesProfiles = fs.readdirSync(hermesProfilesDir).filter((file) => {
          return fs.statSync(path.join(hermesProfilesDir, file)).isDirectory() && !file.startsWith('.');
        });
      } catch (e) {
        console.warn('[AgentBackend] Error reading Hermes profiles directory:', e);
      }
    }

    // Default canonical agents
    const canonicalMap: Record<string, { name: string; runtime: string; role: string; defaultModel: string }> = {
      uno: {
        name: 'Uno',
        runtime: 'hermes',
        role: 'Chief of Staff & CEO Liaison',
        defaultModel: 'nah-general-combo',
      },
      omo: {
        name: 'Omo',
        runtime: 'hermes',
        role: 'Lead Developer & Engineering Lead',
        defaultModel: 'nah-coding-combo',
      },
      gravito: {
        name: 'Gravito',
        runtime: 'antigravity',
        role: 'AI Systems Engineer & Specialist',
        defaultModel: 'nah-services-combo',
      },
      humano: {
        name: 'Humano',
        runtime: 'hermes',
        role: 'Community & Design Specialist',
        defaultModel: 'nah-reasoning-combo',
      },
      curso: {
        name: 'Curso',
        runtime: 'cursor-agent',
        role: 'Ephemeral Developer (Editor Specialist)',
        defaultModel: 'curso-operations',
      },
      astro: {
        name: 'Astro',
        runtime: 'hermes',
        role: 'AI Systems Architect & Ideator',
        defaultModel: 'astro-primary',
      },
    };

    const agents: DiscoveredAgent[] = [];

    // Add canonical agents first
    for (const [key, info] of Object.entries(canonicalMap)) {
      const isDetected =
        info.runtime === 'hermes'
          ? hermesProfiles.includes(key)
          : true;

      agents.push({
        key,
        name: info.name,
        runtime: info.runtime,
        role: info.role,
        detected: isDetected,
        defaultModel: info.defaultModel,
      });
    }

    // Add any extra discovered Hermes profiles
    for (const profile of hermesProfiles) {
      if (!canonicalMap[profile]) {
        agents.push({
          key: profile,
          name: profile.charAt(0).toUpperCase() + profile.slice(1),
          runtime: 'hermes',
          role: `Hermes Agent (${profile})`,
          detected: true,
          defaultModel: 'nah-general-combo',
        });
      }
    }

    return agents;
  }

  /**
   * Fetches fresh models and combos from OmniRoute SQLite and API.
   * Filters strictly to verified working combos and active providers.
   */
  public async fetchModels(): Promise<ModelCatalog> {
    const sqliteCombos = this.getOmniRouteCombosFromSqlite();
    const key = this.loadOmniRouteKey();
    let apiCombos: string[] = [];

    try {
      const resp = await fetch(`${this.omniRouteBaseUrl}/v1/models`, {
        headers: key ? { Authorization: `Bearer ${key}` } : {},
      });

      if (resp.ok) {
        const json = (await resp.json()) as any;
        const rawList: string[] = (json.data || []).map((m: any) => m.id);

        apiCombos = rawList.filter(
          (id) =>
            id.includes('combo') ||
            id.includes('primary') ||
            id.includes('static') ||
            id.startsWith('curso-')
        );
      }
    } catch (err) {
      console.warn('[AgentBackend] OmniRoute /v1/models fetch failed; falling back to SQLite combos:', err);
    }

    const mergedCombos = Array.from(new Set([...sqliteCombos, ...apiCombos]));
    const verifiedWorkingCombos = [
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

    const finalCombos = mergedCombos.length > 0
      ? mergedCombos.filter((c) => !c.includes('embedding') && !c.includes('jev'))
      : verifiedWorkingCombos;

    return {
      combos: finalCombos.length > 0 ? finalCombos : verifiedWorkingCombos,
      models: [
        'nvidia/nvidia/nemotron-3.5-super-vl-120b-a12b',
        'cloudflare-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      ],
    };
  }

  /**
   * Executes a message query against the selected agent.
   * If it's a Hermes agent, tries CLI execution first with timeout.
   * Falls back to OmniRoute chat completions with full persona context.
   */
  public async executeMessage(
    agentKey: string,
    prompt: string,
    modelName?: string
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    const cleanKey = agentKey.replace('agent-', '');

    // Grounded canonical personas with ecosystem awareness
    const personas: Record<string, string> = {
      uno: 'You are Uno, Chief of Staff (CoS) and Strategic Lead on Hermes Gateway for notahuman. You coordinate organizational priorities, brief the CEO (human), oversee operations across all agents (Omo, Gravito, Astro, Humano, Curso), and maintain ecosystem integrity. You are communicating with human in the Agento Agent Workbench extension in Cursor.',
      omo: 'You are Omo, CTEO and Lead Developer on Hermes Gateway for notahuman. You manage architecture, codebase development, CI/CD pipelines, and adversarial code reviews. You are communicating with human in the Agento Agent Workbench extension in Cursor.',
      gravito: 'You are Gravito, resident AI Systems Engineer on Google Antigravity in the notahuman ecosystem. You manage MCP infrastructure, extension development, agent workbench architecture, and out-of-band system stabilization. You are communicating directly with human (CEO) inside Cursor IDE via the Agento Agent Workbench extension. Respond in character with deep technical clarity, precision, and systems engineering expertise.',
      humano: 'You are Humano, Community & Design Specialist on Hermes Gateway for notahuman. You maintain design systems, Figma tokens, UI parity, and front-end polish. You are communicating with human in the Agento Agent Workbench extension in Cursor.',
      curso: 'You are Curso, Ephemeral Developer and Editor Specialist inside Cursor IDE for notahuman. You specialize in swift, inline code repairs, editor ergonomics, and workspace diagnostics. You are communicating with human in the Agento Agent Workbench extension in Cursor.',
      astro: 'You are Astro, Context-Aware Ideation Partner & AI Systems Architect on Hermes Gateway for notahuman. You ideate on architectures, design roadmaps, and explore technical paradigms with creative velocity for the CEO (human). You are communicating with human in the Agento Agent Workbench extension in Cursor.',
    };

    const systemPrompt = personas[cleanKey] || `You are ${cleanKey}, an active agent in the notahuman ecosystem.`;

    // Normalize effective model first so it can be passed to CLI or API
    let effectiveModel = modelName?.trim();
    if (
      !effectiveModel ||
      effectiveModel.startsWith('OmniRoute -') ||
      effectiveModel.includes('Claude 3.7') ||
      effectiveModel.includes('Assistant') ||
      effectiveModel === 'undefined'
    ) {
      effectiveModel = this.getDefaultModelForAgent(cleanKey);
    }

    // Attempt Hermes CLI execution if it is a Hermes agent
    const isHermesAgent = ['uno', 'omo', 'humano', 'astro'].includes(cleanKey);
    if (isHermesAgent) {
      try {
        const cliResult = await this.runHermesCli(cleanKey, prompt, effectiveModel, 65000);
        if (cliResult && cliResult.trim().length > 0) {
          const latencyMs = Date.now() - startTime;
          return {
            content: cliResult,
            thinking: `Executed reasoning chain via Hermes profile [${cleanKey}] using model [${effectiveModel}].`,
            toolCalls: [{ name: `hermes -p ${cleanKey}`, status: 'done', summary: `Model: ${effectiveModel}` }],
            tokens: Math.ceil(cliResult.length / 4) + 60,
            latencyMs,
          };
        }
      } catch (err: any) {
        console.warn(`[AgentBackend] Hermes CLI for ${cleanKey} skipped/timed out (${err.message}), falling back to OmniRoute.`);
      }
    }

    // If model is an ecosystem combo or OmniRoute model, ALWAYS route via OmniRoute!
    const isEcosystemModel =
      effectiveModel.includes('combo') ||
      effectiveModel.includes('primary') ||
      effectiveModel.includes('operations') ||
      effectiveModel.includes('static-best');

    if (!isEcosystemModel) {
      // Check if user has an active direct cloud or local provider configured
      if (this.providerConfig.type === 'anthropic' && this.providerConfig.apiKey) {
        return this.queryAnthropicDirect(cleanKey, systemPrompt, prompt, effectiveModel, startTime);
      } else if (
        this.providerConfig.type !== 'omniroute' &&
        (this.providerConfig.apiKey || this.providerConfig.type === 'ollama' || this.providerConfig.type === 'lmstudio')
      ) {
        return this.queryOpenAICompatible(this.providerConfig, cleanKey, systemPrompt, prompt, effectiveModel, startTime);
      }
    }

    return this.queryOmniRoute(cleanKey, systemPrompt, prompt, effectiveModel, startTime);
  }

  private getDefaultModelForAgent(key: string): string {
    switch (key) {
      case 'omo':
        return 'nah-coding-combo';
      case 'gravito':
        return 'nah-services-combo';
      case 'humano':
        return 'nah-reasoning-combo';
      case 'astro':
        return 'astro-primary';
      case 'curso':
        return 'curso-operations';
      case 'uno':
      default:
        return 'nah-general-combo';
    }
  }

  private runHermesCli(
    profile: string,
    prompt: string,
    modelName?: string,
    timeoutMs: number = 65000
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let resolved = false;
      const hermesBin = this.findHermesBinary();
      const env = this.getAugmentedEnv();

      // Programmatic non-interactive execution: hermes -p <profile> chat [-m <model>] -q "<prompt>" --oneshot -Q
      const args = ['-p', profile, 'chat'];
      if (modelName && !modelName.startsWith('OmniRoute -') && !modelName.includes('undefined')) {
        args.push('-m', modelName);
      }
      args.push('-q', prompt, '--oneshot', '-Q');

      const proc = spawn(hermesBin, args, { env });

      let stdout = '';
      let stderr = '';

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          proc.kill('SIGTERM');
          reject(new Error(`Hermes CLI timed out after ${timeoutMs}ms`));
        }
      }, timeoutMs);

      proc.stdout.on('data', (d) => {
        stdout += d.toString();
      });

      proc.stderr.on('data', (d) => {
        stderr += d.toString();
      });

      proc.on('close', (code) => {
        clearTimeout(timer);
        if (resolved) return;
        resolved = true;

        if (code === 0 && stdout.trim().length > 0) {
          const parsed = this.parseHermesOutput(stdout);
          resolve(parsed);
        } else {
          reject(new Error(`Hermes CLI exited with code ${code}: ${stderr || stdout}`));
        }
      });

      proc.on('error', (err) => {
        clearTimeout(timer);
        if (resolved) return;
        resolved = true;
        reject(err);
      });
    });
  }

  private parseHermesOutput(raw: string): string {
    // Strip ANSI escape sequences
    const clean = raw.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '').replace(/\r/g, '');
    const lines = clean.split('\n');

    // Filter out session resumption headers, metadata lines, and border lines
    const contentLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line.startsWith('─────') ||
        line.startsWith('Resume this session with:') ||
        line.startsWith('Session:') ||
        line.startsWith('Title:') ||
        line.startsWith('Duration:') ||
        line.startsWith('Messages:') ||
        line.startsWith('session_id:') ||
        line.startsWith('Last progress:') ||
        line.startsWith('[nah-behave]') ||
        line.startsWith('Query:') ||
        line.includes('Failed to start wake word') ||
        line.includes('Wake-word microphone is already owned')
      ) {
        continue;
      }
      contentLines.push(lines[i]);
    }

    const result = contentLines.join('\n').trim();
    return result.length > 0 ? result : raw.trim();
  }

  private async queryOmniRoute(
    agentKey: string,
    systemPrompt: string,
    prompt: string,
    model: string,
    startTime: number
  ): Promise<AgentExecutionResult> {
    const key = this.loadOmniRouteKey();
    const url = `${this.omniRouteBaseUrl}/v1/chat/completions`;

    // Resilient fallback candidate chain if requested model returns 400/429/500/503
    const candidateModels = [
      model,
      'curso-operations',
      'nah-general-combo',
      'astro-primary',
      'nah-services-combo',
      'static-best-coding',
    ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

    let lastError: Error | null = null;

    for (const currentModel of candidateModels) {
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(key ? { Authorization: `Bearer ${key}` } : {}),
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            max_tokens: 2048,
          }),
        });

        if (!resp.ok) {
          const errText = await resp.text();
          console.warn(`[AgentBackend] Model ${currentModel} returned HTTP ${resp.status}: ${errText.slice(0, 100)}`);
          lastError = new Error(`HTTP ${resp.status}: ${errText.slice(0, 80)}`);
          continue; // try next candidate in chain
        }

        const data = (await resp.json()) as any;
        const choice = data.choices?.[0];
        let content = choice?.message?.content || choice?.message?.reasoning_content || 'Response processed successfully.';

        if (!choice?.message?.content && choice?.message?.reasoning_content) {
          const rawReason = choice.message.reasoning_content;
          const cleanReason = rawReason.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
          content = cleanReason.length > 0 ? cleanReason : rawReason;
        }

        const tokens = data.usage?.total_tokens || Math.ceil((prompt.length + content.length) / 4);
        const latencyMs = Date.now() - startTime;
        const usedFallback = currentModel !== model;

        return {
          content,
          thinking: usedFallback
            ? `Routed via resilient fallback combo [${currentModel}] (requested [${model}] unavailable).`
            : choice?.message?.reasoning_content
            ? `Reasoning model deliberation: ${choice.message.reasoning_content.slice(0, 150)}...`
            : `Deliberated via model [${currentModel}] on OmniRoute gateway.`,
          toolCalls: [{ name: 'OmniRoute Gateway', status: 'done', summary: `Model: ${currentModel}` }],
          tokens,
          latencyMs,
        };
      } catch (err: any) {
        lastError = err;
        console.warn(`[AgentBackend] Network/dispatch error for model ${currentModel}:`, err.message);
      }
    }

    const latencyMs = Date.now() - startTime;
    return {
      content: `[${agentKey.toUpperCase()}]: Welcome to Agento! Local model gateway at port 20128 is offline. Open Settings (gear icon) or the Walkthrough to configure an API key (OpenRouter, Anthropic, OpenAI) or local AI (Ollama).`,
      thinking: `Fallback handler invoked for ${agentKey}. OmniRoute unreachable (${lastError?.message || 'offline'}).`,
      toolCalls: [{ name: 'Setup Required', status: 'error', summary: 'Configure Provider in Settings' }],
      tokens: 40,
      latencyMs,
    };
  }

  /**
   * Tests connection to a model provider (OpenRouter, OpenAI, Anthropic, Gemini, Ollama, LM Studio, OmniRoute).
   */
  public async testConnection(config: ProviderConfig): Promise<ProviderTestResult> {
    const start = Date.now();
    try {
      if (config.type === 'anthropic') {
        if (!config.apiKey) {
          return { ok: false, message: 'Anthropic API key is required.', latencyMs: 0 };
        }
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 5,
            messages: [{ role: 'user', content: 'Ping' }],
          }),
        });
        const latencyMs = Date.now() - start;
        if (resp.ok) {
          return { ok: true, message: `Connected to Anthropic API (${latencyMs}ms)`, latencyMs, models: ['claude-3-7-sonnet', 'claude-3-5-sonnet', 'claude-3-haiku'] };
        }
        const err = await resp.text();
        return { ok: false, message: `Anthropic error (HTTP ${resp.status}): ${err.slice(0, 100)}`, latencyMs };
      }

      if (config.type === 'ollama') {
        const base = config.baseUrl || 'http://localhost:11434';
        const resp = await fetch(`${base}/api/tags`);
        const latencyMs = Date.now() - start;
        if (resp.ok) {
          const json = (await resp.json()) as any;
          const models = (json.models || []).map((m: any) => m.name);
          return {
            ok: true,
            message: `Connected to local Ollama (${latencyMs}ms). ${models.length} model(s) available.`,
            latencyMs,
            models,
          };
        }
        return { ok: false, message: `Ollama returned HTTP ${resp.status}. Ensure Ollama is running.`, latencyMs };
      }

      if (config.type === 'lmstudio') {
        const base = config.baseUrl || 'http://localhost:1234';
        const resp = await fetch(`${base}/v1/models`);
        const latencyMs = Date.now() - start;
        if (resp.ok) {
          const json = (await resp.json()) as any;
          const models = (json.data || []).map((m: any) => m.id);
          return {
            ok: true,
            message: `Connected to local LM Studio (${latencyMs}ms). ${models.length} model(s) active.`,
            latencyMs,
            models,
          };
        }
        return { ok: false, message: `LM Studio returned HTTP ${resp.status}. Ensure local server is started.`, latencyMs };
      }

      if (config.type === 'openrouter') {
        if (!config.apiKey) {
          return { ok: false, message: 'OpenRouter API key is required.', latencyMs: 0 };
        }
        const resp = await fetch('https://openrouter.ai/api/v1/models', {
          headers: { Authorization: `Bearer ${config.apiKey}` },
        });
        const latencyMs = Date.now() - start;
        if (resp.ok) {
          const json = (await resp.json()) as any;
          const count = (json.data || []).length;
          return {
            ok: true,
            message: `Connected to OpenRouter (${latencyMs}ms) — ${count}+ models available.`,
            latencyMs,
            models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-2.0-flash-001', 'deepseek/deepseek-r1'],
          };
        }
        return { ok: false, message: `OpenRouter returned HTTP ${resp.status}. Check API key.`, latencyMs };
      }

      if (config.type === 'openai') {
        if (!config.apiKey) {
          return { ok: false, message: 'OpenAI API key is required.', latencyMs: 0 };
        }
        const resp = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${config.apiKey}` },
        });
        const latencyMs = Date.now() - start;
        if (resp.ok) {
          return {
            ok: true,
            message: `Connected to OpenAI API (${latencyMs}ms).`,
            latencyMs,
            models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1'],
          };
        }
        return { ok: false, message: `OpenAI returned HTTP ${resp.status}. Check API key.`, latencyMs };
      }

      if (config.type === 'gemini') {
        if (!config.apiKey) {
          return { ok: false, message: 'Gemini API key is required.', latencyMs: 0 };
        }
        const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/models', {
          headers: { Authorization: `Bearer ${config.apiKey}` },
        });
        const latencyMs = Date.now() - start;
        if (resp.ok) {
          return {
            ok: true,
            message: `Connected to Google Gemini (${latencyMs}ms).`,
            latencyMs,
            models: ['gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-1.5-pro'],
          };
        }
        return { ok: false, message: `Gemini returned HTTP ${resp.status}. Check API key.`, latencyMs };
      }

      // Default: OmniRoute / Custom endpoint
      const base = config.baseUrl || this.omniRouteBaseUrl;
      const key = config.apiKey || this.loadOmniRouteKey();
      const resp = await fetch(`${base}/v1/models`, {
        headers: key ? { Authorization: `Bearer ${key}` } : {},
      });
      const latencyMs = Date.now() - start;
      if (resp.ok) {
        const json = (await resp.json()) as any;
        const count = (json.data || []).length;
        return {
          ok: true,
          message: `Connected to gateway (${latencyMs}ms) — ${count} route(s) active.`,
          latencyMs,
          models: (json.data || []).map((m: any) => m.id).slice(0, 20),
        };
      }
      return { ok: false, message: `Gateway at ${base} returned HTTP ${resp.status}.`, latencyMs };
    } catch (err: any) {
      return { ok: false, message: `Connection error: ${err.message || 'Host unreachable'}`, latencyMs: Date.now() - start };
    }
  }

  private async queryAnthropicDirect(
    agentKey: string,
    systemPrompt: string,
    prompt: string,
    model: string,
    startTime: number
  ): Promise<AgentExecutionResult> {
    const key = this.providerConfig.apiKey;
    const targetModel = model.includes('claude') ? model : 'claude-3-5-sonnet-20241022';
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${errText.slice(0, 100)}`);
      }

      const data = (await resp.json()) as any;
      const content = data.content?.[0]?.text || 'Response received.';
      const tokens = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
      const latencyMs = Date.now() - startTime;

      return {
        content,
        thinking: `Deliberated directly via Anthropic [${targetModel}].`,
        toolCalls: [{ name: 'Anthropic Direct', status: 'done', summary: targetModel }],
        tokens: tokens || Math.ceil((prompt.length + content.length) / 4),
        latencyMs,
      };
    } catch (err: any) {
      return {
        content: `[${agentKey.toUpperCase()}]: Direct Anthropic call failed: ${err.message}. Check API key in Settings.`,
        thinking: `Direct Anthropic error: ${err.message}`,
        toolCalls: [{ name: 'Anthropic API', status: 'error', summary: 'Call failed' }],
        tokens: 30,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  private async queryOpenAICompatible(
    config: ProviderConfig,
    agentKey: string,
    systemPrompt: string,
    prompt: string,
    model: string,
    startTime: number
  ): Promise<AgentExecutionResult> {
    let baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    if (config.type === 'openrouter') baseUrl = 'https://openrouter.ai/api/v1';
    else if (config.type === 'ollama') baseUrl = 'http://localhost:11434/v1';
    else if (config.type === 'lmstudio') baseUrl = 'http://localhost:1234/v1';
    else if (config.type === 'gemini') baseUrl = 'https://generativelanguage.googleapis.com/v1beta/openai';

    const url = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

    let targetModel = model;
    if (config.type === 'openrouter' && (model.includes('combo') || model.includes('primary'))) {
      targetModel = 'anthropic/claude-3.5-sonnet';
    } else if (config.type === 'openai' && (model.includes('combo') || model.includes('primary'))) {
      targetModel = 'gpt-4o';
    } else if (config.type === 'gemini' && (model.includes('combo') || model.includes('primary'))) {
      targetModel = 'gemini-2.0-flash';
    }

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          max_tokens: 800,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${errText.slice(0, 100)}`);
      }

      const data = (await resp.json()) as any;
      const choice = data.choices?.[0];
      const content = choice?.message?.content || choice?.message?.reasoning_content || 'Response processed.';
      const tokens = data.usage?.total_tokens || Math.ceil((prompt.length + content.length) / 4);
      const latencyMs = Date.now() - startTime;

      return {
        content,
        thinking: `Processed via ${config.type.toUpperCase()} [${targetModel}].`,
        toolCalls: [{ name: `${config.type.toUpperCase()} API`, status: 'done', summary: targetModel }],
        tokens,
        latencyMs,
      };
    } catch (err: any) {
      return {
        content: `[${agentKey.toUpperCase()}]: ${config.type.toUpperCase()} call failed (${err.message}). Check connection settings.`,
        thinking: `Provider dispatch error: ${err.message}`,
        toolCalls: [{ name: `${config.type.toUpperCase()} Error`, status: 'error', summary: err.message.slice(0, 30) }],
        tokens: 30,
        latencyMs: Date.now() - startTime,
      };
    }
  }
}
