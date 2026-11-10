import { useState, useEffect, useCallback } from 'react';
import {
  AgentConfig,
  LayoutMode,
  SessionMode,
  TeamConfig,
  WorkbenchState,
  HostToWebviewMessage,
  DiagnosticCheckResult,
  ProviderConfig,
  ProviderTestResult,
} from '../types/workbench';
import { AgentoSettings, DEFAULT_SETTINGS } from '../types/settings';
import { getVSCodeApi } from './useVSCodeApi';

export const CANONICAL_AGENTS: AgentConfig[] = [
  {
    id: 'agent-uno',
    key: 'uno',
    name: 'Uno',
    runtime: 'hermes',
    sessionName: 'uno/cos-briefing#101',
    sessionId: 'ses-uno-101',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'nah-general-combo',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'uno/cos-briefing',
      branch: 'main',
      modified: 2,
      staged: 6,
      untracked: 14,
      divergence: 0,
    },
    messages: [
      {
        id: 'u-msg-1',
        sender: 'agent',
        senderName: 'Uno',
        content: 'Good morning. Chief of Staff Uno online. Systems active on Hermes Gateway. Ready to coordinate organizational priorities, briefs, and CEO directives.',
        tokens: 142,
        latencyMs: 310,
        timestamp: '10:14 AM',
      },
    ],
    scheduledTasks: [
      { id: 'task-1', name: 'Morning Operations Brief', cron: '0 8 * * *', active: true },
      { id: 'task-2', name: 'Matrix Thread Sync', cron: '*/30 * * * *', active: true },
    ],
  },
  {
    id: 'agent-omo',
    key: 'omo',
    name: 'Omo',
    runtime: 'hermes',
    sessionName: 'omo/engine-dev#204',
    sessionId: 'ses-omo-204',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'nah-coding-combo',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'omo/engine-dev',
      branch: 'omo/workbench',
      modified: 14,
      staged: 28,
      untracked: 253,
      divergence: 3318,
    },
    messages: [
      {
        id: 'o-msg-1',
        sender: 'agent',
        senderName: 'Omo',
        content: 'Lead Developer Omo standing by in Hermes. Working tree inspected and active. Ready for feature engineering, refactors, and adversarial code review.',
        tokens: 168,
        latencyMs: 420,
        timestamp: '10:14 AM',
      },
    ],
    scheduledTasks: [
      { id: 'task-3', name: 'CI/CD Pipeline Validation', cron: '0 */4 * * *', active: true },
    ],
  },
  {
    id: 'agent-gravito',
    key: 'gravito',
    name: 'Gravito',
    runtime: 'antigravity',
    sessionName: 'gravito/systems-eng#401',
    sessionId: 'ses-gravito-401',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'nah-services-combo',
    permissionsMode: 'Autonomous',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'gravito/agento-build',
      branch: 'main',
      modified: 3,
      staged: 7,
      untracked: 12,
      divergence: 0,
    },
    messages: [
      {
        id: 'g-msg-1',
        sender: 'agent',
        senderName: 'Gravito',
        content: 'AI Systems Engineer Gravito online on Antigravity. Full tool surface, MCP ecosystem, and workbench architecture verified.',
        tokens: 184,
        latencyMs: 290,
        timestamp: '10:14 AM',
      },
    ],
    scheduledTasks: [
      { id: 'task-4', name: 'MCP Health & Garage Door Audit', cron: '0 */6 * * *', active: true },
    ],
  },
  {
    id: 'agent-humano',
    key: 'humano',
    name: 'Humano',
    runtime: 'hermes',
    sessionName: 'humano/design-tokens#302',
    sessionId: 'ses-humano-302',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'nah-reasoning-combo',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'humano/design-tokens',
      branch: 'humano/design',
      modified: 4,
      staged: 12,
      untracked: 35,
      divergence: 0,
    },
    messages: [
      {
        id: 'h-msg-1',
        sender: 'agent',
        senderName: 'Humano',
        content: 'Humano active in Hermes. Design tokens, brand guidelines, and community operations aligned with the latest Figma design system.',
        tokens: 156,
        latencyMs: 380,
        timestamp: '10:14 AM',
      },
    ],
  },
  {
    id: 'agent-curso',
    key: 'curso',
    name: 'Curso',
    runtime: 'cursor-agent',
    sessionName: 'curso/ide-patch#088',
    sessionId: 'ses-curso-088',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'curso-operations',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'curso/ide-patch',
      branch: 'curso/editor',
      modified: 1,
      staged: 4,
      untracked: 8,
      divergence: 0,
    },
    messages: [
      {
        id: 'c-msg-1',
        sender: 'agent',
        senderName: 'Curso',
        content: 'Curso connected via Cursor IDE. Ready for editor tasks, quick inline repairs, and workspace diagnostics.',
        tokens: 132,
        latencyMs: 250,
        timestamp: '10:14 AM',
      },
    ],
  },
  {
    id: 'agent-astro',
    key: 'astro',
    name: 'Astro',
    runtime: 'hermes',
    sessionName: 'astro/arch-ideation#501',
    sessionId: 'ses-astro-501',
    status: 'online',
    viewMode: 'chat',
    selectedModel: 'astro-primary',
    permissionsMode: 'Supervised',
    gitStatus: {
      workspace: 'notahuman',
      worktree: 'astro/arch-ideation',
      branch: 'astro/ideation',
      modified: 1,
      staged: 2,
      untracked: 6,
      divergence: 0,
    },
    messages: [
      {
        id: 'a-msg-1',
        sender: 'agent',
        senderName: 'Astro',
        content: 'AI Systems Architect Astro online on Hermes Gateway. Ready for architecture planning, roadmap design, and creative ideation.',
        tokens: 160,
        latencyMs: 340,
        timestamp: '10:14 AM',
      },
    ],
  },
];

