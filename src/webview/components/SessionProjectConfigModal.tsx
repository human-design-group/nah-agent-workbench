import React, { useState } from 'react';
import { SessionMode, TeamConfig, AgentConfig } from '../types/workbench';
import {
  Users,
  User,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  GitBranch,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AgentoLogo } from './AgentoLogo';

interface SessionProjectConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: SessionMode;
  currentTeamConfig?: TeamConfig;
  availableAgents: AgentConfig[];
  currentSlots: string[];
  onApplyConfig: (mode: SessionMode, selectedSlots: string[], projectFolder?: string) => void;
}

const AVAILABLE_AGENTS_LIST = [
  { key: 'uno', name: 'Uno', runtime: 'Hermes CoS' },
  { key: 'omo', name: 'Omo', runtime: 'Hermes Lead Dev' },
  { key: 'gravito', name: 'Gravito', runtime: 'Antigravity AI Eng' },
  { key: 'humano', name: 'Humano', runtime: 'Hermes Design' },
  { key: 'curso', name: 'Curso', runtime: 'Cursor IDE' },
  { key: 'astro', name: 'Astro', runtime: 'Hermes Architect' },
];

const SAMPLE_PROJECTS = [
  {
    id: 'proj-1',
    name: 'notahuman (Root Workspace)',
    path: '/Users/human/notahuman',
    branch: 'main',
    worktrees: ['astro/feat-workbench', 'omo/opencode-sisyphus', 'uno/cos-dispatch'],
  },
  {
    id: 'proj-2',
    name: 'human-design-group (Agent Workbench)',
    path: '/Users/human/notahuman/the-human-collective/human-design-group/hdg-projects/Agent Workbench',
    branch: 'main',
    worktrees: ['agento/v2-design-system'],
  },
  {
    id: 'proj-3',
    name: 'Hermes Bifrost Gateway',
    path: '/Users/human/notahuman/infrastructure/hermes',
    branch: 'release-3.0',
    worktrees: ['hermes/model-router'],
  },
];

