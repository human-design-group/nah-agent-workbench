import React from 'react';
import { AgentConfig } from '../types/workbench.js';
import { ChevronDown, Plus, MoreVertical, Folder, GitBranch } from 'lucide-react';

interface AgentHeaderProps {
  agent: AgentConfig;
  onFork: () => void;
  onNewSession: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({ agent, onFork, onNewSession }) => {
  return (
    <header className="agent-header-wrapper">
      {/* Row 1: Identity + Session + Actions */}
      <div className="agent-top-header">
        <div className="agent-title-group">
          <span className="agent-title-text">{agent.name} / {agent.runtime}</span>
          <span className="status-dot-green" title="Active & Synchronized" />
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
