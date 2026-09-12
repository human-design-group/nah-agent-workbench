import { useState, useEffect, useCallback } from 'react';
import { AgentConfig, LayoutMode, WorkbenchState, HostToWebviewMessage } from '../types/workbench.js';
import { getVSCodeApi } from './useVSCodeApi.js';

const INITIAL_AGENT_MESSAGE = `Hi! Welcome to justbeahuman. The portfolio for Derek Arrington. I’m nah, Derek’s assistant and I’ll be your guide.

You can ask me anything about Derek’s work. If you give me some details about what you’re interested in specifically, I’ll put together a little mini-presentation for you.`;

const INITIAL_USER_MESSAGE = `Hey nah! Show me Derek’s design system work and describe his process.`;

const DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: 'agent-humano',
    key: 'humano',
    name: 'humano',
    runtime: 'openclaw',
    sessionName: 'Session 01 · Principal',
    sessionId: 'ses-humano-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'OmniRoute - Uno Orchestrate',
    permissionsMode: 'Permissions Select',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'humano/worktree-name/branch-name',
      branch: 'main',
      modified: 14,
      staged: 28,
      untracked: 253,
      divergence: 73318,
    },
    messages: [
      {
        id: 'h-msg-1',
        sender: 'agent',
        senderName: 'humano',
        content: INITIAL_AGENT_MESSAGE,
        thinking: 'Assessing principal instructions. Initialized OpenClaw creative canvas. Verified Figma connection on port 7771.',
        toolCalls: [{ name: 'nah-figma:get_node', status: 'done', summary: 'Fetched frame 2001:213' }],
        tokens: 384,
        latencyMs: 820,
        timestamp: '10:14 AM',
      },
      {
        id: 'h-msg-2',
        sender: 'user',
        content: INITIAL_USER_MESSAGE,
        timestamp: '10:15 AM',
      }
    ]
  },
  {
    id: 'agent-uno',
    key: 'uno',
    name: 'uno',
    runtime: 'hermes',
    sessionName: 'Session 01 · CoS Coordinator',
    sessionId: 'ses-uno-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'OmniRoute - Uno Orchestrate',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'uno/worktree-name/branch-name',
      branch: 'main',
      modified: 14,
      staged: 28,
      untracked: 253,
      divergence: 73318,
    },
    messages: [
      {
        id: 'u-msg-1',
        sender: 'agent',
        senderName: 'uno',
        content: 'Chief of Staff ready. Coordinating multi-agent directives across Astro, Omo, and Curso.',
        thinking: 'Checked inbox at ~/.hermes/inbox. Delegating tasks via GSD milestones.',
        toolCalls: [{ name: 'nah-bridge:bridge_status', status: 'done', summary: '1,036 skills active' }],
        tokens: 210,
        latencyMs: 450,
        timestamp: '10:14 AM',
      }
    ]
  },
  {
    id: 'agent-omo',
    key: 'omo',
    name: 'omo',
    runtime: 'opencode',
    sessionName: 'Session 01 · CTO Engine',
    sessionId: 'ses-omo-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'OmniRoute - Omo Production',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'omo/worktree-name/branch-name',
      branch: 'main',
      modified: 14,
      staged: 28,
      untracked: 253,
      divergence: 73318,
    },
    messages: [
      {
        id: 'o-msg-1',
        sender: 'agent',
        senderName: 'omo',
        content: 'OpenCode Sisyphus harness operational. AST-Grep and LSP servers bound.',
        tokens: 156,
        latencyMs: 310,
        timestamp: '10:14 AM',
      }
    ]
  },
  {
    id: 'agent-astro',
    key: 'astro',
    name: 'astro',
    runtime: 'antigravity',
    sessionName: 'Session 01 · Supervisor',
    sessionId: 'ses-astro-01',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'Gemini 2.5 Flash',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'astro/worktree-name/branch-name',
      branch: 'main',
      modified: 14,
      staged: 28,
      untracked: 253,
      divergence: 73318,
    },
    messages: [
      {
        id: 'a-msg-1',
        sender: 'agent',
        senderName: 'astro',
        content: 'AntiGravity Supervisor online. Managing Agent Workbench lifecycle, live preview, and ACP relays.',
        tokens: 289,
        latencyMs: 510,
        timestamp: '10:14 AM',
      }
    ]
  },
  {
    id: 'agent-curso',
    key: 'curso',
    name: 'curso',
    runtime: 'cursor-agent',
    sessionName: 'Session 01 · IDE Subagent',
    sessionId: 'ses-curso-01',
    status: 'idle',
    viewMode: 'chat',
    selectedModel: 'Claude 3.7 Sonnet',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'curso/worktree-name/branch-name',
      branch: 'main',
      modified: 14,
      staged: 28,
      untracked: 253,
      divergence: 73318,
    },
    messages: [
      {
        id: 'c-msg-1',
        sender: 'agent',
        senderName: 'curso',
        content: 'Cursor IDE worker waiting for instruction triage from Astro / Uno.',
        timestamp: '10:14 AM',
      }
    ]
  }
];

