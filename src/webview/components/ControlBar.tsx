import React, { useState, useRef } from 'react';
import { LayoutMode, SessionMode, TeamConfig, RemoteShareInfo, AgentConfig } from '../types/workbench';
import {
  Sliders,
  MoreVertical,
  Plus,
  Users,
  LayoutGrid,
  Columns,
  Rows,
  Split,
  Maximize2,
  RefreshCw,
  ChevronDown,
  Check,
  Settings
} from 'lucide-react';
import { AgentoLogo } from './AgentoLogo';
import { SessionModeModal } from './SessionModeModal';
import { ExtensionMoreMenu } from './ExtensionMoreMenu';
import { useClickOutside } from '../hooks/useClickOutside';

interface ControlBarProps {
  currentLayout: LayoutMode;
  onSelectLayout: (mode: LayoutMode) => void;
  sessionMode: SessionMode;
  teamConfig?: TeamConfig;
  onApplySessionMode: (mode: SessionMode, config?: TeamConfig) => void;
  availableAgents: AgentConfig[];
  currentSlotKeys: string[];
  remoteInfo?: RemoteShareInfo;
  onReload: () => void;
  onOpenSettings: () => void;
  onExportSession: () => void;
  onFindInSession: () => void;
  onDuplicateSession: () => void;
  onCopyRemoteUrl: (target: 'session' | 'workspace' | 'shareCode') => void;
  onAddAgent: (agentKey: string) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentLayout,
  onSelectLayout,
  sessionMode,
  teamConfig,
  onApplySessionMode,
  availableAgents,
  currentSlotKeys,
  remoteInfo,
  onReload,
  onOpenSettings,
  onExportSession,
  onFindInSession,
  onDuplicateSession,
  onCopyRemoteUrl,
  onAddAgent,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
  const [isAddAgentDropdownOpen, setIsAddAgentDropdownOpen] = useState(false);

  const layoutDropdownRef = useRef<HTMLDivElement>(null);
  const addAgentDropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(layoutDropdownRef, () => setIsLayoutDropdownOpen(false), isLayoutDropdownOpen);
  useClickOutside(addAgentDropdownRef, () => setIsAddAgentDropdownOpen(false), isAddAgentDropdownOpen);
  useClickOutside(moreMenuRef, () => setIsMoreMenuOpen(false), isMoreMenuOpen);

  const layouts: { id: LayoutMode; label: string; icon: React.ReactNode }[] = [
    { id: 'grid', label: 'Grid (2x2)', icon: <LayoutGrid size={13} /> },
    { id: 'vertical', label: 'Vertical (1x4)', icon: <Columns size={13} /> },
    { id: 'horizontal', label: 'Horizontal (4x1)', icon: <Rows size={13} /> },
    { id: 'split-3', label: 'Split 3 (1+2)', icon: <Split size={13} /> },
    { id: 'focus', label: 'Focus (1)', icon: <Maximize2 size={13} /> },
  ];

