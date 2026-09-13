import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Server,
  Terminal,
  ArrowRight,
  RefreshCw,
  Users,
  Layers,
  ShieldCheck,
  Check,
  Key,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { SystemEnvironmentScan, DetectedAgentRuntime, SessionMode } from '../types/workbench';

interface OnboardingModalProps {
  scan?: SystemEnvironmentScan;
  onRefreshScan: () => void;
  onComplete: (teamMode: SessionMode, selectedAgents: string[], apiKey?: string, apiEndpoint?: string) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  scan,
  onRefreshScan,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedMode, setSelectedMode] = useState<SessionMode>('team');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['cursor-agent', 'codex-chatgpt', 'claude-code', 'opencode']);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiEndpoint, setApiEndpoint] = useState<string>('');
  const [providerType, setProviderType] = useState<'gateway' | 'openai' | 'anthropic' | 'openrouter' | 'custom'>('gateway');

  useEffect(() => {
    if (scan?.recommendedTeamMode) {
      setSelectedMode(scan.recommendedTeamMode);
    }
    // Auto-select installed agents if detected
    if (scan?.agents) {
      const installed = scan.agents.filter((a) => a.installed).map((a) => a.id);
      if (installed.length >= 2) {
        setSelectedAgents(installed.slice(0, 4));
      }
    }
  }, [scan]);

  const handleTriggerRefresh = () => {
    setIsScanning(true);
    onRefreshScan();
    setTimeout(() => setIsScanning(false), 800);
  };

  const toggleAgent = (id: string) => {
    if (selectedAgents.includes(id)) {
      if (selectedAgents.length > 1) {
        setSelectedAgents(selectedAgents.filter((a) => a !== id));
      }
    } else {
      if (selectedAgents.length < 4) {
        setSelectedAgents([...selectedAgents, id]);
      } else {
        // Replace last item
        setSelectedAgents([...selectedAgents.slice(0, 3), id]);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 6, 8, 0.85)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: 720,
          maxWidth: '94vw',
          maxHeight: '90vh',
          backgroundColor: '#121316',
          border: '1px solid #27282b',
          borderRadius: 12,
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#e6edf3',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top Header & Progress */}
        <div
          style={{
            padding: '20px 24px 16px 24px',
            borderBottom: '1px solid #1f2023',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                backgroundColor: 'rgba(56, 139, 253, 0.15)',
                border: '1px solid rgba(56, 139, 253, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#58a6ff',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f6fc' }}>
                Agent Workbench Setup Wizard
              </div>
              <div style={{ fontSize: 12, color: '#8b949e' }}>
                Universal Multi-Agent Mission Control for Cursor & VS Code
              </div>
            </div>
          </div>

          {/* Step Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                onClick={() => setStep(s)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: step === s ? '#388bfd' : step > s ? 'rgba(56, 139, 253, 0.2)' : '#1c1d21',
                  color: step === s ? '#ffffff' : step > s ? '#58a6ff' : '#6e7681',
                  border: step === s ? '1px solid #58a6ff' : '1px solid #27282b',
                  transition: 'all 0.15s ease',
                }}
              >
                {step > s ? <Check size={14} /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {step === 1 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#f0f6fc' }}>
                Welcome to Agent Workbench
              </div>
              <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.6, marginBottom: 20 }}>
                Agent Workbench gives you a synchronized multi-agent grid right inside your editor. Run
                multiple AI coding agents (Claude Code, ChatGPT/Codex, Cursor Agent, OpenCode, Hermes, and more)
                side-by-side with real-time streaming, git worktree awareness, and unified context sharing.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    backgroundColor: '#16171b',
                    border: '1px solid #27282b',
                    borderRadius: 8,
                    padding: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#58a6ff', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                    <Users size={16} /> Any Agent & CLI
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.4 }}>
                    Auto-detects your installed coding tools on macOS & Windows.
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#16171b',
                    border: '1px solid #27282b',
                    borderRadius: 8,
                    padding: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3fb950', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                    <Server size={16} /> BYOK & Local Gateway
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.4 }}>
                    Connect direct API keys (OpenAI, Anthropic, OpenRouter) or local gateways.
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: '#16171b',
                  border: '1px solid #27282b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Terminal size={18} color="#8b949e" />
                <div style={{ fontSize: 12, color: '#c9d1d9' }}>
                  Platform Detected: <strong>{scan?.platformName || (process.platform === 'win32' ? 'Windows' : 'macOS')} ({scan?.arch || 'x64'})</strong> | Git: {scan?.gitDetected ? 'Detected' : 'Not Found'}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#f0f6fc' }}>
                    Auto-Detected Agent Runtimes & CLIs
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e' }}>
                    Scanning your system PATH for installed AI tools & coding companions
                  </div>
                </div>
                <button
                  onClick={handleTriggerRefresh}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 6,
                    backgroundColor: '#1c1d21',
                    border: '1px solid #27282b',
                    color: '#c9d1d9',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={13} className={isScanning ? 'animate-spin' : ''} /> Rescan
                </button>
              </div>

              {/* Agent Runtime Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto' }}>
                {scan?.agents?.map((agent: DetectedAgentRuntime) => (
                  <div
                    key={agent.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      backgroundColor: '#16171b',
                      border: agent.installed ? '1px solid rgba(46, 160, 67, 0.4)' : '1px solid #27282b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Terminal size={16} color={agent.installed ? '#3fb950' : '#8b949e'} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc' }}>
                            {agent.name}
                          </span>
                          <span style={{ fontSize: 10, color: '#8b949e', backgroundColor: '#1f2023', padding: '1px 6px', borderRadius: 4 }}>
                            {agent.provider}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#8b949e' }}>
                          {agent.description}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {agent.installed ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#3fb950', fontSize: 12, fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> Ready ({agent.version})
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 10, color: '#8b949e', backgroundColor: '#1f2023', padding: '2px 6px', borderRadius: 4 }}>
                            {agent.installCommand}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#f0f6fc' }}>
                Model Gateway & API Key Setup (Optional BYOK)
              </div>
              <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 16 }}>
                Agent Workbench can run with your local CLI runtimes, local gateways, or direct API keys.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { id: 'gateway', label: 'Local CLI / Gateway', desc: 'OmniRoute, Ollama, or local CLIs' },
                  { id: 'openai', label: 'OpenAI (Direct Key)', desc: 'GPT-5, Codex, GPT-4o' },
                  { id: 'anthropic', label: 'Anthropic (Direct Key)', desc: 'Claude 3.7 Sonnet, Opus' },
                  { id: 'openrouter', label: 'OpenRouter (BYOK)', desc: 'Unified API for all models' },
                  { id: 'custom', label: 'Custom Endpoint', desc: 'Any /v1/chat/completions URL' },
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setProviderType(p.id as any)}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: providerType === p.id ? 'rgba(56, 139, 253, 0.12)' : '#16171b',
                      border: providerType === p.id ? '1px solid #388bfd' : '1px solid #27282b',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: providerType === p.id ? '#58a6ff' : '#f0f6fc', marginBottom: 2 }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: 10, color: '#8b949e' }}>{p.desc}</div>
                  </div>
                ))}
              </div>

              {providerType !== 'gateway' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, backgroundColor: '#16171b', border: '1px solid #27282b', borderRadius: 8 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
                      API Key (stored securely in VS Code Secret Storage)
                    </label>
                    <input
                      type="password"
                      placeholder={`sk-... (Enter your ${providerType.toUpperCase()} API Key)`}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#1f2023',
                        border: '1px solid #27282b',
                        borderRadius: 6,
                        color: '#f0f6fc',
                        fontSize: 12,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {providerType === 'custom' && (
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
                        Base Endpoint URL
                      </label>
                      <input
                        type="text"
                        placeholder="http://localhost:8000/v1"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: '#1f2023',
                          border: '1px solid #27282b',
                          borderRadius: 6,
                          color: '#f0f6fc',
                          fontSize: 12,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#f0f6fc' }}>
                Select Active Agents & Workspace Mode
              </div>
              <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 16 }}>
                Choose the 2 to 4 agents you want to collaborate with in your primary grid.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div
                  onClick={() => setSelectedMode('team')}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    backgroundColor: selectedMode === 'team' ? 'rgba(56, 139, 253, 0.1)' : '#16171b',
                    border: selectedMode === 'team' ? '1px solid #388bfd' : '1px solid #27282b',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: selectedMode === 'team' ? '#58a6ff' : '#f0f6fc', marginBottom: 4 }}>
                    Team Mode (Recommended)
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e' }}>
                    Shared project directory, synchronized task distribution, and collective file edits.
                  </div>
                </div>

                <div
                  onClick={() => setSelectedMode('independent')}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    backgroundColor: selectedMode === 'independent' ? 'rgba(56, 139, 253, 0.1)' : '#16171b',
                    border: selectedMode === 'independent' ? '1px solid #388bfd' : '1px solid #27282b',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: selectedMode === 'independent' ? '#58a6ff' : '#f0f6fc', marginBottom: 4 }}>
                    Independent Panels
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e' }}>
                    Isolated conversations, independent git branches, and individual task focus.
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 8 }}>
                Select Active Slots (Up to 4):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { id: 'cursor-agent', label: 'Cursor Agent' },
                  { id: 'codex-chatgpt', label: 'ChatGPT / Codex' },
                  { id: 'claude-code', label: 'Claude Code' },
                  { id: 'opencode', label: 'OpenCode' },
                  { id: 'hermes', label: 'Hermes' },
                  { id: 'openclaw', label: 'OpenClaw' },
                  { id: 'gemini-cli', label: 'Gemini / Astro' },
                  { id: 'ollama', label: 'Ollama Local' },
                ].map((a) => (
                  <div
                    key={a.id}
                    onClick={() => toggleAgent(a.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 6,
                      backgroundColor: selectedAgents.includes(a.id) ? '#1f2937' : '#16171b',
                      border: selectedAgents.includes(a.id) ? '1px solid #388bfd' : '1px solid #27282b',
                      color: selectedAgents.includes(a.id) ? '#58a6ff' : '#8b949e',
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {a.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #1f2023',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0e0f12',
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                backgroundColor: 'transparent',
                border: '1px solid #27282b',
                color: '#c9d1d9',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  borderRadius: 6,
                  backgroundColor: '#388bfd',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => onComplete(selectedMode, selectedAgents, apiKey, apiEndpoint)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 22px',
                  borderRadius: 6,
                  backgroundColor: '#238636',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 0 12px rgba(35, 134, 54, 0.4)',
                }}
              >
                Launch Workbench <Sparkles size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
