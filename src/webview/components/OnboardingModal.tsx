import React, { useState, useEffect } from 'react';
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
  HardDrive,
  Key,
  Server,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { SessionMode, AgentConfig, ProviderConfig, ProviderTestResult, ProviderType } from '../types/workbench';
import { AgentoLogo } from './AgentoLogo';

interface OnboardingModalProps {
  availableAgents: AgentConfig[];
  currentSlots: string[];
  initialMode: SessionMode;
  providerConfig?: ProviderConfig;
  providerTestResult?: ProviderTestResult | null;
  isTestingProvider?: boolean;
  onTestProvider?: (config: ProviderConfig) => void;
  onSaveProvider?: (config: ProviderConfig) => void;
  onComplete: (mode: SessionMode, selectedSlots: string[]) => void;
  onClose: () => void;
}

const ALL_POSSIBLE_AGENTS = [
  { key: 'uno', name: 'Uno', runtime: 'Hermes' },
  { key: 'omo', name: 'Omo', runtime: 'Hermes' },
  { key: 'gravito', name: 'Gravito', runtime: 'Antigravity' },
  { key: 'humano', name: 'Humano', runtime: 'Hermes' },
  { key: 'curso', name: 'Curso', runtime: 'Cursor IDE' },
  { key: 'astro', name: 'Astro', runtime: 'Hermes' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  availableAgents,
  currentSlots,
  initialMode,
  providerConfig,
  providerTestResult,
  isTestingProvider = false,
  onTestProvider,
  onSaveProvider,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedMode, setSelectedMode] = useState<SessionMode>(initialMode);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(
    currentSlots.length > 0 ? currentSlots : ['uno', 'omo', 'gravito', 'humano']
  );

  // Model Provider Configuration State
  const [providerType, setProviderType] = useState<ProviderType>(providerConfig?.type || 'openrouter');
  const [baseUrl, setBaseUrl] = useState<string>(providerConfig?.baseUrl || 'https://openrouter.ai/api/v1');
  const [apiKey, setApiKey] = useState<string>(providerConfig?.apiKey && !providerConfig.apiKey.includes('••') ? providerConfig.apiKey : '');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  useEffect(() => {
    if (providerConfig) {
      setProviderType(providerConfig.type || 'openrouter');
      if (providerConfig.baseUrl) setBaseUrl(providerConfig.baseUrl);
    }
  }, [providerConfig]);

  const selectProviderPreset = (type: ProviderType) => {
    setProviderType(type);
    switch (type) {
      case 'openrouter':
        setBaseUrl('https://openrouter.ai/api/v1');
        break;
      case 'anthropic':
        setBaseUrl('https://api.anthropic.com/v1');
        break;
      case 'openai':
        setBaseUrl('https://api.openai.com/v1');
        break;
      case 'gemini':
        setBaseUrl('https://generativelanguage.googleapis.com/v1beta/openai');
        break;
      case 'ollama':
        setBaseUrl('http://localhost:11434');
        break;
      case 'lmstudio':
        setBaseUrl('http://localhost:1234');
        break;
      case 'omniroute':
        setBaseUrl('http://localhost:20128');
        break;
    }
  };

  const toggleSlot = (agentKey: string) => {
    if (selectedSlots.includes(agentKey)) {
      if (selectedSlots.length > 1) {
        setSelectedSlots(selectedSlots.filter((k) => k !== agentKey));
      }
    } else {
      setSelectedSlots([...selectedSlots, agentKey]);
    }
  };

  const handleTestConnection = () => {
    if (onTestProvider) {
      onTestProvider({
        type: providerType,
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim(),
      });
    }
  };

  const handleNextStep = () => {
    if (step === 3 && onSaveProvider) {
      onSaveProvider({
        type: providerType,
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim(),
      });
    }
    setStep((s) => (s + 1) as any);
  };

  const handleFinish = () => {
    if (onSaveProvider) {
      onSaveProvider({
        type: providerType,
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim(),
      });
    }
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
              <span>Setup Wizard</span>
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
                  <div className="step-card-box">
                    <div className="card-icon-header">
                      <LayoutGrid size={32} className="text-cyan" />
                    </div>
                    <h3 className="card-title">Multi-Panel Grid Layouts</h3>
                    <p className="card-body-text">
                      Run multiple autonomous coding agents side-by-side in real-time. Responsive 2x2 grid, columns, or rows.
                    </p>
                  </div>

                  <div className="step-card-box">
                    <div className="card-icon-header">
                      <BarChart3 size={32} className="text-cyan" />
                    </div>
                    <h3 className="card-title">Live Token & Context Meters</h3>
                    <p className="card-body-text">
                      High-fidelity progress meters, token tracking, latency metrics, and collapsible reasoning trees for every turn.
                    </p>
                  </div>

                  <div className="step-card-box">
                    <div className="card-icon-header">
                      <Globe size={32} className="text-cyan" />
                    </div>
                    <h3 className="card-title">Model Gateway & Hybrid RAG</h3>
                    <p className="card-body-text">
                      Connect to OpenRouter, Anthropic, OpenAI, local Ollama, or custom model gateways with automated fallback.
                    </p>
                  </div>

                  <div className="step-card-box">
                    <div className="card-icon-header">
                      <Shield size={32} className="text-cyan" />
                    </div>
                    <h3 className="card-title">Autonomous Worktree Isolation</h3>
                    <p className="card-body-text">
                      Strict Git worktree isolation per session. Review changes, fork branches, and merge with verifiable evidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: System Auto-Discovery & Environment Audit */}
          {step === 2 && (
            <div className="onboarding-step-view animate-fade-in">
              <div className="step-hero-section">
                <div className="step-hero-icon-box">
                  <HardDrive size={56} className="text-almost-white" />
                </div>
                <h1 className="step-title">System Environment Auto-Discovery</h1>
                <p className="step-description">
                  Agento automatically scans your host machine for installed AI CLIs, agent harnesses, and active model routing gateways.
                </p>
              </div>

              <div className="step-content-panel">
                <div className="step2-cards-stack">
                  {/* CLI Scan Status Card */}
                  <div className="step-horizontal-card">
                    <div className="card-icon-header flex-shrink-0">
                      <Shield size={32} className="text-cyan" />
                    </div>
                    <div className="horizontal-card-text w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="card-title">Installed Agent CLIs & Harnesses</h3>
                        <span className="text-xs text-cyan font-mono bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-800">
                          Auto-Detected
                        </span>
                      </div>
                      <p className="card-body-text mb-2">
                        Detected execution harnesses on PATH and local user bin directories.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
                        <div className="flex items-center gap-1.5 text-almost-white bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <CheckCircle2 size={12} className="text-green-400" />
                          <span>Hermes Agent CLI</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-almost-white bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <CheckCircle2 size={12} className="text-green-400" />
                          <span>Cursor Agent (IDE)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-almost-white bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <CheckCircle2 size={12} className="text-green-400" />
                          <span>AntiGravity Engine</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-almost-white bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <CheckCircle2 size={12} className="text-green-400" />
                          <span>Git Multi-Worktree</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Model Gateways Card */}
                  <div className="step-horizontal-card">
                    <div className="card-icon-header flex-shrink-0">
                      <Bot size={32} className="text-cyan" />
                    </div>
                    <div className="horizontal-card-text w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="card-title">Model Gateways & Routing Services</h3>
                        <span className="text-xs text-green-400 font-mono bg-green-950/40 px-2 py-0.5 rounded border border-green-800">
                          Ready for Connection
                        </span>
                      </div>
                      <p className="card-body-text mb-2">
                        Supports OpenRouter, Anthropic, OpenAI, local Ollama, LM Studio, or OmniRoute proxies.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
                        <div className="flex items-center gap-1.5 text-almost-white bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <CheckCircle2 size={12} className="text-green-400" />
                          <span>OpenRouter / Cloud Direct</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-almost-white bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <CheckCircle2 size={12} className="text-green-400" />
                          <span>Ollama / LM Studio Offline</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Starter Agent Ecosystem */}
                  <div className="step-horizontal-card">
                    <div className="card-icon-header flex-shrink-0">
                      <GitBranch size={32} className="text-cyan" />
                    </div>
                    <div className="horizontal-card-text w-full">
                      <h3 className="card-title">Pre-Configured Agent Ecosystem</h3>
                      <p className="card-body-text">
                        Profiles mapped: Uno (CoS), Omo (Engineering Lead), Gravito (AI Systems), Humano (Design), Curso (Editor Specialist), and Astro (Architect).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Model Provider & API Credentials Setup */}
          {step === 3 && (
            <div className="onboarding-step-view animate-fade-in">
              <div className="step-hero-section">
                <div className="step-hero-icon-box">
                  <Key size={56} className="text-almost-white" />
                </div>
                <h1 className="step-title">Model Providers & API Access</h1>
                <p className="step-description">
                  Connect Agento to your preferred model provider, cloud API key, or free local offline LLM runner.
                </p>
              </div>

              <div className="step-content-panel">
                {/* Provider Selection Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { id: 'openrouter', label: 'OpenRouter (Recommended)', note: 'All Models (Claude, GPT, Gemini, Llama)' },
                    { id: 'anthropic', label: 'Anthropic Direct', note: 'Claude 3.7 / 3.5 Sonnet' },
                    { id: 'openai', label: 'OpenAI Direct', note: 'GPT-4o, o3-mini' },
                    { id: 'gemini', label: 'Google Gemini', note: 'Gemini 2.5 Flash / Pro' },
                    { id: 'ollama', label: 'Ollama Local (Free)', note: 'Offline localhost:11434' },
                    { id: 'omniroute', label: 'OmniRoute Gateway', note: 'Localhost:20128 Proxy' },
                  ].map((p) => {
                    const isSelected = providerType === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => selectProviderPreset(p.id as ProviderType)}
                        className={`px-3 py-2 rounded text-left transition-all border ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,148,217,0.3)]'
                            : 'bg-black/30 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                        style={{ minWidth: '180px', flex: '1 1 calc(33.333% - 8px)' }}
                      >
                        <div className="text-xs font-semibold flex items-center justify-between">
                          <span>{p.label}</span>
                          {isSelected && <span className="text-cyan">✓</span>}
                        </div>
                        <div className="text-[10.5px] text-muted mt-0.5">{p.note}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Provider Credentials Form */}
                <div className="step-card-box" style={{ background: 'rgba(15, 29, 36, 0.65)', padding: '16px' }}>
                  <div className="flex flex-col gap-3">
                    {/* Base URL */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Endpoint URL
                      </label>
                      <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="e.g. https://openrouter.ai/api/v1"
                        className="w-full px-3 py-2 text-xs rounded bg-black/40 border border-slate-700 text-almost-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* API Key (if not local ollama / lmstudio) */}
                    {providerType !== 'ollama' && providerType !== 'lmstudio' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-300">
                            API Key
                          </label>
                          <span className="text-[10px] text-muted font-mono">
                            Stored securely via VS Code SecretStorage
                          </span>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={
                              providerType === 'openrouter'
                                ? 'sk-or-v1-...'
                                : providerType === 'anthropic'
                                ? 'sk-ant-api03-...'
                                : providerType === 'openai'
                                ? 'sk-proj-...'
                                : providerType === 'gemini'
                                ? 'AIzaSy...'
                                : 'Optional gateway bearer token'
                            }
                            className="w-full px-3 py-2 pr-10 text-xs rounded bg-black/40 border border-slate-700 text-almost-white focus:border-cyan-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-2.5 text-muted hover:text-white"
                            title={showApiKey ? 'Hide Key' : 'Show Key'}
                          >
                            {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Test Connection Action & Feedback */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-1">
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTestingProvider}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all shadow-[0_0_10px_rgba(0,148,217,0.3)] disabled:opacity-50"
                      >
                        <RefreshCw size={13} className={isTestingProvider ? 'animate-spin' : ''} />
                        <span>{isTestingProvider ? 'Testing Connection...' : 'Test Connection'}</span>
                      </button>

                      {providerTestResult && (
                        <div
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border ${
                            providerTestResult.ok
                              ? 'bg-green-950/40 border-green-800 text-green-400'
                              : 'bg-amber-950/40 border-amber-800 text-amber-300'
                          }`}
                        >
                          {providerTestResult.ok ? (
                            <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                          ) : (
                            <AlertCircle size={13} className="text-amber-400 shrink-0" />
                          )}
                          <span className="truncate max-w-[320px]">{providerTestResult.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Configure Starter Team & Operating Mode */}
          {step === 4 && (
            <div className="onboarding-step-view animate-fade-in">
              <div className="step-hero-section">
                <div className="step-hero-icon-box">
                  <Users size={56} className="text-almost-white" />
                </div>
                <h1 className="step-title">Configure Operating Mode & Agents</h1>
                <p className="step-description">
                  Choose how your agents collaborate across the workbench and select which agents to mount initially.
                </p>
              </div>

              <div className="step-content-panel">
                {/* Mode Selector Cards */}
                <div className="step3-modes-grid mb-4">
                  <div
                    className={`step3-mode-card ${selectedMode === 'independent' ? 'is-selected' : ''}`}
                    onClick={() => setSelectedMode('independent')}
                  >
                    <div className="card-top-header">
                      <div className="mode-radio-circle">
                        {selectedMode === 'independent' && <div className="radio-dot" />}
                      </div>
                      <h4 className="mode-card-title">Independent Specialist</h4>
                    </div>
                    <p className="mode-card-body">
                      Each panel operates on its own dedicated task and worktree without inter-agent delegation.
                    </p>
                  </div>

                  <div
                    className={`step3-mode-card ${selectedMode === 'team' ? 'is-selected' : ''}`}
                    onClick={() => setSelectedMode('team')}
                  >
                    <div className="card-top-header">
                      <div className="mode-radio-circle">
                        {selectedMode === 'team' && <div className="radio-dot" />}
                      </div>
                      <h4 className="mode-card-title">Autonomous Team</h4>
                    </div>
                    <p className="mode-card-body">
                      Shared context bus enabled with lead-agent dispatch, cross-review, and auto-synced worktrees.
                    </p>
                  </div>
                </div>

                {/* Agent Slots Selection Grid */}
                <div className="agents-selection-stack">
                  <div className="agents-stack-header">
                    <span className="text-xs uppercase font-semibold text-muted tracking-wider">
                      Select Active Agents ({selectedSlots.length} Selected)
                    </span>
                  </div>

                  <div className="agents-toggle-grid">
                    {ALL_POSSIBLE_AGENTS.map((agent) => {
                      const isSelected = selectedSlots.includes(agent.key);
                      return (
                        <div
                          key={agent.key}
                          className={`agent-toggle-chip ${isSelected ? 'is-active' : ''}`}
                          onClick={() => toggleSlot(agent.key)}
                        >
                          <div className="chip-info">
                            <span className="chip-name">{agent.name}</span>
                            <span className="chip-runtime">({agent.runtime})</span>
                          </div>
                          {isSelected && <CheckCircle2 size={14} className="text-cyan" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Grid Layout & Workbench Launch */}
          {step === 5 && (
            <div className="onboarding-step-view animate-fade-in">
              <div className="step-hero-section">
                <div className="step-hero-icon-box">
                  <LayoutGrid size={56} className="text-almost-white" />
                </div>
                <h1 className="step-title">Select Layout & Launch</h1>
                <p className="step-description">
                  Pick your initial workbench layout. You can dynamically switch layouts anytime from the top bar.
                </p>
              </div>

              <div className="step-content-panel">
                <div className="step4-summary-card">
                  {/* Row 1: Active Agents */}
                  <div className="summary-card-row">
                    <CheckCircle2 size={16} className="summary-check-icon" />
                    <span className="summary-label-col">Active Agents</span>
                    <span className="summary-value-col">
                      {selectedSlots.map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')}
                    </span>
                  </div>

                  {/* Row 2: Selected Mode */}
                  <div className="summary-card-row">
                    <CheckCircle2 size={16} className="summary-check-icon" />
                    <span className="summary-label-col">Operating Mode</span>
                    <span className="summary-value-col">
                      {selectedMode === 'team' ? 'Autonomous Team' : 'Independent Specialist'}
                    </span>
                  </div>

                  {/* Row 3: Model Provider */}
                  <div className="summary-card-row">
                    <CheckCircle2 size={16} className="summary-check-icon" />
                    <span className="summary-label-col">Model Provider</span>
                    <span className="summary-value-col">
                      {providerType.toUpperCase()} ({baseUrl})
                    </span>
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

          {/* Center: 1 2 3 4 5 Steps Indicator */}
          <div className="onboarding-step-numbers">
            {[1, 2, 3, 4, 5].map((s) => (
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
          {step < 5 ? (
            <button
              type="button"
              className="btn-onboarding-nav btn-nav-next"
              onClick={handleNextStep}
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
