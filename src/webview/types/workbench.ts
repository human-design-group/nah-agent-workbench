export type LayoutMode = 'grid' | 'vertical' | 'horizontal' | 'split-3' | 'focus';

export type SessionMode = 'independent' | 'team';

export type AgentStatus = 'online' | 'thinking' | 'idle' | 'error' | 'offline';

export type AgentViewMode = 'chat' | 'terminal' | 'nahchat';

export interface GitStatusInfo {
  workspace: string;
  worktree: string;
  branch: string;
  modified: number;
  staged: number;
  untracked: number;
  divergence: number;
}

export interface ToolCallBadge {
  name: string;
  status: 'running' | 'done' | 'error';
  summary: string;
}

export interface AttachedContextItem {
  id: string;
  title: string;
  content: string;
  type: 'file' | 'git-diff' | 'terminal' | 'figma';
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  senderName?: string;
  content: string;
  thinking?: string;
  toolCalls?: ToolCallBadge[];
  tokens?: number;
  latencyMs?: number;
  timestamp: string;
}

export interface AgentProjectSession {
  id: string;
  name: string;
  updatedAt: string;
}

export interface AgentProject {
  id: string;
  name: string;
  sessions: AgentProjectSession[];
  totalSessions: number;
}

export interface AgentConfig {
  id: string;
  key: string;
  name: string;
  provider: string;
  runtime: string;
  category: 'coding' | 'general' | 'terminal' | 'local' | 'ide';
  sessionName: string;
  sessionId: string;
  status: AgentStatus;
  viewMode: AgentViewMode;
  selectedModel: string;
  permissionsMode: string;
  apiEndpoint?: string;
  apiKey?: string;
  gitStatus: GitStatusInfo;
  messages: AgentChatMessage[];
  projects?: AgentProject[];
  scheduledTasks?: { id: string; name: string; cron: string; active: boolean }[];
  attachedContext?: AttachedContextItem[];
}

export interface TeamConfig {
  leadId: string;
  agentIds: string[];
  projectFolder: string;
}

export interface RemoteShareInfo {
  currentSessionUrl: string;
  workspaceUrl: string;
  shareCode: string;
  port: number;
}

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

export interface WorkbenchState {
  layoutMode: LayoutMode;
  sessionMode: SessionMode;
  teamConfig?: TeamConfig;
  agents: AgentConfig[];
  panelSlots: string[];
  panelSizes: number[];
  focusedAgentId: string | null;
  activeDrawerAgentId: string | null;
  remoteInfo?: RemoteShareInfo;
  isOnboarded?: boolean;
  environmentScan?: SystemEnvironmentScan;
  globalApiEndpoint?: string;
  globalApiKey?: string;
}

export type WebviewToHostMessage =
  | { type: 'SAVE_STATE'; payload: WorkbenchState }
  | { type: 'LOG'; payload: { level: 'info' | 'warn' | 'error'; message: string } }
  | { type: 'SEND_AGENT_MESSAGE'; payload: { agentId: string; agentKey: string; text: string; model?: string; attachments?: AttachedContextItem[] } }
  | { type: 'BROADCAST_MESSAGE'; payload: { text: string; targetAgentIds: string[] } }
  | { type: 'FORK_SESSION'; payload: { agentId: string } }
  | { type: 'NEW_SESSION'; payload: { agentId: string } }
  | { type: 'SWITCH_AGENT_SLOT'; payload: { slotIndex: number; newAgentKey: string } }
  | { type: 'REORDER_SLOTS'; payload: { sourceIndex: number; targetIndex: number } }
  | { type: 'OPEN_NATIVE_APP'; payload: { agentId: string } }
  | { type: 'EXECUTE_COMMAND'; payload: { command: string } }
  | { type: 'SET_SESSION_MODE'; payload: { mode: SessionMode; teamConfig?: TeamConfig } }
  | { type: 'EXPORT_SESSION'; payload: { agentId?: string } }
  | { type: 'DUPLICATE_SESSION'; payload: { agentId?: string } }
  | { type: 'FIND_IN_SESSION'; payload: { agentId?: string } }
  | { type: 'CLOSE_AGENT_PANEL'; payload: { agentId: string } }
  | { type: 'COPY_REMOTE_URL'; payload: { target: 'session' | 'workspace' | 'shareCode'; agentId?: string } }
  | { type: 'REQUEST_ENVIRONMENT_SCAN' }
  | { type: 'REQUEST_ATTACH_CONTEXT'; payload: { agentId: string; type: 'file' | 'git-diff' | 'terminal' } }
  | { type: 'COMPLETE_ONBOARDING'; payload: { teamMode: SessionMode; selectedAgents: string[]; apiKey?: string; apiEndpoint?: string } }
  | { type: 'RELOAD_WORKBENCH' };

export type HostToWebviewMessage =
  | { type: 'RESTORE_STATE'; payload: Partial<WorkbenchState> }
  | { type: 'AGENT_STATUS_UPDATE'; payload: { agentId: string; status: AgentStatus } }
  | { type: 'AGENT_STREAM_CHUNK'; payload: { agentId: string; delta: string; fullContent: string } }
  | { type: 'AGENT_MESSAGE_RECEIVED'; payload: { agentId: string; message: AgentChatMessage } }
  | { type: 'ENVIRONMENT_SCAN_RESULT'; payload: SystemEnvironmentScan }
  | { type: 'CONTEXT_ATTACHED'; payload: { agentId: string; item: AttachedContextItem } }
  | { type: 'GIT_STATUS_UPDATE'; payload: GitStatusInfo }
  | { type: 'RESET_LAYOUT' }
  | { type: 'REMOTE_INFO_UPDATE'; payload: RemoteShareInfo };