export const SessionProjectConfigModal: React.FC<SessionProjectConfigModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  currentTeamConfig,
  availableAgents,
  currentSlots,
  onApplyConfig,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMode, setSelectedMode] = useState<SessionMode>(currentMode || 'independent');
  const [selectedSlots, setSelectedSlots] = useState<string[]>(
    currentSlots && currentSlots.length > 0 ? currentSlots : ['uno', 'omo', 'gravito', 'humano']
  );
  const [selectedProject, setSelectedProject] = useState<string>(SAMPLE_PROJECTS[0].path);
  const [isTreeExpanded, setIsTreeExpanded] = useState<boolean>(true);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedSlots(currentSlots && currentSlots.length > 0 ? currentSlots : ['uno', 'omo', 'gravito', 'humano']);
      setSelectedMode(currentMode || 'independent');
    }
  }, [isOpen, currentSlots, currentMode]);

  const toggleSlot = (key: string) => {
    if (selectedSlots.includes(key)) {
      if (selectedSlots.length > 1) {
        setSelectedSlots(selectedSlots.filter((s) => s !== key));
      }
    } else {
      setSelectedSlots([...selectedSlots, key]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      onApplyConfig(selectedMode, selectedSlots, selectedProject);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="concept2-modal-overlay" onClick={onClose}>
      <div className="concept2-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Left Summary Rail (Figma Concept 2) */}
        <aside className="concept2-summary-rail">
          <div className="rail-header">
            <AgentoLogo size={18} />
            <span>Setup</span>
          </div>

          <div className="rail-section">
            <span className="rail-label">Operating Mode</span>
            <span className="rail-value">
              {selectedMode === 'team' ? 'Autonomous Team' : 'Independent Specialist'}
            </span>
          </div>

          <div className="rail-section">
            <span className="rail-label">Active Slots ({selectedSlots.length})</span>
            <div className="rail-chip-list">
              {selectedSlots.map((key) => {
                const found = AVAILABLE_AGENTS_LIST.find((a) => a.key === key);
                return (
                  <div key={key} className="rail-chip">
                    <span>{found?.name || key}</span>
                    <Check size={10} className="text-cyan" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rail-section">
            <span className="rail-label">Target Worktree</span>
            <span className="rail-value text-muted" style={{ fontSize: '10.5px', wordBreak: 'break-all' }}>
              {selectedProject.split('/').pop()}
            </span>
          </div>
        </aside>

        {/* Right Main Content Split */}
        <div className="concept2-main-content">
          {/* Header */}
          <div className="concept2-modal-header">
            <h3 className="concept2-modal-title">Session & Project Switcher</h3>
            <button className="settings-close-btn" onClick={onClose} title="Close">
              <X size={16} />
            </button>
          </div>

          {/* 3-Segment Step Progress Indicator */}
          <div className="concept2-step-indicator">
            <div className={`step-indicator-bar ${step >= 1 ? (step === 1 ? 'active' : 'completed') : ''}`} />
            <div className={`step-indicator-bar ${step >= 2 ? (step === 2 ? 'active' : 'completed') : ''}`} />
            <div className={`step-indicator-bar ${step >= 3 ? (step === 3 ? 'active' : 'completed') : ''}`} />
          </div>

          {/* Step Body */}
          <div className="concept2-step-body">
            {/* STEP 1: OPERATIONAL MODE */}
            {step === 1 && (
              <>
                <h4 className="concept2-step-heading">Step 1 — Choose Operational Mode</h4>
                <p className="concept2-step-subheading">
                  Determine how agents coordinate worktrees, context relays, and task execution.
                </p>

                <div className="concept2-mode-cards">
                  <div
                    className={`concept2-mode-card ${selectedMode === 'team' ? 'is-active' : ''}`}
                    onClick={() => setSelectedMode('team')}
                  >
                    <div className="mode-card-title">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-cyan" />
                        <span>Autonomous Team</span>
                      </div>
                      {selectedMode === 'team' && <Check size={14} className="text-yellow" />}
                    </div>
                    <p className="mode-card-desc">
                      Shared worktrees, synchronized context bus, and lead agent task distribution.
                    </p>
                  </div>

                  <div
                    className={`concept2-mode-card ${selectedMode === 'independent' ? 'is-active' : ''}`}
                    onClick={() => setSelectedMode('independent')}
                  >
                    <div className="mode-card-title">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-cyan" />
                        <span>Independent Specialist</span>
                      </div>
                      {selectedMode === 'independent' && <Check size={14} className="text-yellow" />}
                    </div>
                    <p className="mode-card-desc">
                      Dedicated workspaces, isolated task lifecycles, and independent agent execution.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: AGENT SLOTS SELECTION */}
            {step === 2 && (
              <>
                <h4 className="concept2-step-heading">Step 2 — Configure Active Agent Slots</h4>
                <p className="concept2-step-subheading">
                  Select which agent runtimes to mount in the multi-panel workbench grid.
                </p>

                <div className="concept2-agents-grid">
                  {AVAILABLE_AGENTS_LIST.map((agent) => {
                    const isSelected = selectedSlots.includes(agent.key);
                    return (
                      <div
                        key={agent.key}
                        className={`concept2-agent-chip ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => toggleSlot(agent.key)}
                      >
                        <div>
                          <div className="agent-chip-name">{agent.name}</div>
                          <div className="agent-chip-runtime">{agent.runtime}</div>
                        </div>
                        {isSelected && <Check size={12} className="text-yellow" />}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* STEP 3: PROJECT & WORKTREE SELECTION */}
            {step === 3 && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="concept2-step-heading">Step 3 — Target Project & Worktree</h4>
                    <p className="concept2-step-subheading">
                      Select target workspace directory and Git worktrees for agent isolation.
                    </p>
                  </div>
                  <button
                    className="btn-diag-action"
                    onClick={() => setIsTreeExpanded(!isTreeExpanded)}
                    style={{ padding: '3px 8px', fontSize: '10.5px' }}
                  >
                    {isTreeExpanded ? 'Collapse Tree' : 'Expand Tree'}
                  </button>
                </div>

                <div className="concept2-project-tree">
                  {SAMPLE_PROJECTS.map((proj) => {
                    const isSelected = selectedProject === proj.path;
                    return (
                      <div key={proj.id} className="flex flex-col gap-1">
                        <div
                          className={`project-tree-item ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => setSelectedProject(proj.path)}
                        >
                          <div className="project-item-name">
                            {isTreeExpanded ? (
                              <FolderOpen size={13} className="text-cyan" />
                            ) : (
                              <Folder size={13} className="text-cyan" />
                            )}
                            <span>{proj.name}</span>
                          </div>
                          <div className="project-item-meta flex items-center gap-1">
                            <GitBranch size={10} />
                            <span>{proj.branch}</span>
                            {isSelected && <Check size={12} className="text-cyan ml-1" />}
                          </div>
                        </div>

                        {/* Worktree sub-items in expanded state */}
                        {isTreeExpanded && (
                          <div className="flex flex-col gap-1 pl-5">
                            {proj.worktrees.map((wt) => (
                              <div
                                key={wt}
                                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-black/20 text-muted"
                                style={{ fontSize: '10px' }}
                              >
                                <span className="flex items-center gap-1">
                                  <GitBranch size={9} className="text-yellow" />
                                  <span>{wt}</span>
                                </span>
                                <span className="text-muted">worktree</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="concept2-modal-footer">
            {step > 1 ? (
              <button className="btn-concept2-back" onClick={handleBack}>
                Back
              </button>
            ) : (
              <div />
            )}

            <button className="btn-concept2-next" onClick={handleNext}>
              {step === 3 ? 'Apply Configuration' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
