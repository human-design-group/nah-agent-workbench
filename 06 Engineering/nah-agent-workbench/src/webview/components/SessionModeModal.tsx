import React, { useState } from 'react';
import { SessionMode, TeamConfig, AgentConfig } from '../types/workbench';
import { Check, CheckSquare, Square, FolderPlus, Play, X, Users, User } from 'lucide-react';

interface SessionModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: SessionMode;
  currentTeamConfig?: TeamConfig;
  availableAgents: AgentConfig[];
  onApplyMode: (mode: SessionMode, config?: TeamConfig) => void;
}

export const SessionModeModal: React.FC<SessionModeModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  currentTeamConfig,
  availableAgents,
  onApplyMode,
}) => {
  if (!isOpen) return null;

  const [selectedMode, setSelectedMode] = useState<SessionMode>(currentMode);
  const [leadId, setLeadId] = useState<string>(currentTeamConfig?.leadId || availableAgents[0]?.id || 'uno');
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(
    currentTeamConfig?.agentIds || availableAgents.map(a => a.id)
  );
  const [projectFolder, setProjectFolder] = useState<string>(
    currentTeamConfig?.projectFolder || '/Users/human/notahuman'
  );

  const toggleAgent = (id: string) => {
    if (selectedAgentIds.includes(id)) {
      if (selectedAgentIds.length > 1) {
        setSelectedAgentIds(selectedAgentIds.filter(a => a !== id));
      }
    } else {
      setSelectedAgentIds([...selectedAgentIds, id]);
    }
  };

  const handleApply = () => {
    if (selectedMode === 'independent') {
      onApplyMode('independent');
    } else {
      onApplyMode('team', {
        leadId,
        agentIds: selectedAgentIds,
        projectFolder,
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="session-mode-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Select a Session Mode</div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-content">
          {/* Independent Agent Mode */}
          <div
            className={`mode-option-card ${selectedMode === 'independent' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('independent')}
          >
            <div className="mode-radio">
              {selectedMode === 'independent' ? <CheckSquare size={18} className="text-cyan" /> : <Square size={18} />}
            </div>
            <div className="mode-info">
              <div className="mode-name">
                <User size={14} className="inline mr-1 text-cyan" /> Independent Agent Mode
              </div>
              <div className="mode-desc">You'll configure each agent independently in their panel</div>
            </div>
          </div>

          {/* Team Mode */}
          <div
            className={`mode-option-card ${selectedMode === 'team' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('team')}
          >
            <div className="mode-radio">
              {selectedMode === 'team' ? <CheckSquare size={18} className="text-cyan" /> : <Square size={18} />}
            </div>
            <div className="mode-info">
              <div className="mode-name">
                <Users size={14} className="inline mr-1 text-cyan" /> Team Mode
              </div>
              <div className="mode-desc">Select your lead, team members, and project below</div>
            </div>
          </div>

          {selectedMode === 'team' && (
            <div className="team-config-section">
              {/* Choose Team Lead */}
              <div className="section-label">Choose Team Lead</div>
              <div className="agent-choice-list">
                {availableAgents.map(agent => (
                  <div
                    key={`lead-${agent.id}`}
                    className={`agent-choice-item ${leadId === agent.id ? 'active' : ''}`}
                    onClick={() => setLeadId(agent.id)}
                  >
                    <div className="choice-checkbox">
                      {leadId === agent.id ? <CheckSquare size={14} className="text-cyan" /> : <Square size={14} />}
                    </div>
                    <span className="choice-name">{agent.name}</span>
                  </div>
                ))}
              </div>

              {/* Choose Team Agents */}
              <div className="section-label mt-3">Choose Team Agents</div>
              <div className="agent-choice-list">
                {availableAgents.map(agent => {
                  const isChecked = selectedAgentIds.includes(agent.id);
                  return (
                    <div
                      key={`agent-${agent.id}`}
                      className={`agent-choice-item ${isChecked ? 'active' : ''}`}
                      onClick={() => toggleAgent(agent.id)}
                    >
                      <div className="choice-checkbox">
                        {isChecked ? <CheckSquare size={14} className="text-cyan" /> : <Square size={14} />}
                      </div>
                      <span className="choice-name">{agent.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Choose Project Folder */}
              <div className="section-label mt-3">Choose Your Project/Folder</div>
              <div className="project-folder-input-row">
                <FolderPlus size={16} className="text-cyan folder-icon" />
                <input
                  type="text"
                  className="folder-input"
                  value={projectFolder}
                  onChange={e => setProjectFolder(e.target.value)}
                  placeholder="/Users/human/notahuman/..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-go" onClick={handleApply}>
            <Play size={14} fill="currentColor" />
            <span>Go</span>
          </button>
        </div>
      </div>
    </div>
  );
};
