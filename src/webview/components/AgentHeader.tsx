import React, { useState, useRef } from 'react';
import { AgentConfig } from '../types/workbench';
import {
  IconDraggable,
  IconMenu,
  IconArrowDownS,
  IconAdd1,
  IconMore3,
  IconClose,
} from './FigmaIcons';
import { AgentOptionsMenu } from './AgentOptionsMenu';
import { useClickOutside } from '../hooks/useClickOutside';

interface AgentHeaderProps {
  agent: AgentConfig;
  allAgents: { key: string; name: string; runtime: string }[];
  slotIndex?: number;
  totalSlots?: number;
  onToggleDrawer: () => void;
  onSwitchAgent?: (newAgentKey: string) => void;
  onFork: () => void;
  onNewSession: () => void;
  onFindInSession?: (agentId: string) => void;
  onExportSession?: (agentId: string) => void;
  onDuplicateSession?: (agentId: string) => void;
  onClearSession?: (agentId: string) => void;
  onClosePanel?: (agentId: string) => void;
  onDragStart?: (slotIndex: number) => void;
  onDragEnd?: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  agent,
  allAgents,
  slotIndex,
  totalSlots,
  onToggleDrawer,
  onSwitchAgent,
  onFork,
  onNewSession,
  onFindInSession = () => {},
  onExportSession = () => {},
  onDuplicateSession = () => {},
  onClearSession = () => {},
  onClosePanel = () => {},
  onDragStart,
  onDragEnd,
}) => {
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const agentMenuRef = useRef<HTMLDivElement>(null);
  const sessionMenuRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(agentMenuRef, () => setShowAgentMenu(false), showAgentMenu);
  useClickOutside(sessionMenuRef, () => setShowSessionMenu(false), showSessionMenu);
  useClickOutside(optionsMenuRef, () => setShowOptionsMenu(false), showOptionsMenu);

  const displayName = agent.name.charAt(0).toUpperCase() + agent.name.slice(1);

  return (
    <header className="agent-session-top-header" data-node-id="2086:9398" data-name="session-top-header">
      {/* Left controls */}
      <div className="session-header-left" data-name="session-name-dropdown-select">
        {/* Drag Handle (Figma Draggable - HTML5 Drag & Drop) */}
        <div
          className="drag-handle-container"
          draggable={true}
          onDragStart={(e) => {
            if (slotIndex !== undefined) {
              e.dataTransfer.setData('text/plain', String(slotIndex));
              e.dataTransfer.effectAllowed = 'move';
              const card = (e.currentTarget as HTMLElement).closest('.agent-card') as HTMLElement;
              if (card && e.dataTransfer.setDragImage) {
                e.dataTransfer.setDragImage(card, 24, 16);
              }
              if (onDragStart) onDragStart(slotIndex);
            }
          }}
          onDragEnd={() => {
            if (onDragEnd) onDragEnd();
          }}
          title="Drag to reposition panel"
          data-name="draggable"
        >
          <IconDraggable size={18} color="#F5FCFF" />
        </div>

        {/* Hamburger Menu (Figma Menu) */}
        <button
          type="button"
          className="session-icon-btn"
          onClick={onToggleDrawer}
          title="Open Native Agent Drawer & Controls"
          data-name="menu"
        >
          <IconMenu size={18} color="#F5FCFF" />
        </button>

        {/* Agent Name Dropdown */}
        <div className="relative" ref={agentMenuRef}>
          <button
            type="button"
            className="session-dropdown-trigger"
            onClick={(e) => {
              e.stopPropagation();
              setShowAgentMenu(!showAgentMenu);
            }}
            title="Switch agent in this panel"
          >
            <span className="dropdown-label-text">{displayName}</span>
            <IconArrowDownS size={18} color="#F5FCFF" />
          </button>

          {showAgentMenu && (
            <div className="agent-dropdown-menu">
              {allAgents.map((a) => {
                const label = a.name.charAt(0).toUpperCase() + a.name.slice(1);
                return (
                  <div
                    key={a.key}
                    className={`agent-menu-item ${a.key === agent.key ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSwitchAgent) onSwitchAgent(a.key);
                      setShowAgentMenu(false);
                    }}
                  >
                    <span>{label}</span>
                    {a.key === agent.key && <span className="text-cyan ml-1">✓</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Session Name Dropdown */}
        <div className="relative session-name-wrapper" ref={sessionMenuRef}>
          <button
            type="button"
            className="session-dropdown-trigger"
            onClick={(e) => {
              e.stopPropagation();
              setShowSessionMenu(!showSessionMenu);
            }}
            title={`Session: ${agent.sessionName || 'Session Name + ID - Extra Long Name'}`}
          >
            <span className="dropdown-label-text session-title-truncate">
              {agent.sessionName || 'Session Name + ID - Extra Long Name'}
            </span>
            <IconArrowDownS size={18} color="#F5FCFF" />
          </button>

          {showSessionMenu && (
            <div className="session-dropdown-menu">
              <div className="session-dropdown-header">Active & Recent Sessions</div>
              <div className="session-menu-item selected">
                <span>{agent.sessionName || 'Current Session'}</span>
                <span className="badge-tag">Current</span>
              </div>
              <div
                className="session-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  onNewSession();
                  setShowSessionMenu(false);
                }}
              >
                <span>Create New Session</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="session-header-right" data-name="session-options">
        {/* + Button */}
        <button
          type="button"
          className="session-icon-btn"
          onClick={onNewSession}
          title="New Session"
          data-name="new-session-button"
        >
          <IconAdd1 size={18} color="#F5FCFF" />
        </button>

        {/* ... More Options Button */}
        <div className="relative" ref={optionsMenuRef}>
          <button
            type="button"
            className={`session-icon-btn ${showOptionsMenu ? 'active' : ''}`}
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            title="Session Options"
            data-name="fork-session-button"
          >
            <IconMore3 size={18} color="#F5FCFF" />
          </button>

          <AgentOptionsMenu
            isOpen={showOptionsMenu}
            onClose={() => setShowOptionsMenu(false)}
            agentId={agent.id}
            onFindInSession={onFindInSession}
            onExportSession={onExportSession}
            onDuplicateSession={onDuplicateSession}
            onClearSession={onClearSession}
            onClosePanel={onClosePanel}
          />
        </div>

        {/* Dedicated Close Button (when multiple panels active) */}
        {totalSlots !== undefined && totalSlots > 1 && (
          <button
            type="button"
            className="session-icon-btn session-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onClosePanel) onClosePanel(agent.id);
            }}
            title="Close Chat Panel"
            data-name="close-panel-button"
          >
            <IconClose size={16} color="#F5FCFF" />
          </button>
        )}
      </div>
    </header>
  );
};
