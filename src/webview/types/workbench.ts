export type LayoutMode = 'grid' | 'vertical' | 'horizontal' | 'split-3' | 'focus';

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
}

export interface WorkbenchState {
  layoutMode: LayoutMode;
  agents: AgentConfig[];
  panelSlots: string[];
  panelSizes: number[];
  focusedAgentId: string | null;
  activeDrawerAgentId: string | null; // which agent's drawer is open
}

export type WebviewToHostMessage =
  | { type: 'SAVE_STATE'; payload: WorkbenchState }
  | { type: 'LOG'; payload: { level: 'info' | 'warn' | 'error'; message: string } }
  | { type: 'SEND_AGENT_MESSAGE'; payload: { agentId: string; text: string; model?: string } }
  | { type: 'BROADCAST_MESSAGE'; payload: { text: string; targetAgentIds: string[] } }
  | { type: 'FORK_SESSION'; payload: { agentId: string } }
  | { type: 'NEW_SESSION'; payload: { agentId: string } }
  | { type: 'SWITCH_AGENT_SLOT'; payload: { slotIndex: number; newAgentKey: string } }
  | { type: 'REORDER_SLOTS'; payload: { sourceIndex: number; targetIndex: number } }
  | { type: 'OPEN_NATIVE_APP'; payload: { agentId: string } }
  | { type: 'EXECUTE_COMMAND'; payload: { command: string } };

export type HostToWebviewMessage =
  | { type: 'RESTORE_STATE'; payload: Partial<WorkbenchState> }
  | { type: 'AGENT_STATUS_UPDATE'; payload: { agentId: string; status: AgentStatus } }
  | { type: 'AGENT_MESSAGE_RECEIVED'; payload: { agentId: string; message: AgentChatMessage } }
  | { type: 'RESET_LAYOUT' };
