import React, { useState, useRef } from 'react';
import { AgentConfig } from '../types/workbench';
import { Menu, ChevronDown, Plus, MoreVertical, Folder, GitBranch, GripVertical, Check } from 'lucide-react';
import { AgentOptionsMenu } from './AgentOptionsMenu';
import { useClickOutside } from '../hooks/useClickOutside';

interface AgentHeaderProps {
  agent: AgentConfig;
  allAgents: { key: string; name: string; runtime: string }[];
  onToggleDrawer: () => void;
  onSwitchAgent?: (newAgentKey: string) => void;
  onFork: () => void;
  onNewSession: () => void;
  onFindInSession?: (agentId: string) => void;
  onExportSession?: (agentId: string) => void;
  onDuplicateSession?: (agentId: string) => void;
  onClearSession?: (agentId: string) => void;
  onClosePanel?: (agentId: string) => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  agent,
  allAgents,
  onToggleDrawer,
  onSwitchAgent,
  onFork,
  onNewSession,
  onFindInSession = () => {},
  onExportSession = () => {},
  onDuplicateSession = () => {},
  onClearSession = () => {},
  onClosePanel = () => {},
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

  // Capitalize name cleanly
  const displayName = agent.name.charAt(0).toUpperCase() + agent.name.slice(1);

  return (
    <header className="agent-header-wrapper">
      {/* Row 1: Identity + Session + Actions */}
      <div className="agent-top-header">
        <div className="agent-title-group">
          {/* Drag Handle on the far left */}
          <div className="drag-handle-container" title="Drag to reposition panel">
            <GripVertical size={13} className="drag-handle-icon text-muted" />
          </div>

          {/* Hamburger Menu for fly-in drawer right of drag handle */}
          <button
            type="button"
            className="hamburger-btn"
            onClick={onToggleDrawer}
            title="Open Native Agent Hub & History"
          >
            <Menu size={13} />
          </button>

          {/* Agent Switcher Dropdown */}
          <div className="agent-switcher-container" ref={agentMenuRef}>
            <button
              type="button"
              className="agent-name-btn"
              onClick={() => setShowAgentMenu(!showAgentMenu)}
              title="Switch agent in this panel"
            >
              <span className="agent-title-text">{displayName}</span>
              <span className="status-dot-green" title="Active & Synchronized" />
              <ChevronDown size={11} className="text-muted" />
            </button>

            {showAgentMenu && (
              <div className="agent-dropdown-menu">
                {allAgents.map((a) => {
                  const label = a.name.charAt(0).toUpperCase() + a.name.slice(1);
                  return (
                    <div
                      key={a.key}
                      className={`agent-menu-item ${a.key === agent.key ? 'selected' : ''}`}
                      onClick={() => {
                        if (onSwitchAgent) onSwitchAgent(a.key);
                        setShowAgentMenu(false);
                      }}
                    >
                      <span>{label}</span>
                      {a.key === agent.key && <Check size={12} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center: Session Pill + Live Context Meter */}
        <div className="header-center-controls" ref={sessionMenuRef}>
          <div
            className="session-pill-dropdown"
            title={`Full Session: ${agent.sessionName} (${agent.sessionId})`}
            onClick={() => setShowSessionMenu(!showSessionMenu)}
          >
            <span className="session-pill-text">{agent.sessionName}</span>
            <ChevronDown size={11} className="text-muted flex-shrink-0" />
          </div>

          {/* Live Linear Context Meter (Figma 2096:12051) */}
          {(() => {
            const totalTokens = agent.messages.reduce((acc, m) => acc + (m.tokens || 0), 0) || 1280;
            const maxContextTokens = 200000;
            const percent = Math.min(100, Math.max(3, Math.round((totalTokens / maxContextTokens) * 100)));
            const meterClass = percent > 85 ? 'danger' : percent > 60 ? 'warning' : 'normal';
            return (
              <div
                className="context-meter-container"
                title={`Live Token Context: ${totalTokens.toLocaleString()} / ${maxContextTokens.toLocaleString()} tokens (${percent}%)`}
              >
                <div className="context-meter-track">
                  <div className={`context-meter-fill ${meterClass}`} style={{ width: `${percent}%` }} />
                </div>
                <span className="context-meter-label">{percent}%</span>
              </div>
            );
          })()}

          {showSessionMenu && (
            <div className="session-dropdown-menu">
              <div className="session-dropdown-header">Active & Recent Sessions</div>
              <div className="session-menu-item selected">
                <span>{agent.sessionName}</span>
                <span className="badge-tag">Current</span>
              </div>
              <div className="session-menu-item" onClick={() => { onNewSession(); setShowSessionMenu(false); }}>
                <Plus size={11} />
                <span>Create New Session</span>
              </div>
            </div>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          <button className="icon-button" onClick={onNewSession} title="New Session / Tab">
            <Plus size={14} />
          </button>
          
          <div className="relative" ref={optionsMenuRef}>
            <button
              className="icon-button"
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              title="Panel Options"
            >
              <MoreVertical size={14} />
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
        </div>
      </div>
    </header>
  );
};