const INITIAL_STATE: WorkbenchState = {
  layoutMode: 'grid',
  sessionMode: 'independent',
  agents: CANONICAL_AGENTS,
  panelSlots: ['uno', 'omo', 'gravito', 'humano'],
  panelSizes: [50, 50],
  focusedAgentId: 'agent-uno',
  activeDrawerAgentId: null,
  isOnboarded: true,
  settings: DEFAULT_SETTINGS,
  remoteInfo: {
    port: 4545,
    shareCode: 'NAH777',
    currentSessionUrl: 'http://127.0.0.1:4545/?session=uno',
    workspaceUrl: 'http://127.0.0.1:4545/',
  },
};

export function useWorkbenchState() {
  const vscode = getVSCodeApi();
  const [state, setState] = useState<WorkbenchState>(INITIAL_STATE);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticCheckResult | undefined>(undefined);
  const [availableModels, setAvailableModels] = useState<string[]>([
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
    'nvidia/nvidia/nemotron-3.5-super-vl-120b-a12b',
    'cloudflare-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  ]);
  const [discoveredAgents, setDiscoveredAgents] = useState<{ key: string; name: string; runtime: string; role: string; detected: boolean }[]>([]);
  const [providerConfig, setProviderConfig] = useState<ProviderConfig>({
    type: 'omniroute',
    baseUrl: 'http://localhost:20128',
  });
  const [providerTestResult, setProviderTestResult] = useState<ProviderTestResult | null>(null);
  const [isTestingProvider, setIsTestingProvider] = useState<boolean>(false);

  const testProviderConnection = useCallback((config: ProviderConfig) => {
    setIsTestingProvider(true);
    setProviderTestResult(null);
    vscode.postMessage({
      type: 'TEST_PROVIDER_CONNECTION',
      payload: config,
    });
  }, [vscode]);

  const saveProviderConfig = useCallback((config: ProviderConfig) => {
    setProviderConfig(config);
    vscode.postMessage({
      type: 'SAVE_PROVIDER_CONFIG',
      payload: config,
    });
  }, [vscode]);

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
            const restoredOnboarded = msg.payload.isOnboarded === true;
            setShowOnboarding(!restoredOnboarded);
            const payload = msg.payload;

            // Detect stale legacy state (placeholder names or missing Gravito)
            const isStale =
              !payload.agents ||
              payload.agents.some(
                (a) => a.name === 'Agent Name' || (a.sessionName && a.sessionName.includes('Extra Long Name'))
              ) ||
              !payload.agents.some((a) => a.key === 'gravito');

            if (isStale) {
              console.log('[Agento] Detected legacy/stale state; migrating to canonical ecosystem agents.');
              const freshState: WorkbenchState = {
                ...INITIAL_STATE,
                settings: payload.settings ? { ...DEFAULT_SETTINGS, ...payload.settings } : DEFAULT_SETTINGS,
                isOnboarded: restoredOnboarded,
              };
              setState(freshState);
              vscode.postMessage({
                type: 'SAVE_STATE',
                payload: freshState,
              });
            } else {
              const sanitizedAgents = (payload.agents && payload.agents.length > 0 ? payload.agents : INITIAL_STATE.agents).map((a: any) => {
                let updated = { ...a };
                if (a.key === 'omo' || a.key === 'humano' || a.key === 'astro' || a.key === 'uno') {
                  updated.runtime = 'hermes';
                } else if (a.key === 'gravito') {
                  updated.runtime = 'antigravity';
                } else if (a.key === 'curso') {
                  updated.runtime = 'cursor-agent';
                }
                const isLegacyModel = !a.selectedModel ||
                  a.selectedModel.startsWith('OmniRoute -') ||
                  a.selectedModel.includes('Claude 3.7') ||
                  a.selectedModel.includes('Assistant') ||
                  a.selectedModel === 'undefined';
                if (isLegacyModel) {
                  let defaultM = 'nah-general-combo';
                  if (a.key === 'omo') defaultM = 'nah-coding-combo';
                  else if (a.key === 'gravito') defaultM = 'nah-services-combo';
                  else if (a.key === 'humano') defaultM = 'nah-reasoning-combo';
                  else if (a.key === 'astro') defaultM = 'astro-primary';
                  else if (a.key === 'curso') defaultM = 'curso-operations';
                  updated.selectedModel = defaultM;
                }
                if (!updated.permissionsMode || updated.permissionsMode === 'Selector Label') {
                  updated.permissionsMode = 'Autonomous';
                }
                return updated;
              });

              setState((prev) => ({
                ...prev,
                ...payload,
                isOnboarded: restoredOnboarded,
                settings: payload.settings ? { ...DEFAULT_SETTINGS, ...payload.settings } : prev.settings,
                agents: sanitizedAgents,
                panelSlots: payload.panelSlots && payload.panelSlots.length > 0 ? payload.panelSlots : prev.panelSlots,
              }));
            }
          }
          break;
        case 'AVAILABLE_MODELS_UPDATE':
          if (msg.payload) {
            const combos = msg.payload.combos || [];
            const frontier = msg.payload.models || [];
            const merged = Array.from(new Set([...combos, ...frontier]));
            setAvailableModels(merged);
          }
          break;
        case 'AVAILABLE_AGENTS_UPDATE':
          if (msg.payload?.agents) {
            setDiscoveredAgents(msg.payload.agents);
            setState((prev) => ({
              ...prev,
              agents: prev.agents.map((a) => {
                const found = msg.payload.agents.find((d) => d.key === a.key);
                return found ? { ...a, runtime: found.runtime } : a;
              }),
            }));
          }
          break;
        case 'AGENT_MESSAGE_RECEIVED':
          if (msg.payload) {
            const { agentId, message } = msg.payload;
            setState((prev) => ({
              ...prev,
              agents: prev.agents.map((a) => {
                if (a.id !== agentId && a.key !== agentId) return a;
                return {
                  ...a,
                  status: 'online',
                  messages: [...a.messages, message],
                };
              }),
            }));
          }
          break;
        case 'SETTINGS_UPDATED':
          if (msg.payload) {
            setState((prev) => ({
              ...prev,
              settings: msg.payload,
            }));
          }
          break;
        case 'DIAGNOSTICS_RESULT':
          setDiagnosticResults(msg.payload);
          break;
        case 'OPEN_SETTINGS':
          setShowSettings(true);
          break;
        case 'OPEN_WALKTHROUGH':
          setShowOnboarding(true);
          break;
        case 'REMOTE_INFO_UPDATE':
          setState((prev) => ({
            ...prev,
            remoteInfo: msg.payload,
          }));
          break;
        case 'PROVIDER_TEST_RESULT':
          setIsTestingProvider(false);
          setProviderTestResult(msg.payload);
          break;
        case 'PROVIDER_CONFIG_UPDATE':
          if (msg.payload) {
            setProviderConfig((prev) => ({ ...prev, ...msg.payload }));
          }
          break;
        case 'RESET_LAYOUT':
          resetLayout();
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [vscode]);

  const updateSettings = useCallback((newSettings: AgentoSettings) => {
    setState((prev) => ({
      ...prev,
      settings: newSettings,
    }));
    vscode.postMessage({
      type: 'SAVE_SETTINGS',
      payload: newSettings,
    });
  }, [vscode]);

  const resetSettings = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: DEFAULT_SETTINGS,
    }));
    vscode.postMessage({
      type: 'RESET_SETTINGS',
    });
  }, [vscode]);

  const runDiagnostics = useCallback(() => {
    vscode.postMessage({
      type: 'CHECK_DIAGNOSTICS',
    });
  }, [vscode]);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setState((prev) => ({ ...prev, layoutMode: mode }));
  }, []);

  const setSessionMode = useCallback((mode: SessionMode, teamConfig?: TeamConfig, slots?: string[]) => {
    setState((prev) => {
      const nextSlots = slots && slots.length > 0
        ? slots
        : mode === 'team' && teamConfig?.agentIds
        ? teamConfig.agentIds.map((id) => prev.agents.find((a) => a.id === id)?.key || id)
        : prev.panelSlots;
      const newState: WorkbenchState = {
        ...prev,
        sessionMode: mode,
        teamConfig,
        panelSlots: nextSlots,
      };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
    vscode.postMessage({
      type: 'SET_SESSION_MODE',
      payload: { mode, teamConfig },
    });
  }, [vscode]);

  const switchAgentSlot = useCallback((slotIndex: number, newAgentKey: string) => {
    setState((prev) => {
      const newSlots = [...prev.panelSlots];
      newSlots[slotIndex] = newAgentKey;
      const newState = { ...prev, panelSlots: newSlots };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
  }, [vscode]);

  const addAgentSlot = useCallback((agentKey: string) => {
    setState((prev) => {
      if (prev.panelSlots.includes(agentKey)) {
        return prev;
      }
      const newState = {
        ...prev,
        panelSlots: [...prev.panelSlots, agentKey],
      };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
  }, [vscode]);

  const closeSlotIndex = useCallback((slotIndex: number) => {
    setState((prev) => {
      const newSlots = [...prev.panelSlots];
      newSlots.splice(slotIndex, 1);
      const newState = {
        ...prev,
        panelSlots: newSlots,
      };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
  }, [vscode]);

  const closeAgentPanel = useCallback((agentIdOrKey: string) => {
    setState((prev) => {
      const target = agentIdOrKey.replace('agent-', '');
      const newSlots = prev.panelSlots.filter((s) => s !== target && s !== agentIdOrKey);
      const newState = {
        ...prev,
        panelSlots: newSlots,
      };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
    vscode.postMessage({ type: 'CLOSE_AGENT_PANEL', payload: { agentId: agentIdOrKey } });
  }, [vscode]);

  const reorderSlots = useCallback((sourceIndex: number, targetIndex: number) => {
    setState((prev) => {
      if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) return prev;
      if (sourceIndex >= prev.panelSlots.length || targetIndex >= prev.panelSlots.length) return prev;
      const newSlots = [...prev.panelSlots];
      const [moved] = newSlots.splice(sourceIndex, 1);
      newSlots.splice(targetIndex, 0, moved);
      const newState = {
        ...prev,
        panelSlots: newSlots,
      };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
    vscode.postMessage({ type: 'REORDER_SLOTS', payload: { sourceIndex, targetIndex } });
  }, [vscode]);

  const setPanelSizes = useCallback((sizes: number[]) => {
    setState((prev) => ({
      ...prev,
      panelSizes: sizes,
    }));
  }, []);

  const setAgentModel = useCallback((agentId: string, model: string) => {
    setState((prev) => {
      const newState = {
        ...prev,
        agents: prev.agents.map((a) => (a.id === agentId ? { ...a, selectedModel: model } : a)),
      };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
  }, [vscode]);

  const setAgentPermissions = useCallback((agentId: string, mode: string) => {
    setState((prev) => {
      const sanitizedMode = mode === 'Selector Label' ? 'Autonomous' : mode;
      const newState = {
        ...prev,
        agents: prev.agents.map((a) => (a.id === agentId ? { ...a, permissionsMode: sanitizedMode } : a)),
      };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
  }, [vscode]);

  const sendMessageToAgent = useCallback((agentId: string, text: string, attachments?: any[]) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let selectedModel: string | undefined;

    setState((prev) => {
      const targetAgent = prev.agents.find((a) => a.id === agentId || a.key === agentId);
      selectedModel = targetAgent?.selectedModel;
      return {
        ...prev,
        agents: prev.agents.map((a) => {
          if (a.id !== agentId && a.key !== agentId) return a;
          return {
            ...a,
            status: 'thinking',
            messages: [...a.messages, userMsg],
          };
        }),
      };
    });

    vscode.postMessage({
      type: 'SEND_AGENT_MESSAGE',
      payload: { agentId, text, model: selectedModel, attachments },
    });
  }, [vscode]);

  const forkSession = useCallback((agentId: string) => {
    vscode.postMessage({ type: 'FORK_SESSION', payload: { agentId } });
  }, [vscode]);

  const newSession = useCallback((agentIdOrKey: string) => {
    setState((prev) => {
      const target = agentIdOrKey.replace('agent-', '');
      const updatedAgents = prev.agents.map((a) => {
        if (a.id !== agentIdOrKey && a.key !== target && a.key !== agentIdOrKey) return a;
        const sessionNum = Math.floor(100 + Math.random() * 900);
        const newSessionId = `ses-${a.key}-${Date.now().toString(36)}`;
        return {
          ...a,
          sessionId: newSessionId,
          sessionName: `${a.key}/session#${sessionNum}`,
          status: 'online' as const,
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: 'agent' as const,
              senderName: a.name,
              content: `Fresh session initialized for ${a.name} (${a.runtime}). Ready for instructions.`,
              tokens: 95,
              latencyMs: 210,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        };
      });
      const newState = { ...prev, agents: updatedAgents };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
    vscode.postMessage({ type: 'NEW_SESSION', payload: { agentId: agentIdOrKey } });
  }, [vscode]);

  const duplicateSession = useCallback((agentIdOrKey?: string) => {
    if (!agentIdOrKey) return;
    setState((prev) => {
      const target = agentIdOrKey.replace('agent-', '');
      const agent = prev.agents.find((a) => a.id === agentIdOrKey || a.key === target || a.key === agentIdOrKey);
      if (!agent) return prev;
      const copyNum = Math.floor(100 + Math.random() * 900);
      const cloned = {
        ...agent,
        sessionName: `${agent.sessionName}-copy#${copyNum}`,
        sessionId: `ses-${agent.key}-${Date.now().toString(36)}`,
      };
      const updated = prev.agents.map((a) => (a.id === agent.id ? cloned : a));
      const newState = { ...prev, agents: updated };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
    vscode.postMessage({ type: 'DUPLICATE_SESSION', payload: { agentId: agentIdOrKey } });
  }, [vscode]);

  const resetToFreshSessions = useCallback(() => {
    setState((prev) => {
      const newState: WorkbenchState = {
        ...prev,
        agents: CANONICAL_AGENTS,
        panelSlots: ['uno', 'omo', 'gravito', 'humano'],
      };
      vscode.postMessage({ type: 'SAVE_STATE', payload: newState });
      return newState;
    });
  }, [vscode]);

  const exportSession = useCallback((agentId?: string) => {
    vscode.postMessage({ type: 'EXPORT_SESSION', payload: { agentId } });
  }, [vscode]);

  const findInSession = useCallback((agentId?: string) => {
    vscode.postMessage({ type: 'FIND_IN_SESSION', payload: { agentId } });
  }, [vscode]);

  const copyRemoteUrl = useCallback((target: 'session' | 'workspace' | 'shareCode', agentId?: string) => {
    const info = state.remoteInfo;
    let textToCopy = '';
    if (target === 'session') {
      textToCopy = info?.currentSessionUrl || `http://127.0.0.1:4545/?session=${agentId || 'uno'}`;
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

  const completeOnboarding = useCallback((mode: SessionMode, selectedSlots: string[]) => {
    setState((prev) => {
      const newState: WorkbenchState = {
        ...prev,
        isOnboarded: true,
        sessionMode: mode,
        panelSlots: selectedSlots.length > 0 ? selectedSlots : prev.panelSlots,
      };
      vscode.postMessage({
        type: 'SAVE_STATE',
        payload: newState,
      });
      return newState;
    });
    setShowOnboarding(false);
  }, [vscode]);

  const reloadWorkbench = useCallback(() => {
    vscode.postMessage({ type: 'RELOAD_WORKBENCH' });
  }, [vscode]);

  const resetLayout = useCallback(() => {
    setState(INITIAL_STATE);
    setShowOnboarding(false);
  }, []);

  return {
    state,
    showOnboarding,
    setShowOnboarding,
    showSettings,
    setShowSettings,
    settings: state.settings || DEFAULT_SETTINGS,
    updateSettings,
    resetSettings,
    diagnosticResults,
    runDiagnostics,
    completeOnboarding,
    setLayoutMode,
    setSessionMode,
    switchAgentSlot,
    addAgentSlot,
    closeSlotIndex,
    closeAgentPanel,
    reorderSlots,
    setPanelSizes,
    setAgentModel,
    setAgentPermissions,
    sendMessageToAgent,
    forkSession,
    newSession,
    exportSession,
    duplicateSession,
    findInSession,
    copyRemoteUrl,
    reloadWorkbench,
    resetLayout,
    resetToFreshSessions,
    availableModels,
    discoveredAgents,
    providerConfig,
    providerTestResult,
    isTestingProvider,
    testProviderConnection,
    saveProviderConfig,
  };
}
