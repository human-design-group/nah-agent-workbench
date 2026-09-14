import React, { useState, useMemo } from 'react';
import {
  Settings,
  Sliders,
  Bot,
  Users,
  Radio,
  GitBranch,
  Shield,
  Activity,
  Check,
  X,
  RefreshCw,
  Download,
  Upload,
  RotateCcw,
  Search,
  ExternalLink,
  Cpu,
  Terminal,
  Server,
  Zap,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { AgentoSettings, DEFAULT_SETTINGS } from '../types/settings';
import { AgentConfig, DiagnosticCheckResult, LayoutMode, SessionMode } from '../types/workbench';
import { AgentoLogo } from './AgentoLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AgentoSettings;
  onSaveSettings: (newSettings: AgentoSettings) => void;
  onResetSettings: () => void;
  availableAgents: AgentConfig[];
  diagnosticResults?: DiagnosticCheckResult;
  onRunDiagnostics?: () => void;
}

type SettingsTab = 'general' | 'agents' | 'team' | 'gateway' | 'git' | 'security' | 'diagnostics';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSaveSettings,
  onResetSettings,
  availableAgents,
  diagnosticResults,
  onRunDiagnostics,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<AgentoSettings>(JSON.parse(JSON.stringify(currentSettings || DEFAULT_SETTINGS)));
  const [showSecretToken, setShowSecretToken] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Tab definitions
  const tabs = [
    { id: 'general', label: 'General & Interface', icon: Sliders, badge: undefined },
    { id: 'agents', label: 'Agents & Runtimes', icon: Bot, badge: undefined },
    { id: 'team', label: 'Team & Mission Control', icon: Users, badge: undefined },
    { id: 'gateway', label: 'Gateways & Bridges', icon: Radio, badge: undefined },
    { id: 'git', label: 'Git & Worktrees', icon: GitBranch, badge: undefined },
    { id: 'security', label: 'Security & Telemetry', icon: Shield, badge: undefined },
    { id: 'diagnostics', label: 'Diagnostics & Backup', icon: Activity, badge: undefined },
  ];

  const handleSave = () => {
    onSaveSettings(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all Agento settings to defaults?')) {
      setFormData(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
      onResetSettings();
    }
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agento-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          setFormData({ ...DEFAULT_SETTINGS, ...parsed });
          alert('Settings successfully loaded from JSON file.');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const allAgentKeys = [
    { key: 'antigravity', name: 'AntiGravity', runtime: 'Google Antigravity' },
    { key: 'claude', name: 'Claude Code', runtime: 'Anthropic Claude' },
    { key: 'codex', name: 'Codex CLI', runtime: 'OpenAI Codex' },
    { key: 'cline', name: 'Cline', runtime: 'Autonomous CLI' },
    { key: 'cursor', name: 'Cursor Agent', runtime: 'Cursor IDE' },
    { key: 'gemini', name: 'Gemini CLI', runtime: 'Google Gemini' },
    { key: 'hermes', name: 'Hermes Agent', runtime: 'Hermes Bifrost' },
    { key: 'kilo', name: 'Kilo Code', runtime: 'Kilo Dev' },
    { key: 'openclaw', name: 'OpenClaw', runtime: 'OpenClaw ACP' },
    { key: 'opencode', name: 'OpenCode', runtime: 'SST OpenCode' },
    { key: 'ollama', name: 'Ollama Local', runtime: 'Local Ollama' },
  ];

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-header">
          <div className="settings-brand">
            <AgentoLogo size={28} className="settings-logo-icon" />
            <div className="settings-title-wrap">
              <h2 className="settings-title">Agento Settings</h2>
              <span className="settings-subtitle">Mission Control Configuration & Runtimes</span>
            </div>
          </div>

          <div className="settings-header-right">
            {/* Search Input */}
            <div className="settings-search-box">
              <Search size={14} className="settings-search-icon" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="settings-search-input"
              />
              {searchQuery && (
                <button className="settings-search-clear" onClick={() => setSearchQuery('')}>
                  <X size={12} />
                </button>
              )}
            </div>

            <button className="settings-close-btn" onClick={onClose} title="Close Settings">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body (Sidebar + Content) */}
        <div className="settings-body">
          {/* Sidebar */}
          <nav className="settings-sidebar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`settings-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                >
                  <Icon size={16} className="tab-icon" />
                  <span className="tab-label">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Content Pane */}
          <div className="settings-content">
            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
              <div className="settings-section">
                <h3 className="section-title">General & Interface</h3>
                <p className="section-desc">Configure workbench appearance, default layouts, and responsiveness.</p>

                <div className="setting-group">
                  <label className="setting-label">Default Layout Arrangement</label>
                  <span className="setting-help">Arrangement mode applied on fresh workbench launch.</span>
                  <div className="setting-pill-select">
                    {(['grid', 'vertical', 'horizontal', 'split-3', 'focus'] as LayoutMode[]).map((mode) => (
                      <button
                        key={mode}
                        className={`pill-option ${formData.general.defaultLayout === mode ? 'active' : ''}`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, defaultLayout: mode },
                          })
                        }
                      >
                        {mode.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">UI Density</label>
                  <span className="setting-help">Padding and compactness for agent cards and grid viewports.</span>
                  <div className="setting-pill-select">
                    {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
                      <button
                        key={density}
                        className={`pill-option ${formData.general.uiDensity === density ? 'active' : ''}`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, uiDensity: density },
                          })
                        }
                      >
                        {density.charAt(0).toUpperCase() + density.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Auto-Focus Active Agent</div>
                    <div className="setting-help">Elevate agent card when it outputs new messages or performs tool actions.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.general.autoFocusActiveAgent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, autoFocusActiveAgent: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Audio & Haptic Cues</div>
                    <div className="setting-help">Play subtle audio notification upon task completion or error.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.general.enableSounds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, enableSounds: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-group">
                  <label className="setting-label">Stream Rendering Speed</label>
                  <div className="setting-pill-select">
                    {(['smooth', 'instant'] as const).map((speed) => (
                      <button
                        key={speed}
                        className={`pill-option ${formData.general.streamAnimationSpeed === speed ? 'active' : ''}`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, streamAnimationSpeed: speed },
                          })
                        }
                      >
                        {speed === 'smooth' ? 'Smooth Stream (Typing)' : 'Instant Tokens'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AGENTS & RUNTIMES */}
            {activeTab === 'agents' && (
              <div className="settings-section">
                <h3 className="section-title">Agents & Runtimes</h3>
                <p className="section-desc">Manage CLI binary paths, model defaults, and runtime execution limits.</p>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">CLI Direct Fallback</div>
                    <div className="setting-help">Directly invoke local CLI binaries when ACP gateway is offline.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.agents.enableCliFallback}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agents: { ...formData.agents, enableCliFallback: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-group">
                  <label className="setting-label">Agent Step Timeout (Seconds)</label>
                  <input
                    type="number"
                    min="10"
                    max="3600"
                    value={formData.agents.stepTimeoutSeconds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agents: { ...formData.agents, stepTimeoutSeconds: Number(e.target.value) },
                      })
                    }
                    className="settings-input"
                  />
                </div>

                <div className="setting-group">
                  <label className="setting-label">CLI Binary Executable Paths</label>
                  <span className="setting-help">Specify custom paths or global commands for agent runtimes.</span>

                  <div className="cli-paths-table">
                    {allAgentKeys.map((agent) => {
                      const currentPath = formData.agents.cliPaths[agent.key] || agent.key;
                      const currentModel = formData.agents.defaultModels[agent.key] || '';
                      return (
                        <div key={agent.key} className="cli-path-row">
                          <div className="agent-meta">
                            <span className="agent-name-cell">{agent.name}</span>
                            <span className="agent-runtime-cell">({agent.runtime})</span>
                          </div>
                          <div className="agent-inputs">
                            <input
                              type="text"
                              placeholder={`Binary (e.g. ${agent.key})`}
                              value={currentPath}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  agents: {
                                    ...formData.agents,
                                    cliPaths: {
                                      ...formData.agents.cliPaths,
                                      [agent.key]: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="settings-input small"
                            />
                            <input
                              type="text"
                              placeholder="Default Model (e.g. claude-3-7-sonnet)"
                              value={currentModel}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  agents: {
                                    ...formData.agents,
                                    defaultModels: {
                                      ...formData.agents.defaultModels,
                                      [agent.key]: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="settings-input small"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TEAM & MISSION CONTROL */}
            {activeTab === 'team' && (
              <div className="settings-section">
                <h3 className="section-title">Team & Mission Control</h3>
                <p className="section-desc">Orchestration rules for Autonomous Team vs Independent Specialist workflows.</p>

                <div className="setting-group">
                  <label className="setting-label">Default Session Mode</label>
                  <div className="setting-pill-select">
                    {(['independent', 'team'] as SessionMode[]).map((mode) => (
                      <button
                        key={mode}
                        className={`pill-option ${formData.team.defaultSessionMode === mode ? 'active' : ''}`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            team: { ...formData.team, defaultSessionMode: mode },
                          })
                        }
                      >
                        {mode === 'team' ? 'Autonomous Team Mode' : 'Independent Specialist Mode'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Default Team Lead Agent</label>
                  <span className="setting-help">Agent responsible for task breakdown and subagent delegation.</span>
                  <select
                    value={formData.team.defaultTeamLead}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        team: { ...formData.team, defaultTeamLead: e.target.value },
                      })
                    }
                    className="settings-select"
                  >
                    {allAgentKeys.map((agent) => (
                      <option key={agent.key} value={agent.key}>
                        {agent.name} ({agent.runtime})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Cross-Agent Shared Context Bus</div>
                    <div className="setting-help">Automatically publish completed subtask summaries to other team members.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.team.enableSharedContextBus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        team: { ...formData.team, enableSharedContextBus: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Worktree Auto-Sync</div>
                    <div className="setting-help">Trigger automatic file-tree refreshes when an agent writes files.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.team.autoSyncWorktrees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        team: { ...formData.team, autoSyncWorktrees: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Require Lead Approval For Git Merge</div>
                    <div className="setting-help">Prevent subagent PR merges without lead agent review verification.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.team.requireLeadApprovalForMerge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        team: { ...formData.team, requireLeadApprovalForMerge: e.target.checked },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* TAB: GATEWAYS & BRIDGES */}
            {activeTab === 'gateway' && (
              <div className="settings-section">
                <h3 className="section-title">Gateways & Bridges</h3>
                <p className="section-desc">Manage connections to OmniRoute, Remote Companion Bridge, and nah-bridge.</p>

                <div className="setting-group">
                  <label className="setting-label">OmniRoute Model Gateway Endpoint</label>
                  <span className="setting-help">Local or remote gateway URL for live LLM routing.</span>
                  <input
                    type="text"
                    value={formData.gateway.omniRouteUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gateway: { ...formData.gateway, omniRouteUrl: e.target.value },
                      })
                    }
                    className="settings-input"
                  />
                </div>

                <div className="setting-group">
                  <label className="setting-label">Remote Companion Bridge Port</label>
                  <span className="setting-help">Port used by the internal HTTP/WebSocket server for companion apps.</span>
                  <input
                    type="number"
                    value={formData.gateway.companionPort}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gateway: { ...formData.gateway, companionPort: Number(e.target.value) },
                      })
                    }
                    className="settings-input"
                  />
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Auto-Start Remote Companion Server</div>
                    <div className="setting-help">Launch background server on extension activation.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.gateway.autoStartCompanion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gateway: { ...formData.gateway, autoStartCompanion: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Enable nah-bridge MCP Service</div>
                    <div className="setting-help">Connect directly with the notahuman ecosystem skills and tools registry.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.gateway.enableNahBridge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gateway: { ...formData.gateway, enableNahBridge: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-group">
                  <label className="setting-label">Gateway Access Token (Optional)</label>
                  <div className="password-input-wrap">
                    <input
                      type={showSecretToken ? 'text' : 'password'}
                      placeholder="Leave blank for unauthenticated local connection"
                      value={formData.gateway.gatewayToken || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gateway: { ...formData.gateway, gatewayToken: e.target.value },
                        })
                      }
                      className="settings-input"
                    />
                    <button
                      type="button"
                      className="btn-password-toggle"
                      onClick={() => setShowSecretToken(!showSecretToken)}
                    >
                      {showSecretToken ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GIT & WORKTREES */}
            {activeTab === 'git' && (
              <div className="settings-section">
                <h3 className="section-title">Git & Worktrees</h3>
                <p className="section-desc">Single-writer protocols, worktree directories, and branch automation.</p>

                <div className="setting-group">
                  <label className="setting-label">Worktree Storage Root Directory</label>
                  <span className="setting-help">Directory where isolated agent working directories are created.</span>
                  <input
                    type="text"
                    value={formData.git.worktreeRoot}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        git: { ...formData.git, worktreeRoot: e.target.value },
                      })
                    }
                    className="settings-input"
                  />
                </div>

                <div className="setting-group">
                  <label className="setting-label">Branch Naming Template</label>
                  <span className="setting-help">Variables available: {'{agent}'}, {'{session}'}, {'{date}'}.</span>
                  <input
                    type="text"
                    value={formData.git.branchTemplate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        git: { ...formData.git, branchTemplate: e.target.value },
                      })
                    }
                    className="settings-input"
                  />
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Enforce Single-Writer Git Policy</div>
                    <div className="setting-help">Strictly prevents agents from committing directly to the main working tree.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.git.enforceSingleWriter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        git: { ...formData.git, enforceSingleWriter: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Auto-Stage on Task Complete</div>
                    <div className="setting-help">Automatically stage modified files when an agent signals completion.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.git.autoStageOnComplete}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        git: { ...formData.git, autoStageOnComplete: e.target.checked },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* TAB: SECURITY & TELEMETRY */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <h3 className="section-title">Security & Telemetry</h3>
                <p className="section-desc">Sandboxing, command verification, and token budget governance.</p>

                <div className="setting-group">
                  <label className="setting-label">Default Permissions Mode</label>
                  <div className="setting-pill-select">
                    {(['autonomous', 'supervised', 'read-only'] as const).map((perm) => (
                      <button
                        key={perm}
                        className={`pill-option ${formData.security.defaultPermissionsMode === perm ? 'active' : ''}`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            security: { ...formData.security, defaultPermissionsMode: perm },
                          })
                        }
                      >
                        {perm.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Confirm Destructive Commands</div>
                    <div className="setting-help">Ask user confirmation before executing deletion or process killing.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.security.confirmDangerousCommands}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: { ...formData.security, confirmDangerousCommands: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-row-toggle">
                  <div>
                    <div className="setting-label">Mask Secrets & API Keys in Logs</div>
                    <div className="setting-help">Redact sensitive tokens from message stream and terminal logs.</div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.security.maskSecretsInLogs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: { ...formData.security, maskSecretsInLogs: e.target.checked },
                      })
                    }
                  />
                </div>

                <div className="setting-group">
                  <label className="setting-label">Session Token Budget Alert Threshold</label>
                  <span className="setting-help">Trigger visual warning when session exceeds this token count.</span>
                  <input
                    type="number"
                    step="50000"
                    value={formData.security.tokenBudgetLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: { ...formData.security, tokenBudgetLimit: Number(e.target.value) },
                      })
                    }
                    className="settings-input"
                  />
                </div>
              </div>
            )}

            {/* TAB: DIAGNOSTICS & BACKUP */}
            {activeTab === 'diagnostics' && (
              <div className="settings-section">
                <h3 className="section-title">Diagnostics & Backup</h3>
                <p className="section-desc">Inspect live subsystem status, export configuration, and restore defaults.</p>

                {/* Diagnostics Status Cards */}
                <div className="diag-cards-grid">
                  <div className="diag-card">
                    <div className="diag-header">
                      <Server size={14} className="text-cyan" />
                      <span>OmniRoute Gateway</span>
                    </div>
                    <div className="diag-status">
                      <span className="status-dot online" />
                      <span>{formData.gateway.omniRouteUrl}</span>
                    </div>
                    <div className="diag-detail text-muted">Ready for multi-model inference</div>
                  </div>

                  <div className="diag-card">
                    <div className="diag-header">
                      <Radio size={14} className="text-yellow" />
                      <span>Remote Companion Bridge</span>
                    </div>
                    <div className="diag-status">
                      <span className="status-dot online" />
                      <span>Port {formData.gateway.companionPort} (Active)</span>
                    </div>
                    <div className="diag-detail text-muted">HTTP & WebSocket relay operational</div>
                  </div>

                  <div className="diag-card">
                    <div className="diag-header">
                      <Cpu size={14} className="text-cyan" />
                      <span>nah-bridge MCP</span>
                    </div>
                    <div className="diag-status">
                      <span className="status-dot online" />
                      <span>Connected (stdio)</span>
                    </div>
                    <div className="diag-detail text-muted">1,036 skills • 11 agents indexed</div>
                  </div>

                  <div className="diag-card">
                    <div className="diag-header">
                      <GitBranch size={14} className="text-cyan" />
                      <span>Worktrees Sandbox</span>
                    </div>
                    <div className="diag-status">
                      <span className="status-dot online" />
                      <span>{formData.git.worktreeRoot}</span>
                    </div>
                    <div className="diag-detail text-muted">Single-writer isolation enabled</div>
                  </div>
                </div>

                <div className="setting-actions-row mt-4">
                  <button className="btn-diag-action" onClick={handleExportJson}>
                    <Download size={14} className="mr-1" />
                    <span>Export Configuration (JSON)</span>
                  </button>

                  <label className="btn-diag-action cursor-pointer">
                    <Upload size={14} className="mr-1" />
                    <span>Import Configuration (JSON)</span>
                    <input type="file" accept=".json" onChange={handleImportJson} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button className="btn-settings-reset" onClick={handleResetDefaults}>
            <RotateCcw size={13} className="mr-1" />
            <span>Reset to Defaults</span>
          </button>

          <div className="settings-footer-right">
            <button className="btn-settings-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-settings-save" onClick={handleSave}>
              {savedToast ? (
                <>
                  <Check size={14} className="mr-1" />
                  <span>Applied!</span>
                </>
              ) : (
                <span>Save & Apply</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
