import React, { useState } from 'react';
import { AgentConfig } from '../types/workbench.js';
import { ChevronDown, Plus, MoreVertical, Folder, GitBranch, GripVertical, Check } from 'lucide-react';

interface AgentHeaderProps {
  agent: AgentConfig;
  allAgents: { key: string; name: string; runtime: string }[];
  onSwitchAgent?: (newAgentKey: string) => void;
  onFork: () => void;
  onNewSession: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  agent,
  allAgents,
  onSwitchAgent,
  onFork,
  onNewSession,
}) => {
  const [showAgentMenu, setShowAgentMenu] = useState(false);

  return (
    <header className="agent-header-wrapper">
      {/* Row 1: Identity + Session + Actions */}
      <div className="agent-top-header">
        <div className="agent-title-group" draggable title="Drag to reposition panel">
          <GripVertical size={13} className="drag-handle-icon" />
          
          {/* Agent Switcher Dropdown */}
          <div className="agent-switcher-container">
            <button
              type="button"
              className="agent-name-btn"
              onClick={() => setShowAgentMenu(!showAgentMenu)}
              title="Switch agent in this panel"
            >
              <span className="agent-title-text">{agent.name} / {agent.runtime}</span>
              <span className="status-dot-green" title="Active & Synchronized" />
              <ChevronDown size={11} />
            </button>

            {showAgentMenu && (
              <div className="agent-dropdown-menu">
                {allAgents.map((a) => (
                  <div
                    key={a.key}
                    className={`agent-menu-item ${a.key === agent.key ? 'selected' : ''}`}
                    onClick={() => {
                      if (onSwitchAgent) onSwitchAgent(a.key);
                      setShowAgentMenu(false);
                    }}
                  >
                    <span>{a.name} ({a.runtime})</span>
                    {a.key === agent.key && <Check size={12} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="header-center-controls">
          <div className="session-pill-dropdown" title="Session Selector">
            <span>{agent.sessionName}</span>
            <ChevronDown size={11} />
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-button" onClick={onNewSession} title="New Session / Tab">
            <Plus size={14} />
          </button>
          <button className="icon-button" title="Panel Options">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* Row 2: Workspace Context + Git Status + Fork */}
      <div className="agent-context-bar">
        <div className="context-left">
          <div className="context-item" title="Active Workspace">
            <Folder size={11} style={{ opacity: 0.8 }} />
            <span>{agent.gitStatus.workspace}</span>
          </div>

          <div className="context-item" title="Agent Worktree & Branch">
            <GitBranch size={11} style={{ opacity: 0.8 }} />
            <span>{agent.gitStatus.worktree}</span>
          </div>

          <div className="git-stats" title="Git Status: Modified, Staged, Untracked, Divergence">
            <span className="stat-modified">*{agent.gitStatus.modified}</span>
            <span className="stat-staged">+{agent.gitStatus.staged}</span>
            <span className="stat-untracked">!{agent.gitStatus.untracked}</span>
            <span className="stat-divergence">?{agent.gitStatus.divergence}</span>
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
