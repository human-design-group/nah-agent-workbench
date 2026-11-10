import { LayoutMode, SessionMode } from './workbench';

export type UiDensity = 'compact' | 'comfortable' | 'spacious';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type PermissionsMode = 'autonomous' | 'supervised' | 'read-only';

export interface GeneralSettings {
  defaultLayout: LayoutMode;
  uiDensity: UiDensity;
  enableSounds: boolean;
  autoFocusActiveAgent: boolean;
  streamAnimationSpeed: 'smooth' | 'instant';
  autoSaveIntervalMs: number;
}

export interface AgentCliPaths {
  antigravity?: string;
  claude?: string;
  codex?: string;
  cline?: string;
  cursor?: string;
  gemini?: string;
  hermes?: string;
  kilo?: string;
  openclaw?: string;
  opencode?: string;
  ollama?: string;
  [key: string]: string | undefined;
}

export interface AgentRuntimeSettings {
  defaultSlots: string[];
  cliPaths: AgentCliPaths;
  defaultModels: Record<string, string>;
  stepTimeoutSeconds: number;
  enableCliFallback: boolean;
  maxParallelToolCalls: number;
}

export interface TeamMissionSettings {
  defaultSessionMode: SessionMode;
  defaultTeamLead: string;
  enableSharedContextBus: boolean;
  autoSyncWorktrees: boolean;
  requireLeadApprovalForMerge: boolean;
}

export interface GatewayBridgeSettings {
  omniRouteUrl: string;
  companionPort: number;
  autoStartCompanion: boolean;
  enableNahBridge: boolean;
  gatewayToken?: string;
  reconnectIntervalMs: number;
}

export interface GitWorktreeSettings {
  worktreeRoot: string;
  branchTemplate: string;
  enforceSingleWriter: boolean;
  autoStageOnComplete: boolean;
  autoCreatePr: boolean;
}

export interface TelemetrySecuritySettings {
  defaultPermissionsMode: PermissionsMode;
  confirmDangerousCommands: boolean;
  maskSecretsInLogs: boolean;
  enableTelemetryRecording: boolean;
  tokenBudgetLimit: number;
  logLevel: LogLevel;
}

export interface AgentoSettings {
  general: GeneralSettings;
  agents: AgentRuntimeSettings;
  team: TeamMissionSettings;
  gateway: GatewayBridgeSettings;
  git: GitWorktreeSettings;
  security: TelemetrySecuritySettings;
}

export const DEFAULT_SETTINGS: AgentoSettings = {
  general: {
    defaultLayout: 'vertical',
    uiDensity: 'comfortable',
    enableSounds: true,
    autoFocusActiveAgent: true,
    streamAnimationSpeed: 'smooth',
    autoSaveIntervalMs: 3000,
  },
  agents: {
    defaultSlots: ['uno', 'omo', 'gravito', 'humano'],
    cliPaths: {
      uno: 'hermes',
      omo: 'hermes',
      curso: 'cursor',
      humano: 'hermes',
      gravito: 'agy',
      astro: 'hermes',
    },
    defaultModels: {
      uno: 'nah-general-combo',
      omo: 'nah-coding-combo',
      curso: 'static-best-coding',
      humano: 'nah-reasoning-combo',
      gravito: 'gemini/gemini-2.5-pro',
      astro: 'astro-primary',
    },
    stepTimeoutSeconds: 180,
    enableCliFallback: true,
    maxParallelToolCalls: 4,
  },
  team: {
    defaultSessionMode: 'independent',
    defaultTeamLead: 'uno',
    enableSharedContextBus: true,
    autoSyncWorktrees: true,
    requireLeadApprovalForMerge: true,
  },
  gateway: {
    omniRouteUrl: 'http://localhost:20128',
    companionPort: 4545,
    autoStartCompanion: true,
    enableNahBridge: true,
    gatewayToken: '',
    reconnectIntervalMs: 5000,
  },
  git: {
    worktreeRoot: '~/worktrees',
    branchTemplate: 'agent/{agent}/{session}',
    enforceSingleWriter: true,
    autoStageOnComplete: false,
    autoCreatePr: false,
  },
  security: {
    defaultPermissionsMode: 'autonomous',
    confirmDangerousCommands: true,
    maskSecretsInLogs: true,
    enableTelemetryRecording: true,
    tokenBudgetLimit: 500000,
    logLevel: 'info',
  },
};
