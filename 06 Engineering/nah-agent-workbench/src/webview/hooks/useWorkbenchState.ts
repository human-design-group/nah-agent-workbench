import { useState, useEffect, useCallback } from 'react';
import {
  AgentConfig,
  LayoutMode,
  SessionMode,
  TeamConfig,
  WorkbenchState,
  HostToWebviewMessage,
  SystemEnvironmentScan,
  AttachedContextItem,
  AgentChatMessage,
} from '../types/workbench';
import { getVSCodeApi } from './useVSCodeApi';

export const UNIVERSAL_DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: 'agent-cursor',
    key: 'cursor-agent',
    name: 'Cursor Agent',
    provider: 'Cursor',
    runtime: 'cursor-agent',
    category: 'ide',
    sessionName: 'Session 01 · IDE Context',
    sessionId: 'ses-cursor-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'Claude 3.7 Sonnet (Cursor)',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'Active Project',
      worktree: 'main',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'c-msg-1',
        sender: 'agent',
        senderName: 'Cursor Agent',
        content: 'Cursor Native Agent connected. Ready for full codebase indexing, multi-file refactoring, and editor assistance.',
        tokens: 150,
        latencyMs: 180,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-codex',
    key: 'codex-chatgpt',
    name: 'ChatGPT / Codex',
    provider: 'OpenAI',
    runtime: 'codex',
    category: 'coding',
    sessionName: 'Session 01 · Code Generation',
    sessionId: 'ses-codex-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'GPT-5 Codex',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'Active Project',
      worktree: 'main',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'x-msg-1',
        sender: 'agent',
        senderName: 'ChatGPT / Codex',
        content: 'ChatGPT / OpenAI Codex CLI bridge ready. Formulate questions, algorithms, or complex implementations.',
        tokens: 160,
        latencyMs: 220,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-claude',
    key: 'claude-code',
    name: 'Claude Code',
    provider: 'Anthropic',
    runtime: 'claude',
    category: 'coding',
    sessionName: 'Session 01 · Terminal Architect',
    sessionId: 'ses-claude-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'Claude 3.7 Sonnet',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'Active Project',
      worktree: 'main',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'cl-msg-1',
        sender: 'agent',
        senderName: 'Claude Code',
        content: 'Claude Code companion ready. Autonomous file editing, bash execution, and code review loaded.',
        tokens: 175,
        latencyMs: 240,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-opencode',
    key: 'opencode',
    name: 'OpenCode',
    provider: 'OpenCode AI',
    runtime: 'opencode',
    category: 'coding',
    sessionName: 'Session 01 · Codebase Architect',
    sessionId: 'ses-opencode-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'DeepSeek V4 Pro',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'Active Project',
      worktree: 'main',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'oc-msg-1',
        sender: 'agent',
        senderName: 'OpenCode',
        content: 'OpenCode Sisyphus harness active. Ready for deep multi-file analysis and repository-level edits.',
        tokens: 190,
        latencyMs: 270,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-hermes',
    key: 'hermes',
    name: 'Hermes',
    provider: 'Nous Research',
    runtime: 'hermes',
    category: 'general',
    sessionName: 'Session 01 · Planning Coordinator',
    sessionId: 'ses-hermes-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'Hermes 3 / Kimi K2.5',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'Active Project',
      worktree: 'main',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'h-msg-1',
        sender: 'agent',
        senderName: 'Hermes',
        content: 'Hermes planning and verification engine ready. Coordinating milestone execution.',
        tokens: 140,
        latencyMs: 200,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-openclaw',
    key: 'openclaw',
    name: 'OpenClaw',
    provider: 'OpenClaw',
    runtime: 'openclaw',
    category: 'terminal',
    sessionName: 'Session 01 · System Operator',
    sessionId: 'ses-openclaw-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'Qwen3 Coder Next',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'Active Project',
      worktree: 'main',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'oc-msg-1',
        sender: 'agent',
        senderName: 'OpenClaw',
        content: 'OpenClaw terminal execution agent online. Ready for command automation.',
        tokens: 130,
        latencyMs: 190,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-gemini',
    key: 'gemini-cli',
    name: 'Gemini / Astro',
    provider: 'Google',
    runtime: 'gemini',
    category: 'general',
    sessionName: 'Session 01 · Generalist',
    sessionId: 'ses-gemini-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'Gemini 2.5 Flash',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'Active Project',
      worktree: 'main',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'g-msg-1',
        sender: 'agent',
        senderName: 'Gemini / Astro',
        content: 'Gemini generalist coding companion ready.',
        tokens: 110,
        latencyMs: 160,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-ollama',
    key: 'ollama',
    name: 'Ollama (Local)',
    provider: 'Ollama',
    runtime: 'ollama',
    category: 'local',
    sessionName: 'Session 01 · Local Offline',
    sessionId: 'ses-ollama-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'Llama 3.3 (Local)',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'Active Project',
      worktree: 'main',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'ol-msg-1',
        sender: 'agent',
        senderName: 'Ollama Local',
        content: 'Ollama local offline model runner ready.',
        tokens: 95,
        latencyMs: 140,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
];

