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
  runtime: string;
  sessionName: string;
  sessionId: string;
  status: AgentStatus;
  viewMode: AgentViewMode;
  selectedModel: string;
  permissionsMode: string;
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
}

export type WebviewToHostMessage =
  | { type: 'SAVE_STATE'; payload: WorkbenchState }
  | { type: 'LOG'; payload: { level: 'info' | 'warn' | 'error'; message: string } }
  | { type: 'SEND_AGENT_MESSAGE'; payload: { agentId: string; text: string; model?: string; attachments?: AttachedContextItem[] } }
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
  | { type: 'COMPLETE_ONBOARDING'; payload: { teamMode: SessionMode; selectedAgents: string[] } }
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
