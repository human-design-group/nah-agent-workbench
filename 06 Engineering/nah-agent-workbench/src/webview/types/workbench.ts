export type LayoutMode = 'grid' | 'vertical';

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

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  senderName?: string;
  content: string;
  timestamp: string;
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
}

export interface WorkbenchState {
  layoutMode: LayoutMode;
  agents: AgentConfig[];
  panelSizes: number[];
  focusedAgentId: string | null;
}

export type WebviewToHostMessage =
  | { type: 'SAVE_STATE'; payload: WorkbenchState }
  | { type: 'LOG'; payload: { level: 'info' | 'warn' | 'error'; message: string } }
  | { type: 'SEND_AGENT_MESSAGE'; payload: { agentId: string; text: string; model?: string } }
  | { type: 'BROADCAST_MESSAGE'; payload: { text: string; targetAgentIds: string[] } }
  | { type: 'FORK_SESSION'; payload: { agentId: string } }
  | { type: 'NEW_SESSION'; payload: { agentId: string } }
  | { type: 'EXECUTE_COMMAND'; payload: { command: string } };

export type HostToWebviewMessage =
  | { type: 'RESTORE_STATE'; payload: Partial<WorkbenchState> }
  | { type: 'AGENT_STATUS_UPDATE'; payload: { agentId: string; status: AgentStatus } }
  | { type: 'AGENT_MESSAGE_RECEIVED'; payload: { agentId: string; message: AgentChatMessage } }
  | { type: 'RESET_LAYOUT' };
