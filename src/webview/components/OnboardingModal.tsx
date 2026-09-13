import React, { useState } from 'react';
import {
  Bot,
  LayoutGrid,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  Layers,
  Cpu,
  GitBranch
} from 'lucide-react';
import { SessionMode, AgentConfig } from '../types/workbench';

interface OnboardingModalProps {
  availableAgents: AgentConfig[];
  currentSlots: string[];
  initialMode: SessionMode;
  onComplete: (mode: SessionMode, selectedSlots: string[]) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  availableAgents,
  currentSlots,
  initialMode,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMode, setSelectedMode] = useState<SessionMode>(initialMode);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(currentSlots);

  const toggleSlot = (agentKey: string) => {
    if (selectedSlots.includes(agentKey)) {
      if (selectedSlots.length > 1) {
        setSelectedSlots(selectedSlots.filter((k) => k !== agentKey));
      }
    } else {
      setSelectedSlots([...selectedSlots, agentKey]);
    }
  };

  const handleFinish = () => {
    onComplete(selectedMode, selectedSlots);
  };

  return (
    <div className="onboarding-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="onboarding-card">
        {/* Header with Step Dots & Skip */}
        <div className="onboarding-header">
          <div className="onboarding-brand">
            <Bot size={18} className="text-cyan animate-pulse" />
            <span className="onboarding-title">Agent Workbench</span>
            <span className="onboarding-badge">v0.1.0</span>
          </div>

          <div className="onboarding-stepper">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
                onClick={() => setStep(s as any)}
                title={`Step ${s}`}
              >
                {step > s ? <Check size={10} /> : s}
              </button>
            ))}
          </div>

          <button className="onboarding-skip-btn" onClick={handleFinish} title="Skip Walkthrough">
            Skip to Workbench
          </button>
        </div>

        {/* Modal Body */}
        <div className="onboarding-body">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="onboarding-step step-welcome">
              <div className="step-hero-icon">
                <Sparkles size={36} className="text-cyan" />
              </div>
              <h2 className="step-heading">Welcome to Agent Workbench</h2>
              <p className="step-subheading">
                The next-generation multi-agent mission control & responsive grid for Cursor and VS Code.
              </p>

              <div className="feature-grid">
                <div className="feature-card">
                  <LayoutGrid size={20} className="text-cyan mb-2" />
                  <h4>Responsive Dynamic Grids</h4>
                  <p>Seamlessly tile 1x4 Vertical, 2x2 Grid, 4x1 Horizontal, Split 3 (1+2), or Focus 1.</p>
                </div>

                <div className="feature-card">
                  <Users size={20} className="text-cyan mb-2" />
                  <h4>Team & Independent Modes</h4>
                  <p>Coordinate agents via Chief of Staff lead orchestration or isolated parallel streams.</p>
                </div>

                <div className="feature-card">
                  <Layers size={20} className="text-cyan mb-2" />
                  <h4>Sliding Inspector Drawers</h4>
                  <p>Real-time token metrics, latency charts, scheduled tasks, and worktree git status.</p>
                </div>

                <div className="feature-card">
                  <Globe size={20} className="text-cyan mb-2" />
                  <h4>Remote Companion Bridge</h4>
                  <p>Pair mobile and web clients directly to your IDE session via WebSocket port 4545.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Architecture & Controls */}
          {step === 2 && (
            <div className="onboarding-step step-architecture">
              <div className="step-hero-icon">
                <Cpu size={36} className="text-cyan" />
              </div>
              <h2 className="step-heading">Mission Control Architecture</h2>
              <p className="step-subheading">
                Figma-compliant encompassing control center with deep IDE and terminal bindings.
              </p>

              <div className="architecture-showcase">
                <div className="arch-item">
                  <div className="arch-icon-box">
                    <Shield size={18} className="text-cyan" />
                  </div>
                  <div className="arch-text">
                    <strong>Encompassed Control Center</strong>
                    <span>All session modes, responsive layout switchers, and remote links collapse into a unified header bar.</span>
                  </div>
                </div>

                <div className="arch-item">
                  <div className="arch-icon-box">
                    <GitBranch size={18} className="text-cyan" />
                  </div>
                  <div className="arch-text">
                    <strong>Worktree & Git Awareness</strong>
                    <span>Track branches, staged diffs, untracked changes, and divergences per agent.</span>
                  </div>
                </div>

                <div className="arch-item">
                  <div className="arch-icon-box">
                    <Bot size={18} className="text-cyan" />
                  </div>
                  <div className="arch-text">
                    <strong>Multi-Model Runtime</strong>
                    <span>Per-agent model selector supporting Claude 3.7 Sonnet, GPT-5, Gemini 2.5 Flash, and local gateways.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Initial Configuration */}
          {step === 3 && (
            <div className="onboarding-step step-configuration">
              <div className="step-hero-icon">
                <Users size={36} className="text-cyan" />
              </div>
              <h2 className="step-heading">Configure Starter Team</h2>
              <p className="step-subheading">
                Select your default operating mode and active agent slots for your workbench grid.
              </p>

              <div className="mode-toggle-group">
                <button
                  className={`mode-btn ${selectedMode === 'team' ? 'active' : ''}`}
                  onClick={() => setSelectedMode('team')}
                >
                  <Users size={16} className="mr-2 text-cyan" />
                  <div>
                    <strong>Team Orchestration Mode</strong>
                    <span>Lead coordinator delegates work to specialist agents</span>
                  </div>
                </button>

                <button
                  className={`mode-btn ${selectedMode === 'independent' ? 'active' : ''}`}
                  onClick={() => setSelectedMode('independent')}
                >
                  <LayoutGrid size={16} className="mr-2 text-cyan" />
                  <div>
                    <strong>Independent Multi-Agent Mode</strong>
                    <span>Parallel side-by-side agents operating independently</span>
                  </div>
                </button>
              </div>

              <div className="slot-selector-section">
                <div className="selector-title">Active Starter Agents ({selectedSlots.length} selected):</div>
                <div className="agent-chips">
                  {availableAgents.map((agent) => {
                    const isSelected = selectedSlots.includes(agent.key);
                    return (
                      <button
                        key={agent.id}
                        className={`agent-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSlot(agent.key)}
                      >
                        <Bot size={13} className="mr-1" />
                        <span>{agent.name}</span>
                        <span className="chip-runtime">({agent.runtime})</span>
                        {isSelected && <Check size={12} className="ml-1 text-cyan" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Ready to Launch */}
          {step === 4 && (
            <div className="onboarding-step step-launch">
              <div className="step-hero-icon success">
                <Check size={40} className="text-cyan" />
              </div>
              <h2 className="step-heading">Ready for Launch</h2>
              <p className="step-subheading">
                Your Agent Workbench is configured and connected to the local mission control bridge.
              </p>

              <div className="launch-summary-card">
                <div className="summary-row">
                  <span className="summary-label">Session Mode</span>
                  <span className="summary-val capitalize">{selectedMode} Mode</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Active Slots</span>
                  <span className="summary-val">{selectedSlots.join(', ')}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Remote Bridge</span>
                  <span className="summary-val text-cyan">Port 4545 Active</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Default Shortcut</span>
                  <span className="summary-val">Cmd+Option+N / Ctrl+Alt+N</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="onboarding-footer">
          {step > 1 ? (
            <button className="btn-nav-prev" onClick={() => setStep((s) => (s - 1) as any)}>
              <ArrowLeft size={14} className="mr-1" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button className="btn-nav-next" onClick={() => setStep((s) => (s + 1) as any)}>
              Next Step <ArrowRight size={14} className="ml-1" />
            </button>
          ) : (
            <button className="btn-nav-launch" onClick={handleFinish}>
              Launch Mission Control <Sparkles size={14} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
