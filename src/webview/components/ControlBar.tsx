import React, { useState, useRef } from 'react';
import { LayoutMode, SessionMode, TeamConfig, RemoteShareInfo, AgentConfig } from '../types/workbench';
import { AgentoLogo } from './AgentoLogo';
import {
  IconAdd,
  IconFocus2,
  IconLayout,
  IconSettings,
  IconMore2,
  IconArrowRightS,
} from './FigmaIcons';
import { SessionProjectConfigModal } from './SessionProjectConfigModal';
import { ExtensionMoreMenu } from './ExtensionMoreMenu';
import { useClickOutside } from '../hooks/useClickOutside';

interface ControlBarProps {
  currentLayout: LayoutMode;
  onSelectLayout: (mode: LayoutMode) => void;
  sessionMode: SessionMode;
  teamConfig?: TeamConfig;
  onApplySessionMode: (mode: SessionMode, config?: TeamConfig, slots?: string[]) => void;
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
  onResetToFresh?: () => void;
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
  onResetToFresh,
}) => {
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

  const layouts: { id: LayoutMode; label: string }[] = [
    { id: 'grid', label: 'Grid (2x2)' },
    { id: 'vertical', label: 'Vertical (1x4)' },
    { id: 'horizontal', label: 'Horizontal (4x1)' },
    { id: 'split-3', label: 'Split 3 (1+2)' },
    { id: 'focus', label: 'Focus (1)' },
  ];

  return (
    <>
      <header className="main-top-header" data-node-id="2090:11049" data-name="main-top-header">
        {/* Left: Agento Wordmark Logo (Figma 2090:10844) */}
        <div className="header-left" data-name="main-heading-and-subtitle">
          <div className="h-[24px] w-[81px] relative shrink-0">
            <AgentoLogo height={24} width={81} className="brand-wordmark-agento" />
          </div>
        </div>

        {/* Right: Discrete Action Buttons (Figma 2089:10028) */}
        <div className="header-actions-right" data-name="main-heading-actions">
          {/* 1. Add Agent + */}
          <div className="relative" ref={addAgentDropdownRef}>
            <button
              type="button"
              className="header-action-btn"
              onClick={() => setIsAddAgentDropdownOpen(!isAddAgentDropdownOpen)}
              title="Add Agent to Workbench"
              data-name="add-agent"
            >
              <span>Add Agent</span>
              <IconAdd size={20} color="#F5FCFF" />
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
                      {isOpen && <span className="text-cyan ml-1">✓</span>}
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
            data-name="focus-mode-button"
          >
            <span>Focus Mode</span>
            <IconFocus2 size={20} color="#F5FCFF" />
          </button>

          {/* 3. Layout ☲ */}
          <div className="relative" ref={layoutDropdownRef}>
            <button
              type="button"
              className={`header-action-btn ${isLayoutDropdownOpen ? 'active-action' : ''}`}
              onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
              title="Select Grid / Window Layout"
              data-name="session-control-button"
            >
              <span>Layout</span>
              <IconLayout size={20} color="#F5FCFF" />
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
                    <span>{l.label}</span>
                    {currentLayout === l.id && <span className="text-cyan ml-1">✓</span>}
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
            data-name="workbench-settings"
          >
            <span>Session Control</span>
            <IconSettings size={20} color="#F5FCFF" />
          </button>

          {/* 5. Extension More Options Button (...) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              className={`header-action-btn icon-only-btn ${isMoreMenuOpen ? 'active-action' : ''}`}
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              title="Agento Workbench Options"
              data-name="extension-more-options-button"
            >
              <IconMore2 size={20} color="#F5FCFF" />
            </button>

            <ExtensionMoreMenu
              isOpen={isMoreMenuOpen}
              onClose={() => setIsMoreMenuOpen(false)}
              remoteInfo={remoteInfo}
              onOpenSettings={onOpenSettings}
              onOpenWalkthrough={onOpenWalkthrough}
              onExportSession={onExportSession}
              onFindInSession={onFindInSession}
              onDuplicateSession={onDuplicateSession}
              onCopyRemoteUrl={onCopyRemoteUrl}
              onResetToFresh={onResetToFresh}
            />
          </div>
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
          onApplySessionMode(mode, teamConfig, slots);
          setIsSessionModalOpen(false);
        }}
      />
    </>
  );
};