const INITIAL_STATE: WorkbenchState = {
  layoutMode: 'grid',
  agents: DEFAULT_AGENTS,
  panelSlots: ['humano', 'uno', 'omo', 'astro'],
  panelSizes: [50, 50, 50, 50],
  focusedAgentId: 'agent-humano',
  voiceActive: false,
};

export function useWorkbenchState() {
  const vscode = getVSCodeApi();
  const [state, setState] = useState<WorkbenchState>(INITIAL_STATE);

  useEffect(() => {
    vscode.postMessage({
      type: 'SAVE_STATE',
      payload: state,
    });
  }, [state, vscode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<HostToWebviewMessage>) => {
      const msg = event.data;
      if (!msg) return;

      switch (msg.type) {
        case 'RESTORE_STATE':
          if (msg.payload) {
            setState((prev) => ({
              ...prev,
              ...msg.payload,
              agents: msg.payload.agents && msg.payload.agents.length > 0 ? msg.payload.agents : prev.agents,
              panelSlots: msg.payload.panelSlots && msg.payload.panelSlots.length > 0 ? msg.payload.panelSlots : prev.panelSlots,
            }));
          }
          break;
        case 'RESET_LAYOUT':
          setState(INITIAL_STATE);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setState((prev) => ({
      ...prev,
      layoutMode: mode,
    }));
  }, []);

  const switchAgentSlot = useCallback((slotIndex: number, newAgentKey: string) => {
    setState((prev) => {
      const newSlots = [...prev.panelSlots];
      newSlots[slotIndex] = newAgentKey;
      return { ...prev, panelSlots: newSlots };
    });
  }, []);

  const setPanelSizes = useCallback((sizes: number[]) => {
    setState((prev) => ({
      ...prev,
      panelSizes: sizes,
    }));
  }, []);

  const setAgentModel = useCallback((agentId: string, model: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => (a.id === agentId ? { ...a, selectedModel: model } : a)),
    }));
  }, []);

  const setAgentPermissions = useCallback((agentId: string, mode: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => (a.id === agentId ? { ...a, permissionsMode: mode } : a)),
    }));
  }, []);

  const sendMessageToAgent = useCallback((agentId: string, text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => {
        if (a.id !== agentId) return a;
        return {
          ...a,
          status: 'thinking',
          messages: [...a.messages, userMsg],
        };
      }),
    }));

    vscode.postMessage({
      type: 'SEND_AGENT_MESSAGE',
      payload: { agentId, text },
    });

    // Simulate reactive ACP response
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        agents: prev.agents.map((a) => {
          if (a.id !== agentId) return a;
          return {
            ...a,
            status: 'online',
            messages: [
              ...a.messages,
              {
                id: `resp-${Date.now()}`,
                sender: 'agent' as const,
                senderName: a.name,
                content: `Response from ${a.name} (${a.runtime}): Processing query against ${a.gitStatus.workspace}...`,
                thinking: `Executed reasoning chain for agent ${a.key}. Workspace clean.`,
                toolCalls: [{ name: 'git status', status: 'done', summary: 'Checked working tree' }],
                tokens: Math.floor(Math.random() * 200) + 100,
                latencyMs: Math.floor(Math.random() * 500) + 400,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ],
          };
        }),
      }));
    }, 1200);
  }, [vscode]);

  const forkSession = useCallback((agentId: string) => {
    vscode.postMessage({ type: 'FORK_SESSION', payload: { agentId } });
  }, [vscode]);

  const newSession = useCallback((agentId: string) => {
    vscode.postMessage({ type: 'NEW_SESSION', payload: { agentId } });
  }, [vscode]);

  const resetLayout = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    setLayoutMode,
    switchAgentSlot,
    setPanelSizes,
    setAgentModel,
    setAgentPermissions,
    sendMessageToAgent,
    forkSession,
    newSession,
    resetLayout,
  };
}