  return (
    <>
      <header className={`control-bar ${isExpanded ? 'is-expanded' : 'is-compact'}`}>
        {/* Left: Agento Logo + Product Title */}
        <div className="bar-left">
          <div className="brand-badge-agento">
            <AgentoLogo size={24} className="brand-icon-agento" />
            <span className="brand-title">Agent Workbench</span>
          </div>
        </div>

        {/* Right: Controls Strip */}
        <div className="bar-right">
          {/* Add Agent Button / Dropdown (Figma 2028:5297) */}
          <div className="relative" ref={addAgentDropdownRef}>
            <button
              className="btn-mode-pill"
              onClick={() => setIsAddAgentDropdownOpen(!isAddAgentDropdownOpen)}
              title="Add Agent to Workbench"
            >
              <span>Add Agent to Workbench</span>
              <Plus size={14} className="btn-mode-icon ml-1" />
            </button>

            {isAddAgentDropdownOpen && (
              <div className="layout-dropdown-menu add-agent-dropdown">
                <div className="dropdown-heading">Select Agent to Open</div>
                {availableAgents.map((agent) => {
                  const isOpen = currentSlotKeys.includes(agent.key);
                  return (
                    <button
                      key={agent.id}
                      className={`dropdown-item ${isOpen ? 'active' : ''}`}
                      onClick={() => {
                        onAddAgent(agent.key);
                        setIsAddAgentDropdownOpen(false);
                      }}
                    >
                      <span style={{ textTransform: 'capitalize' }}>{agent.name}</span>
                      <span className="text-muted" style={{ fontSize: '10px', marginLeft: 'auto' }}>
                        ({agent.runtime})
                      </span>
                      {isOpen && <Check size={12} className="text-cyan ml-1" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Encompassed Control Center (Figma 2023:4609 & 2028:5292) */}
          <div className={`control-center-encompassed ${isExpanded ? 'is-open' : ''}`}>
            {isExpanded && (
              <div className="encompassed-inner-controls">
                {/* Session Mode */}
                <button
                  className="btn-encompassed-item"
                  onClick={() => setIsSessionModalOpen(true)}
                  title="Configure Session Mode (Independent vs Team)"
                >
                  <Users size={12} className="text-cyan mr-1" />
                  <span>Session Mode {sessionMode === 'team' ? '(Team)' : '(Ind)'}</span>
                  <ChevronDown size={11} className="ml-1 text-cyan" />
                </button>

                {/* Layout Dropdown */}
                <div className="relative" ref={layoutDropdownRef}>
                  <button
                    className="btn-encompassed-item"
                    onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
                    title="Select Layout Mode"
                  >
                    <LayoutGrid size={12} className="text-cyan mr-1" />
                    <span>Layout</span>
                    <ChevronDown size={11} className="ml-1 text-cyan" />
                  </button>

                  {isLayoutDropdownOpen && (
                    <div className="layout-dropdown-menu">
                      {layouts.map((l) => (
                        <button
                          key={l.id}
                          className={`dropdown-item ${currentLayout === l.id ? 'active' : ''}`}
                          onClick={() => {
                            onSelectLayout(l.id);
                            setIsLayoutDropdownOpen(false);
                          }}
                        >
                          {l.icon}
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Focus Mode Toggle */}
                <button
                  className={`btn-encompassed-item ${currentLayout === 'focus' ? 'active-cyan' : ''}`}
                  onClick={() => onSelectLayout(currentLayout === 'focus' ? 'vertical' : 'focus')}
                  title="Toggle Focus Mode"
                >
                  <span>Focus Mode</span>
                  <Maximize2 size={12} className="text-cyan ml-1" />
                </button>
              </div>
            )}

            {/* Mission Control Button (Figma 2028:5292) */}
            <button
              className="btn-mission-control-pill"
              onClick={() => setIsExpanded(!isExpanded)}
              title="Toggle Control Center Toolbar"
            >
              <span>Control Center</span>
              <Settings size={14} className="btn-mode-icon ml-1" />
            </button>
          </div>

          {/* Standalone Reload Button */}
          <button
            className="btn-standalone"
            onClick={onReload}
            title="Reload Workbench & Sync Agents"
          >
            <span>Reload</span>
            <RefreshCw size={12} className="text-cyan ml-1" />
          </button>

          {/* Standalone More Options Button */}
          <div className="relative" ref={moreMenuRef}>
            <button
              className="btn-standalone-more"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              title="Extension Settings & Remote Control"
            >
              <MoreVertical size={15} />
            </button>

            <ExtensionMoreMenu
              isOpen={isMoreMenuOpen}
              onClose={() => setIsMoreMenuOpen(false)}
              remoteInfo={remoteInfo}
              onOpenSettings={onOpenSettings}
              onExportSession={onExportSession}
              onFindInSession={onFindInSession}
              onDuplicateSession={onDuplicateSession}
              onCopyRemoteUrl={onCopyRemoteUrl}
            />
          </div>
        </div>
      </header>

      {/* Session Mode Modal */}
      <SessionModeModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        currentMode={sessionMode}
        currentTeamConfig={teamConfig}
        availableAgents={availableAgents}
        onApplyMode={onApplySessionMode}
      />
    </>
  );
};
