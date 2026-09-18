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
import { SessionProjectConfigModal } from './SessionProjectConfigModal';
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
  onOpenWalkthrough: () => void;
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
  onOpenWalkthrough,
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
      <header className="main-top-header">
        {/* Left: Agento Wordmark Logo (Figma 2090:10844) */}
        <div className="header-left">
          <AgentoLogo height={22} className="brand-wordmark-agento" />
        </div>

        {/* Right: Discrete Action Buttons (Figma 2089:10028) */}
        <div className="header-actions-right">
          {/* 1. Add Agent + */}
          <div className="relative" ref={addAgentDropdownRef}>
            <button
              type="button"
              className="header-action-btn"
              onClick={() => setIsAddAgentDropdownOpen(!isAddAgentDropdownOpen)}
              title="Add Agent to Workbench"
            >
              <span>Add Agent</span>
              <Plus size={13} className="header-action-icon" />
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

          {/* 2. Focus Mode ⊙ */}
          <button
            type="button"
            className={`header-action-btn ${currentLayout === 'focus' ? 'active-action' : ''}`}
            onClick={() => onSelectLayout(currentLayout === 'focus' ? 'grid' : 'focus')}
            title="Toggle Single Agent Focus Mode"
          >
            <span>Focus Mode</span>
            <Maximize2 size={12} className="header-action-icon" />
          </button>

          {/* 3. Layout ☲ */}
          <div className="relative" ref={layoutDropdownRef}>
            <button
              type="button"
              className="header-action-btn"
              onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
              title="Select Grid / Window Layout"
            >
              <span>Layout</span>
              <LayoutGrid size={12} className="header-action-icon" />
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

          {/* 4. Session Control ⚙ */}
          <button
            type="button"
            className="header-action-btn"
            onClick={() => setIsSessionModalOpen(true)}
            title="Session Control & Concept 2 Config"
          >
            <span>Session Control</span>
            <Settings size={12} className="header-action-icon" />
          </button>
        </div>
      </header>

      {/* In-Extension Session & Project Switcher Modal (Figma Concept 2) */}
      <SessionProjectConfigModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        currentMode={sessionMode}
        currentTeamConfig={teamConfig}
        availableAgents={availableAgents}
        currentSlots={currentSlotKeys}
        onApplyConfig={(mode, slots, projectFolder) => {
          onApplySessionMode(mode, teamConfig);
          setIsSessionModalOpen(false);
        }}
      />
    </>
  );
};
