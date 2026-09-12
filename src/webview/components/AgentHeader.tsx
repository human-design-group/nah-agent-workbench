import React, { useState } from 'react';
import { AgentConfig } from '../types/workbench';
import { Menu, ChevronDown, Plus, MoreVertical, Folder, GitBranch, GripVertical, Check } from 'lucide-react';
import { AgentOptionsMenu } from './AgentOptionsMenu';

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

  // Capitalize name cleanly
  const displayName = agent.name.charAt(0).toUpperCase() + agent.name.slice(1);

  // Shorten worktree path for clean display
  const shortWorktree = agent.gitStatus.worktree.split('/').pop() || agent.gitStatus.worktree;

  return (
    <header className="agent-header-wrapper">
      {/* Row 1: Identity + Session + Actions */}
      <div className="agent-top-header">
        <div className="agent-title-group">
          {/* Hamburger Menu for fly-in drawer */}
          <button
            type="button"
            className="hamburger-btn"
            onClick={onToggleDrawer}
            title="Open Native Agent Hub & History"
          >
            <Menu size={14} />
          </button>

          <GripVertical size={13} className="drag-handle-icon" title="Drag to reposition panel" />

          {/* Agent Switcher Dropdown */}
          <div className="agent-switcher-container">
            <button
              type="button"
              className="agent-name-btn"
              onClick={() => setShowAgentMenu(!showAgentMenu)}
              title="Switch agent in this panel"
            >
              <span className="agent-title-text">{displayName}</span>
              <span className="status-dot-green" title="Active & Synchronized" />
              <ChevronDown size={11} />
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

        {/* Center: Session Pill */}
        <div className="header-center-controls">
          <div
            className="session-pill-dropdown"
            title={`Full Session: ${agent.sessionName} (${agent.sessionId})`}
            onClick={() => setShowSessionMenu(!showSessionMenu)}
          >
            <span className="session-pill-text">{agent.sessionName}</span>
            <ChevronDown size={11} />
          </div>

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

        <div className="header-actions">
          <button className="icon-button" onClick={onNewSession} title="New Session / Tab">
            <Plus size={14} />
          </button>
          
          <div className="relative">
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

      {/* Row 2: Workspace Context + Git Status + Fork */}
      <div className="agent-context-bar">
        <div className="context-left">
          <div className="context-item" title={`Workspace: ${agent.gitStatus.workspace}`}>
            <Folder size={11} style={{ opacity: 0.8 }} />
            <span className="context-text">{agent.gitStatus.workspace}</span>
          </div>

          <div className="context-item" title={`Full Worktree: ${agent.gitStatus.worktree}`}>
            <GitBranch size={11} style={{ opacity: 0.8 }} />
            <span className="context-text">{shortWorktree}</span>
          </div>

          {/* Git Stats (Primary 2 visible, all on hover) */}
          <div
            className="git-stats"
            title={`Modified: ${agent.gitStatus.modified} | Staged: ${agent.gitStatus.staged} | Untracked: ${agent.gitStatus.untracked} | Divergence: ${agent.gitStatus.divergence}`}
          >
            <span className="stat-modified">*{agent.gitStatus.modified}</span>
            <span className="stat-staged">+{agent.gitStatus.staged}</span>
            <span className="stat-hidden-hover">
              <span className="stat-untracked">!{agent.gitStatus.untracked}</span>
              <span className="stat-divergence">?{agent.gitStatus.divergence}</span>
            </span>
          </div>
        </div>

        <div className="context-right">
          <button className="fork-btn" onClick={onFork} title="Fork active branch / session">
            <GitBranch size={10} />
            <span>Fork</span>
          </button>
        </div>
      </div>
    </header>
  );
};