const INITIAL_STATE: WorkbenchState = {
  layoutMode: 'vertical',
  sessionMode: 'team',
  teamConfig: {
    leadId: 'agent-cursor',
    agentIds: ['agent-cursor', 'agent-codex', 'agent-claude', 'agent-opencode'],
    projectFolder: 'Active Project',
  },
  agents: UNIVERSAL_DEFAULT_AGENTS,
  panelSlots: ['cursor-agent', 'codex-chatgpt', 'claude-code', 'opencode'],
  panelSizes: [25, 25, 25, 25],
  focusedAgentId: 'agent-cursor',
  activeDrawerAgentId: null,
  isOnboarded: false,
  remoteInfo: {
    port: 4545,
    shareCode: 'AWB100',
    currentSessionUrl: 'http://127.0.0.1:4545/?session=cursor-agent',
    workspaceUrl: 'http://127.0.0.1:4545/',
  },
};

export function useWorkbenchState() {
  const vscode = getVSCodeApi();
  const [state, setState] = useState<WorkbenchState>(INITIAL_STATE);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Request environment scan on initial mount
  useEffect(() => {
    vscode.postMessage({ type: 'REQUEST_ENVIRONMENT_SCAN' });
  }, [vscode]);

  // Persist state to extension host
  useEffect(() => {
    vscode.postMessage({
      type: 'SAVE_STATE',
      payload: state,
    });
  }, [state, vscode]);

  // Message listener from extension host
  useEffect(() => {
    const handleMessage = (event: MessageEvent<HostToWebviewMessage>) => {
      const msg = event.data;
      if (!msg) return;

      switch (msg.type) {
        case 'RESTORE_STATE':
          if (msg.payload) {
            setState((prev) => {
              const isOnboarded = msg.payload.isOnboarded ?? prev.isOnboarded;
              if (!isOnboarded) {
                setShowOnboarding(true);
              }
              return {
                ...prev,
                ...msg.payload,
                agents: msg.payload.agents && msg.payload.agents.length > 0 ? msg.payload.agents : prev.agents,
                panelSlots: msg.payload.panelSlots && msg.payload.panelSlots.length > 0 ? msg.payload.panelSlots : prev.panelSlots,
              };
            });
          }
          break;

        case 'ENVIRONMENT_SCAN_RESULT':
          setState((prev) => ({
            ...prev,
            environmentScan: msg.payload,
          }));
          break;

        case 'AGENT_STREAM_CHUNK': {
          const { agentId, delta } = msg.payload;
          setState((prev) => ({
            ...prev,
            agents: prev.agents.map((a) => {
              if (a.id !== agentId && a.key !== agentId) return a;
              const lastMsg = a.messages[a.messages.length - 1];
              if (lastMsg && lastMsg.sender === 'agent') {
                const updatedMessages = [...a.messages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMsg,
                  content: lastMsg.content + delta,
                };
                return { ...a, messages: updatedMessages };
              } else {
                return {
                  ...a,
                  messages: [
                    ...a.messages,
                    {
                      id: `stream-${Date.now()}`,
                      sender: 'agent',
                      senderName: a.name,
                      content: delta,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ],
                };
              }
            }),
          }));
          break;
        }

        case 'AGENT_MESSAGE_RECEIVED': {
          const { agentId, message } = msg.payload;
          setState((prev) => ({
            ...prev,
            agents: prev.agents.map((a) => {
              if (a.id !== agentId && a.key !== agentId) return a;
              const msgs = [...a.messages];
              const lastIdx = msgs.length - 1;
              if (lastIdx >= 0 && msgs[lastIdx].sender === 'agent') {
                msgs[lastIdx] = message;
              } else {
                msgs.push(message);
              }
              return {
                ...a,
                status: 'online',
                messages: msgs,
                attachedContext: [],
              };
            }),
          }));
          break;
        }

        case 'AGENT_STATUS_UPDATE':
          setState((prev) => ({
            ...prev,
            agents: prev.agents.map((a) => (a.id === msg.payload.agentId || a.key === msg.payload.agentId ? { ...a, status: msg.payload.status } : a)),
          }));
          break;

        case 'CONTEXT_ATTACHED': {
          const { agentId, item } = msg.payload;
          setState((prev) => ({
            ...prev,
            agents: prev.agents.map((a) => {
              if (a.id !== agentId && a.key !== agentId) return a;
              const existing = a.attachedContext || [];
              return {
                ...a,
                attachedContext: [...existing, item],
              };
            }),
          }));
          break;
        }

        case 'GIT_STATUS_UPDATE':
          setState((prev) => ({
            ...prev,
            agents: prev.agents.map((a) => ({
              ...a,
              gitStatus: msg.payload,
            })),
          }));
          break;

        case 'REMOTE_INFO_UPDATE':
          setState((prev) => ({
            ...prev,
            remoteInfo: msg.payload,
          }));
          break;

        case 'RESET_LAYOUT':
          setState(INITIAL_STATE);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const requestScan = useCallback(() => {
    vscode.postMessage({ type: 'REQUEST_ENVIRONMENT_SCAN' });
  }, [vscode]);

  const completeOnboarding = useCallback((teamMode: SessionMode, selectedAgentKeys: string[], apiKey?: string, apiEndpoint?: string) => {
    setState((prev) => ({
      ...prev,
      isOnboarded: true,
      sessionMode: teamMode,
      panelSlots: selectedAgentKeys,
      globalApiKey: apiKey || prev.globalApiKey,
      globalApiEndpoint: apiEndpoint || prev.globalApiEndpoint,
    }));
    setShowOnboarding(false);
    vscode.postMessage({
      type: 'COMPLETE_ONBOARDING',
      payload: { teamMode, selectedAgents: selectedAgentKeys, apiKey, apiEndpoint },
    });
  }, [vscode]);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setState((prev) => ({ ...prev, layoutMode: mode }));
  }, []);

  const setSessionMode = useCallback((mode: SessionMode, teamConfig?: TeamConfig) => {
    setState((prev) => ({
      ...prev,
      sessionMode: mode,
      teamConfig: teamConfig || prev.teamConfig,
      panelSlots:
        mode === 'team' && teamConfig?.agentIds
          ? teamConfig.agentIds.map((id) => prev.agents.find((a) => a.id === id)?.key || id)
          : prev.panelSlots,
    }));
    vscode.postMessage({
      type: 'SET_SESSION_MODE',
      payload: { mode, teamConfig },
    });
  }, [vscode]);

  const switchAgentSlot = useCallback((slotIndex: number, newAgentKey: string) => {
    setState((prev) => {
      const newSlots = [...prev.panelSlots];
      newSlots[slotIndex] = newAgentKey;
      return { ...prev, panelSlots: newSlots };
    });
  }, []);

  const addAgentSlot = useCallback((agentKey: string) => {
    setState((prev) => {
      if (prev.panelSlots.includes(agentKey)) {
        return prev;
      }
      return {
        ...prev,
        panelSlots: [...prev.panelSlots, agentKey],
      };
    });
  }, []);

  const closeAgentPanel = useCallback((agentId: string) => {
    setState((prev) => {
      const agent = prev.agents.find((a) => a.id === agentId || a.key === agentId);
      if (!agent) return prev;
      const newSlots = prev.panelSlots.filter((s) => s !== agent.key);
      return {
        ...prev,
        panelSlots: newSlots,
      };
    });
    vscode.postMessage({ type: 'CLOSE_AGENT_PANEL', payload: { agentId } });
  }, [vscode]);

  const setPanelSizes = useCallback((sizes: number[]) => {
    setState((prev) => ({ ...prev, panelSizes: sizes }));
  }, []);

  const setAgentModel = useCallback((agentId: string, model: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => (a.id === agentId || a.key === agentId ? { ...a, selectedModel: model } : a)),
    }));
  }, []);

  const setAgentPermissions = useCallback((agentId: string, mode: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => (a.id === agentId || a.key === agentId ? { ...a, permissionsMode: mode } : a)),
    }));
  }, []);

  const attachContext = useCallback((agentId: string, type: 'file' | 'git-diff' | 'terminal') => {
    vscode.postMessage({
      type: 'REQUEST_ATTACH_CONTEXT',
      payload: { agentId, type },
    });
  }, [vscode]);

  const removeAttachedContext = useCallback((agentId: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => {
        if (a.id !== agentId && a.key !== agentId) return a;
        return {
          ...a,
          attachedContext: (a.attachedContext || []).filter((item) => item.id !== itemId),
        };
      }),
    }));
  }, []);

  const sendMessageToAgent = useCallback((agentId: string, text: string) => {
    if (!text.trim()) return;

    const targetAgent = state.agents.find((a) => a.id === agentId || a.key === agentId);
    const attachments = targetAgent?.attachedContext || [];

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => {
        if (a.id !== agentId && a.key !== agentId) return a;
        return {
          ...a,
          status: 'thinking',
          messages: [...a.messages, userMsg],
        };
      }),
    }));

    vscode.postMessage({
      type: 'SEND_AGENT_MESSAGE',
      payload: {
        agentId,
        agentKey: targetAgent?.key || agentId,
        text,
        model: targetAgent?.selectedModel,
        attachments,
      },
    });
  }, [state.agents, vscode]);

  const forkSession = useCallback((agentId: string) => {
    vscode.postMessage({ type: 'FORK_SESSION', payload: { agentId } });
  }, [vscode]);

  const newSession = useCallback((agentId: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => {
        if (a.id !== agentId && a.key !== agentId) return a;
        return {
          ...a,
          messages: [
            {
              id: `init-${Date.now()}`,
              sender: 'agent',
              senderName: a.name,
              content: `New session initialized for ${a.name}. Workspace context ready.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        };
      }),
    }));
    vscode.postMessage({ type: 'NEW_SESSION', payload: { agentId } });
  }, [vscode]);

  const exportSession = useCallback((agentId?: string) => {
    vscode.postMessage({ type: 'EXPORT_SESSION', payload: { agentId } });
  }, [vscode]);

  const duplicateSession = useCallback((agentId?: string) => {
    vscode.postMessage({ type: 'DUPLICATE_SESSION', payload: { agentId } });
  }, [vscode]);

  const findInSession = useCallback((agentId?: string) => {
    vscode.postMessage({ type: 'FIND_IN_SESSION', payload: { agentId } });
  }, [vscode]);

  const copyRemoteUrl = useCallback((target: 'session' | 'workspace' | 'shareCode', agentId?: string) => {
    const info = state.remoteInfo;
    let textToCopy = '';
    if (target === 'session') {
      textToCopy = info?.currentSessionUrl || `http://127.0.0.1:4545/?session=${agentId || 'cursor-agent'}`;
    } else if (target === 'workspace') {
      textToCopy = info?.workspaceUrl || 'http://127.0.0.1:4545/';
    } else {
      textToCopy = info?.shareCode || 'AWB100';
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    vscode.postMessage({ type: 'COPY_REMOTE_URL', payload: { target, agentId } });
  }, [state.remoteInfo, vscode]);

  const reloadWorkbench = useCallback(() => {
    vscode.postMessage({ type: 'RELOAD_WORKBENCH' });
  }, [vscode]);

  const resetLayout = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    showOnboarding,
    setShowOnboarding,
    requestScan,
    completeOnboarding,
    setLayoutMode,
    setSessionMode,
    switchAgentSlot,
    addAgentSlot,
    closeAgentPanel,
    setPanelSizes,
    setAgentModel,
    setAgentPermissions,
    attachContext,
    removeAttachedContext,
    sendMessageToAgent,
    forkSession,
    newSession,
    exportSession,
    duplicateSession,
    findInSession,
    copyRemoteUrl,
    reloadWorkbench,
    resetLayout,
  };
}
