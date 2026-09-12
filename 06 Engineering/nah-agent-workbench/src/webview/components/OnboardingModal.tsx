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
} from 'lucide-react';
import { SystemEnvironmentScan, DetectedAgentRuntime, SessionMode } from '../types/workbench';

interface OnboardingModalProps {
  scan?: SystemEnvironmentScan;
  onRefreshScan: () => void;
  onComplete: (teamMode: SessionMode, selectedAgents: string[]) => void;
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
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['astro', 'humano', 'uno', 'omo']);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    if (scan?.recommendedTeamMode) {
      setSelectedMode(scan.recommendedTeamMode);
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
      setSelectedAgents([...selectedAgents, id]);
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
          width: 680,
          maxWidth: '92vw',
          maxHeight: '88vh',
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
                width: 32,
                height: 32,
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
                Multi-Agent Responsive Mission Control
              </div>
            </div>
          </div>

          {/* Step Pills */}
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
                Agent Workbench transforms Cursor and VS Code into an integrated mission control center.
                Orchestrate multiple specialized autonomous agents side-by-side with real-time responsive grids,
                live git worktrees, and unified model routing.
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
                    <Users size={16} /> Parallel Multi-Agent
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.4 }}>
                    Run Astro, Humano, Uno, and Omo concurrently with synchronized context.
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
                    <Server size={16} /> Live OmniRoute Gateway
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.4 }}>
                    Automated model compression, fallback safety nets, and token optimization.
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#f0f6fc' }}>
                    Agent Runtime & Environment Scan
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e' }}>
                    Auto-detecting installed CLIs and local AI gateway status
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

              {/* Gateway Banner */}
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: scan?.gateway?.connected ? 'rgba(46, 160, 67, 0.1)' : 'rgba(210, 153, 34, 0.1)',
                  border: scan?.gateway?.connected ? '1px solid rgba(46, 160, 67, 0.3)' : '1px solid rgba(210, 153, 34, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Server size={18} color={scan?.gateway?.connected ? '#3fb950' : '#d29922'} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: scan?.gateway?.connected ? '#3fb950' : '#d29922' }}>
                      {scan?.gateway?.connected ? 'OmniRoute Gateway Active (localhost:20128)' : 'OmniRoute Gateway Offline'}
                    </div>
                    <div style={{ fontSize: 11, color: '#8b949e' }}>
                      {scan?.gateway?.connected
                        ? `Version: ${scan.gateway.version} | 299 Catalog Models | Compression Stacked`
                        : 'Using built-in direct model fallbacks and standard API endpoints'}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 12,
                    backgroundColor: scan?.gateway?.connected ? 'rgba(46, 160, 67, 0.2)' : 'rgba(210, 153, 34, 0.2)',
                    color: scan?.gateway?.connected ? '#3fb950' : '#d29922',
                    fontWeight: 600,
                  }}
                >
                  {scan?.gateway?.connected ? 'CONNECTED' : 'STANDALONE'}
                </span>
              </div>

              {/* Agent Runtime Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {scan?.agents?.map((agent: DetectedAgentRuntime) => (
                  <div
                    key={agent.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      backgroundColor: '#16171b',
                      border: '1px solid #27282b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Terminal size={16} color={agent.installed ? '#3fb950' : '#8b949e'} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc' }}>
                          {agent.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#8b949e' }}>
                          {agent.description}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {agent.installed ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#3fb950', fontSize: 12 }}>
                          <CheckCircle2 size={14} /> Ready ({agent.version})
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, color: '#8b949e', backgroundColor: '#1f2023', padding: '2px 6px', borderRadius: 4 }}>
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
                Model Routing & Permissions
              </div>
              <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 16 }}>
                Configure how Agent Workbench dispatches prompts and executes tools.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: 14, backgroundColor: '#16171b', border: '1px solid #27282b', borderRadius: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 4 }}>
                    OmniRoute Auto-Compression (RTK + Caveman)
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.4 }}>
                    Automatically compresses large tool schemas, system instructions, and conversation history to save up to 89% of token overhead.
                  </div>
                </div>

                <div style={{ padding: 14, backgroundColor: '#16171b', border: '1px solid #27282b', borderRadius: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 4 }}>
                    1M+ Token Fallback Safety Net
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.4 }}>
                    Guarantees that long multi-turn sessions automatically failover to DeepSeek V4 Pro (1M) or Nova Pro (300k) without context overruns.
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#f0f6fc' }}>
                Select Starter Team & Layout
              </div>
              <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 16 }}>
                Choose your default orchestration mode and starting agents.
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
                    Shared project folder, designated Team Lead, and synchronized task execution.
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
                    Independent Agents
                  </div>
                  <div style={{ fontSize: 12, color: '#8b949e' }}>
                    Isolated sessions, individual worktrees, and per-card task tracking.
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 8 }}>
                Select Active Agents:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { id: 'astro', label: 'Astro' },
                  { id: 'humano', label: 'Humano' },
                  { id: 'uno', label: 'Uno' },
                  { id: 'omo', label: 'Omo' },
                ].map((a) => (
                  <div
                    key={a.id}
                    onClick={() => toggleAgent(a.id)}
                    style={{
                      padding: '8px 12px',
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
                onClick={() => onComplete(selectedMode, selectedAgents)}
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
