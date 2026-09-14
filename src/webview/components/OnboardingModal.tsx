import React, { useState } from 'react';
import {
  Users,
  LayoutGrid,
  BarChart3,
  Globe,
  Shield,
  GitBranch,
  Bot,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { SessionMode, AgentConfig } from '../types/workbench';
import { AgentoLogo } from './AgentoLogo';

interface OnboardingModalProps {
  availableAgents: AgentConfig[];
  currentSlots: string[];
  initialMode: SessionMode;
  onComplete: (mode: SessionMode, selectedSlots: string[]) => void;
  onClose: () => void;
}

const ALL_POSSIBLE_AGENTS = [
  { key: 'antigravity', name: 'AntiGravity', runtime: 'astro' },
  { key: 'claude', name: 'Claude', runtime: 'anthropic' },
  { key: 'codex', name: 'ChatGPT / Codex', runtime: 'openai' },
  { key: 'cline', name: 'Cline', runtime: 'cli' },
  { key: 'cursor', name: 'Cursor', runtime: 'native' },
  { key: 'gemini', name: 'Gemini', runtime: 'google' },
  { key: 'hermes', name: 'Hermes', runtime: 'uno' },
  { key: 'kilo', name: 'Kilo', runtime: 'cli' },
  { key: 'openclaw', name: 'OpenClaw', runtime: 'humano' },
  { key: 'opencode', name: 'OpenCode', runtime: 'omo' },
  { key: 'ollama', name: 'Ollama (Local)', runtime: 'local' },
  { key: 'other', name: 'Other', runtime: 'custom' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  availableAgents,
  currentSlots,
  initialMode,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMode, setSelectedMode] = useState<SessionMode>(initialMode);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(
    currentSlots.length > 0 ? currentSlots : ['antigravity', 'hermes', 'openclaw', 'opencode']
  );

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

  // Detected count based on availableAgents or standard local agents
  const detectedCount = Math.max(availableAgents.length, 4);

  return (
    <div className="onboarding-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="onboarding-modal-container">
        {/* Top Header Bar */}
        <div className="onboarding-top-header">
          <div className="onboarding-header-left">
            <AgentoLogo size={20} className="mr-2" />
            <span className="brand-title">Agent Workbench</span>
            <div className="mode-tag-pill">
              <span>Mode</span>
            </div>
          </div>

          <div className="onboarding-header-right">
            <button className="btn-header-reload" onClick={handleFinish} title="Skip to Workbench">
              <span>Skip Walkthrough</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="onboarding-main-content">
          {/* STEP 1: Welcome Screen (Figma 2036:1171) */}
          {step === 1 && (
            <div className="onboarding-step-view animate-fade-in">
              <div className="step-hero-section">
                <div className="step-hero-logo-box">
                  <AgentoLogo size={72} />
                </div>
                <h1 className="step-title">Welcome to Agento Workbench</h1>
                <p className="step-description">
                  The next-generation multi-agent mission control & responsive grid for Cursor and VS Code.
                </p>
              </div>

              <div className="step-content-panel">
                <div className="step1-cards-grid">
                  {/* Card 1 */}
                  <div className="step-card-box">
                    <div className="card-icon-header">
                      <LayoutGrid size={28} className="text-almost-white" />
                    </div>
                    <h3 className="card-title">Responsive Dynamic Grids</h3>
                    <p className="card-body-text">
                      Seamlessly tile 1x4 Vertical, 2x2 Grid, 4x1 Horizontal, Split 3 (1+2), or Focus 1.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="step-card-box">
                    <div className="card-icon-header">
                      <Users size={28} className="text-almost-white" />
                    </div>
                    <h3 className="card-title">Team & Independent Modes</h3>
                    <p className="card-body-text">
                      Coordinate agents via Team Lead orchestration or isolated parallel streams.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="step-card-box">
                    <div className="card-icon-header">
                      <BarChart3 size={28} className="text-almost-white" />
                    </div>
                    <h3 className="card-title">Sliding Inspector Drawers</h3>
                    <p className="card-body-text">
                      Real-time metrics, charts, scheduled tasks, and worktree git status.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="step-card-box">
                    <div className="card-icon-header">
                      <Globe size={28} className="text-almost-white" />
                    </div>
                    <h3 className="card-title">Remote Companion Bridge</h3>
                    <p className="card-body-text">
                      Pair mobile and web clients directly to your IDE session via WebSocket
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Mission Control Architecture (Figma 2064:2610) */}
          {step === 2 && (
            <div className="onboarding-step-view animate-fade-in">
              <div className="step-hero-section">
                <div className="step-hero-icon-box">
                  <HardDrive size={56} className="text-almost-white" />
                </div>
                <h1 className="step-title">Mission Control Architecture</h1>
                <p className="step-description">
                  Figma-compliant encompassing control center with deep IDE and terminal bindings.
                </p>
              </div>

              <div className="step-content-panel">
                <div className="step2-cards-stack">
                  {/* Stack Item 1 */}
                  <div className="step-horizontal-card">
                    <div className="card-icon-header flex-shrink-0">
                      <Shield size={32} className="text-almost-white" />
                    </div>
                    <div className="horizontal-card-text">
                      <h3 className="card-title">Encompassed Control Center</h3>
                      <p className="card-body-text">
                        All session modes, responsive layout switchers, and remote links collapse into a unified header bar.
                      </p>
                    </div>
                  </div>

                  {/* Stack Item 2 */}
                  <div className="step-horizontal-card">
                    <div className="card-icon-header flex-shrink-0">
                      <GitBranch size={32} className="text-almost-white" />
                    </div>
                    <div className="horizontal-card-text">
                      <h3 className="card-title">Worktree & Git Awareness</h3>
                      <p className="card-body-text">
                        Get live stats and track branches, staged diffs, untracked changes, and divergences per agent.
                      </p>
                    </div>
                  </div>

                  {/* Stack Item 3 */}
                  <div className="step-horizontal-card">
                    <div className="card-icon-header flex-shrink-0">
                      <Bot size={32} className="text-almost-white" />
                    </div>
                    <div className="horizontal-card-text">
                      <h3 className="card-title">Multi-Model Runtime</h3>
                      <p className="card-body-text">
                        Per-agent model selector supporting Claude 3.7 Sonnet, GPT-5, Gemini 2.5 Flash, and local gateways.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Configure Starter Team (Figma 2064:2777) */}
          {step === 3 && (
            <div className="onboarding-step-view animate-fade-in">
              <div className="step-hero-section">
                <div className="step-hero-icon-box">
                  <Users size={56} className="text-almost-white" />
                </div>
                <h1 className="step-title">Configure Your Starter Team</h1>
                <p className="step-description">
                  Select your default operating mode and active agent slots for your workbench grid.
                </p>
              </div>

              <div className="step-content-panel">
                <div className="step3-modes-row">
                  {/* Mode 1: Team Mode */}
                  <button
                    type="button"
                    className={`step3-mode-card ${selectedMode === 'team' ? 'is-selected' : ''}`}
                    onClick={() => setSelectedMode('team')}
                  >
                    <Users size={32} className="card-mode-icon" />
                    <div className="mode-card-content">
                      <h3 className="card-title">Team Orchestration Mode</h3>
                      <p className="card-body-text">
                        Coordinate agents via Team Lead orchestration or isolated parallel streams.
                      </p>
                    </div>
                  </button>

                  {/* Mode 2: Independent Mode */}
                  <button
                    type="button"
                    className={`step3-mode-card ${selectedMode === 'independent' ? 'is-selected' : ''}`}
                    onClick={() => setSelectedMode('independent')}
                  >
                    <Bot size={32} className="card-mode-icon" />
                    <div className="mode-card-content">
                      <h3 className="card-title">Independent Multi-Agent Mode</h3>
                      <p className="card-body-text">
                        Coordinate agents via Team Lead orchestration or isolated parallel streams.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Agent Slots Selection Grid */}
                <div className="step3-agents-section">
                  <h3 className="section-title">Choose Your Agents ({detectedCount} Detected)</h3>
                  
                  <div className="step3-agents-grid">
                    {ALL_POSSIBLE_AGENTS.map((agent) => {
                      const isSelected = selectedSlots.includes(agent.key);
                      return (
                        <button
                          key={agent.key}
                          type="button"
                          className={`agent-slot-pill-btn ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => toggleSlot(agent.key)}
                        >
                          <Bot size={14} className="agent-pill-icon" />
                          <span className="agent-pill-label">{agent.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Ready for Launch (Figma 2064:3223) */}
          {step === 4 && (
            <div className="onboarding-step-view animate-fade-in">
              <div className="step-hero-section">
                <div className="step-hero-icon-box">
                  <CheckCircle2 size={56} className="text-almost-white" />
                </div>
                <h1 className="step-title">Ready for Launch</h1>
                <p className="step-description">
                  Your Agent Workbench is configured and connected to the local mission control bridge.
                </p>
              </div>

              <div className="step-content-panel">
                <div className="step4-summary-card">
                  {/* Row 1: Session Mode */}
                  <div className="summary-card-row">
                    <CheckCircle2 size={16} className="summary-check-icon" />
                    <span className="summary-label-col">Session Mode</span>
                    <span className="summary-value-col">
                      {selectedMode === 'team' ? 'Team Orchestration Mode' : 'Independent Multi-Agent Mode'}
                    </span>
                  </div>

                  {/* Row 2: Active Slots */}
                  <div className="summary-card-row">
                    <CheckCircle2 size={16} className="summary-check-icon" />
                    <span className="summary-label-col">Active Agent Slots</span>
                    <span className="summary-value-col">
                      {selectedSlots
                        .map((k) => {
                          const found = ALL_POSSIBLE_AGENTS.find((a) => a.key === k);
                          return found ? found.name : k;
                        })
                        .join(', ')}
                    </span>
                  </div>

                  {/* Row 3: Remote Bridge */}
                  <div className="summary-card-row">
                    <CheckCircle2 size={16} className="summary-check-icon" />
                    <span className="summary-label-col">Remote Bridge</span>
                    <span className="summary-value-col">Port 4545 - Ready to Pair</span>
                  </div>

                  {/* Row 4: Default Shortcut */}
                  <div className="summary-card-row">
                    <CheckCircle2 size={16} className="summary-check-icon" />
                    <span className="summary-label-col">Default Shortcut</span>
                    <span className="summary-value-col">Cmd+Option+N / Ctrl+Alt+N</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Strip (Exact Figma 2064:3541 / 2064:3520 / 2064:2675 / 2064:3499) */}
        <div className="onboarding-bottom-bar">
          {/* Left: Back Button */}
          <button
            type="button"
            className={`btn-onboarding-nav btn-nav-back ${step === 1 ? 'is-disabled' : ''}`}
            onClick={() => step > 1 && setStep((s) => (s - 1) as any)}
            disabled={step === 1}
          >
            <ArrowLeft size={12} className="mr-1" />
            <span>Back</span>
          </button>

          {/* Center: 1 2 3 4 Steps Indicator */}
          <div className="onboarding-step-numbers">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                type="button"
                className={`step-number-btn ${step === s ? 'is-active' : ''}`}
                onClick={() => setStep(s as any)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Right: Next or Launch Button */}
          {step < 4 ? (
            <button
              type="button"
              className="btn-onboarding-nav btn-nav-next"
              onClick={() => setStep((s) => (s + 1) as any)}
            >
              <span>Next</span>
              <ArrowRight size={12} className="ml-1" />
            </button>
          ) : (
            <button
              type="button"
              className="btn-onboarding-nav btn-nav-launch-agento"
              onClick={handleFinish}
            >
              <span>Launch Agento</span>
              <ArrowRight size={12} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
