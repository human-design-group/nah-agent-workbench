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

const DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: 'agent-astro',
    key: 'astro',
    name: 'Astro',
    runtime: 'antigravity',
    sessionName: 'Session 01 · Supervisor',
    sessionId: 'ses-astro-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'curso-production',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'Agent Workbench',
      worktree: 'astro/worktree',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'a-msg-1',
        sender: 'agent',
        senderName: 'Astro',
        content: 'AntiGravity Supervisor online. Ready for parallel orchestration, code generation, and multi-agent coordination.',
        tokens: 180,
        latencyMs: 240,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-humano',
    key: 'humano',
    name: 'Humano',
    runtime: 'openclaw',
    sessionName: 'Session 01 · Operator',
    sessionId: 'ses-humano-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'humano-assistant',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'Agent Workbench',
      worktree: 'humano/worktree',
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
        senderName: 'Humano',
        content: 'OpenClaw Operator connected. Ready for terminal command execution, background tooling, and browser workflows.',
        tokens: 140,
        latencyMs: 190,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-uno',
    key: 'uno',
    name: 'Uno',
    runtime: 'hermes',
    sessionName: 'Session 01 · Strategist',
    sessionId: 'ses-uno-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'uno-production',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'Agent Workbench',
      worktree: 'uno/worktree',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'u-msg-1',
        sender: 'agent',
        senderName: 'Uno',
        content: 'Chief of Staff ready. Coordinating multi-agent directives, verification gates, and milestone reviews.',
        tokens: 165,
        latencyMs: 210,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'agent-omo',
    key: 'omo',
    name: 'Omo',
    runtime: 'opencode',
    sessionName: 'Session 01 · Architect',
    sessionId: 'ses-omo-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'omo-production',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'Agent Workbench',
      worktree: 'omo/worktree',
      branch: 'main',
      modified: 0,
      staged: 0,
      untracked: 0,
      divergence: 0,
    },
    messages: [
      {
        id: 'o-msg-1',
        sender: 'agent',
        senderName: 'Omo',
        content: 'OpenCode Sisyphus harness operational. AST-Grep, LSP servers, and deep codebase refactoring engine bound.',
        tokens: 190,
        latencyMs: 280,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
];

const INITIAL_STATE: WorkbenchState = {
  layoutMode: 'vertical',
  sessionMode: 'team',
  teamConfig: {
    leadId: 'agent-astro',
    agentIds: ['agent-astro', 'agent-humano', 'agent-uno', 'agent-omo'],
    projectFolder: 'Agent Workbench',
  },
  agents: DEFAULT_AGENTS,
  panelSlots: ['astro', 'humano', 'uno', 'omo'],
  panelSizes: [25, 25, 25, 25],
  focusedAgentId: 'agent-astro',
  activeDrawerAgentId: null,
  isOnboarded: false,
  remoteInfo: {
    port: 4545,
    shareCode: 'NAH777',
    currentSessionUrl: 'http://127.0.0.1:4545/?session=astro',
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
              // Check if replacing streaming placeholder
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
                attachedContext: [], // Clear attachments on reply
              };
            }),
          }));
          break;
        }

        case 'AGENT_STATUS_UPDATE':
          setState((prev) => ({
            ...prev,
            agents: prev.agents.map((a) => (a.id === msg.payload.agentId ? { ...a, status: msg.payload.status } : a)),
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

  const completeOnboarding = useCallback((teamMode: SessionMode, selectedAgentKeys: string[]) => {
    setState((prev) => ({
      ...prev,
      isOnboarded: true,
      sessionMode: teamMode,
      panelSlots: selectedAgentKeys,
    }));
    setShowOnboarding(false);
    vscode.postMessage({
      type: 'COMPLETE_ONBOARDING',
      payload: { teamMode, selectedAgents: selectedAgentKeys },
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
      textToCopy = info?.currentSessionUrl || `http://127.0.0.1:4545/?session=${agentId || 'astro'}`;
    } else if (target === 'workspace') {
      textToCopy = info?.workspaceUrl || 'http://127.0.0.1:4545/';
    } else {
      textToCopy = info?.shareCode || 'NAH777';
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
