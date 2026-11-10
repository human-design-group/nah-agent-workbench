import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig } from '../types/workbench';
import {
  IconAddCircle,
  IconArrowDownS2,
  IconVoiceprint,
  IconSendPlane,
  IconFolder,
  IconGitBranch,
  IconFileCopy,
  IconFileCopy1,
  IconArrowGoBack,
  IconDeleteBin6,
  IconShareForward2,
} from './FigmaIcons';
import { AddContextMenu } from './AddContextMenu';
import { useClickOutside } from '../hooks/useClickOutside';

interface AgentChatViewProps {
  agent: AgentConfig;
  availableModels?: string[];
  onSendMessage: (text: string, attachments?: any[]) => void;
  onSelectModel: (model: string) => void;
  onSelectPermissions: (mode: string) => void;
  onFork?: () => void;
  gitStatus?: {
    branch?: string;
    worktree?: string;
    project?: string;
    additions?: number;
    deletions?: number;
    isClean?: boolean;
  };
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  agent,
  availableModels,
  onSendMessage,
  onSelectModel,
  onSelectPermissions,
  onFork,
  gitStatus,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCot, setExpandedCot] = useState<Record<string, boolean>>({});
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showPermsMenu, setShowPermsMenu] = useState(false);
  const [showAddContextMenu, setShowAddContextMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addContextMenuRef = useRef<HTMLDivElement>(null);
  const permsMenuRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(addContextMenuRef, () => setShowAddContextMenu(false), showAddContextMenu);
  useClickOutside(permsMenuRef, () => setShowPermsMenu(false), showPermsMenu);
  useClickOutside(modelMenuRef, () => setShowModelMenu(false), showModelMenu);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [agent.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCot = (id: string) => {
    setExpandedCot((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectContext = (type: string, detail?: string) => {
    if (type === 'media') {
      setInputText((prev) => prev + (prev ? ' ' : '') + '[Media Attachment: image.png]');
    } else if (type === 'file') {
      setInputText((prev) => prev + (prev ? ' ' : '') + '@file:');
    } else if (type === 'skill') {
      setInputText((prev) => prev + (prev ? ' ' : '') + `Use skill /${detail || 'nah-figma'} `);
    } else if (type === 'connector') {
      setInputText((prev) => prev + (prev ? ' ' : '') + `Query connector: ${detail} `);
    } else if (type === 'actions') {
      setInputText((prev) => prev + (prev ? ' ' : '') + '/');
    } else if (type === 'websearch') {
      setInputText((prev) => prev + (prev ? ' ' : '') + '/search: ');
    }
  };

  const effectiveModels = availableModels && availableModels.length > 0 ? availableModels : [
    'astro-primary',
    'curso-operations',
    'curso-testing',
    'nah-system-one-combo',
    'nah-general-combo',
    'nah-coding-combo',
    'nah-reasoning-combo',
    'nah-cron-combo',
    'nah-vision-combo',
    'nah-cron-system-one',
    'nah-services-combo',
    'nah-cron-light',
    'nah-cron-medium',
    'nah-memory-combo',
    'nah-open-design-combo',
    'nah-graphify-combo',
    'nah-instructo-combo',
    'nah-reports-combo',
    'static-best-coding',
    'static-best-reasoning',
    'nvidia/nvidia/nemotron-3.5-super-vl-120b-a12b',
    'cloudflare-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  ];

  const combosList = effectiveModels.filter(
    (m) => m.includes('combo') || m.includes('primary') || m.includes('static') || m.startsWith('curso-')
  );
  const providersList = effectiveModels.filter(
    (m) => !(m.includes('combo') || m.includes('primary') || m.includes('static') || m.startsWith('curso-'))
  );

  const PERMS = ['Autonomous', 'Supervised', 'Auto-Approve', 'Default', 'Sandbox'];

  // Calculate live context token threshold & usage ratio
  const sessionTokens = (agent.messages || []).reduce((acc, m) => acc + (m.tokens || 0), 0);
  const displayTokens = sessionTokens > 0 ? sessionTokens : 1280;
  const getContextThreshold = (mName?: string): number => {
    if (!mName) return 128000;
    const lower = mName.toLowerCase();
    if (lower.includes('2.5') || lower.includes('gemini')) return 1000000;
    if (lower.includes('claude') || lower.includes('sonnet') || lower.includes('opus')) return 200000;
    if (lower.includes('system-one')) return 32000;
    if (lower.includes('deepseek') || lower.includes('nemotron') || lower.includes('llama')) return 128000;
    return 128000;
  };
  const contextThreshold = getContextThreshold(agent.selectedModel);
  const usageRatio = Math.min(100, Math.max(4, Math.round((displayTokens / contextThreshold) * 100)));

  return (
    <div className="agent-chat-view-root" data-name="chat-container">
      {/* Chat Messages Viewport */}
      <div className="chat-viewport">
        {agent.messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-container ${msg.sender === 'user' ? 'message-align-right' : 'message-align-left'}`}
          >
            {/* Thinking / Chain of Thought Block */}
            {msg.thinking && (
              <div className="cot-block">
                <button
                  type="button"
                  className="cot-header"
                  onClick={() => toggleCot(msg.id)}
                >
                  <span>Thinking Process</span>
                  <span>{expandedCot[msg.id] ? '▾' : '▸'}</span>
                </button>
                {expandedCot[msg.id] && (
                  <div className="cot-content">
                    <pre>{msg.thinking}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Tool Calls */}
            {msg.toolCalls && msg.toolCalls.length > 0 && (
              <div className="tool-calls-container">
                {msg.toolCalls.map((tc, idx) => (
                  <div key={idx} className={`tool-badge tool-badge-${tc.status}`}>
                    <span className="tool-name">{tc.name}</span>
                    <span className="tool-summary">{tc.summary}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Main Message Bubble */}
            <div
              className={msg.sender === 'user' ? 'bubble-user' : 'bubble-agent'}
              data-name={msg.sender === 'user' ? 'ai-chat-to-user-message' : 'ai-chat-to-chat-response'}
            >
              <div className="bubble-text">{msg.content}</div>

              {/* Message Footer Meta (tokens, latency, icons) */}
              <div className="bubble-meta" data-name="message-stats">
                {msg.sender === 'user' && (
                  <button
                    type="button"
                    className="meta-action-btn"
                    title="Delete message"
                    data-name="delete-bin-6"
                  >
                    <IconDeleteBin6 size={11} color="#939698" />
                  </button>
                )}

                <span className="bubble-tokens">
                  {msg.tokens ? `${msg.tokens.toLocaleString()} tokens` : '12,545 tokens'}
                </span>
                <span className="bubble-latency">
                  {msg.latencyMs ? `${(msg.latencyMs / 1000).toFixed(1)}s` : '0.5s'}
                </span>

                <button
                  type="button"
                  className="meta-action-btn"
                  onClick={() => handleCopy(msg.content, msg.id)}
                  title="Copy message"
                  data-name="file-copy"
                >
                  <IconFileCopy size={11} color={copiedId === msg.id ? '#2ead25' : '#939698'} />
                </button>

                {msg.sender === 'user' ? (
                  <button
                    type="button"
                    className="meta-action-btn"
                    title="Retry / Go Back"
                    data-name="arrow-go-back"
                  >
                    <IconArrowGoBack size={11} color="#939698" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="meta-action-btn"
                    title="Share / External"
                    data-name="share-forward-2"
                  >
                    <IconShareForward2 size={11} color="#939698" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Block (Figma 2082:9000 & 2082:9002) */}
      <form className="agent-composer-container" onSubmit={handleSubmit} data-name="message-input-block">
        {/* Project & Git & Worktree Flat Sub-bar (Figma project-and-git-and-worktree-info) */}
        <div className="project-and-git-and-worktree-info" data-name="project-and-git-and-worktree-info">
          <div className="composer-git-left" data-name="project-folder-label-and-icon">
            <IconFolder size={12} color="#939698" className="composer-folder-icon" />
            <span className="composer-git-path-text">
              {agent.gitStatus
                ? `${agent.gitStatus.workspace} / ${agent.gitStatus.worktree}`
                : 'notahuman / agent-name / worktree-name / branch-name'}
            </span>
          </div>

          <div className="composer-git-right">
            <div className="composer-git-stats" data-name="git-stats">
              <span className="stat-mod">*{agent.gitStatus?.modified ?? 14}</span>
              <span className="stat-add">+{agent.gitStatus?.staged ?? 28}</span>
              <span className="stat-untrack">!{agent.gitStatus?.untracked ?? 253}</span>
              <span className="stat-div">?{agent.gitStatus?.divergence ?? 3318}</span>
            </div>

            <button
              type="button"
              className="composer-fork-btn"
              onClick={onFork}
              title="Fork Session / Branch Worktree"
              data-name="git-branch"
            >
              <IconGitBranch size={12} color="#0094D9" />
              <span>Fork</span>
            </button>
          </div>
        </div>

        {/* Input Row (Figma message-input-field) */}
        <div className="composer-input-row" data-name="message-input-field">
          <textarea
            rows={2}
            className="composer-textarea"
            placeholder={isRecording ? 'Listening for voice input...' : 'Type your message'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Controls Toolbar (Figma chat-actions) */}
        <div className="composer-toolbar" data-name="chat-actions">
          <div className="composer-controls-left" data-name="model-permissions-select">
            {/* Cyan Circular Add Context Button */}
            <div className="relative" ref={addContextMenuRef} style={{ border: 'none', outline: 'none' }}>
              <button
                type="button"
                className="btn-add-context-circle"
                onClick={() => setShowAddContextMenu(!showAddContextMenu)}
                title="Add Context (+)"
                data-name="add-circle"
              >
                <IconAddCircle size={24} color="#0094D9" />
              </button>

              <AddContextMenu
                isOpen={showAddContextMenu}
                onClose={() => setShowAddContextMenu(false)}
                onSelectContext={handleSelectContext}
              />
            </div>

            {/* Permissions / Mode Selector Pill with solid indicator underline */}
            {(() => {
              const activePerm = agent.permissionsMode && agent.permissionsMode !== 'Selector Label'
                ? agent.permissionsMode
                : 'Autonomous';
              return (
                <div className="dropdown-pill-wrapper" ref={permsMenuRef} data-name="dropdown-select">
                  <div
                    className="control-pill"
                    title={`Permissions Mode: ${activePerm}`}
                    onClick={() => setShowPermsMenu(!showPermsMenu)}
                    data-name="label-and-permission-indicator"
                  >
                    <span className="pill-text-label">{activePerm}</span>
                    <IconArrowDownS2 size={20} color="#0094D9" />
                    <div className="permissions-solid-indicator" data-name="permissions-indicator" />
                  </div>

                  {showPermsMenu && (
                    <div className="pill-dropdown-menu">
                      {PERMS.map((p) => (
                        <div
                          key={p}
                          className={`pill-menu-item ${p === activePerm ? 'selected' : ''}`}
                          onClick={() => {
                            onSelectPermissions(p);
                            setShowPermsMenu(false);
                          }}
                        >
                          <span>{p}</span>
                          {p === activePerm && <span className="text-cyan ml-1">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Model Selector Pill with live context / token usage meter underline */}
            <div
              className="dropdown-pill-wrapper model-pill-wrapper"
              ref={modelMenuRef}
              data-name="dropdown-select-with-progress"
            >
              <div
                className="control-pill model-control-pill with-rainbow"
                title={`Selected Model: ${agent.selectedModel} • Live Context: ${displayTokens.toLocaleString()} / ${contextThreshold.toLocaleString()} tokens (${usageRatio}% used)`}
                onClick={() => setShowModelMenu(!showModelMenu)}
                data-name="model-and-context-meter"
              >
                <span className="model-name-text">{agent.selectedModel || 'astro-primary'}</span>
                <IconArrowDownS2 size={20} color="#0094D9" />
                {/* Live Context/Token Usage Meter Underline */}
                <div
                  className="model-context-meter-track"
                  title={`Live Context: ${displayTokens.toLocaleString()} / ${contextThreshold.toLocaleString()} tokens (${usageRatio}% used)`}
                  data-name="context-meter"
                >
                  <div className="model-rainbow-bar" style={{ width: `${usageRatio}%` }} />
                </div>
              </div>

              {showModelMenu && (
                <div className="pill-dropdown-menu model-dropdown">
                  <div className="dropdown-heading">OmniRoute Combos</div>
                  {combosList.map((m) => (
                    <div
                      key={m}
                      className={`pill-menu-item ${m === agent.selectedModel ? 'selected' : ''}`}
                      onClick={() => {
                        onSelectModel(m);
                        setShowModelMenu(false);
                      }}
                    >
                      <span>{m}</span>
                      {m === agent.selectedModel && <span className="text-cyan ml-1">✓</span>}
                    </div>
                  ))}
                  {providersList.length > 0 && (
                    <>
                      <div className="dropdown-heading" style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '6px' }}>
                        Direct Provider Models
                      </div>
                      {providersList.map((m) => (
                        <div
                          key={m}
                          className={`pill-menu-item ${m === agent.selectedModel ? 'selected' : ''}`}
                          onClick={() => {
                            onSelectModel(m);
                            setShowModelMenu(false);
                          }}
                        >
                          <span>{m}</span>
                          {m === agent.selectedModel && <span className="text-cyan ml-1">✓</span>}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="composer-controls-right" data-name="voice-and-send-actions">
            {/* Waveform Audio Voice Button */}
            <button
              type="button"
              className={`icon-button voice-btn ${isRecording ? 'voice-active' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Recording Voice...' : 'Voice Input (Waveform)'}
              data-name="voiceprint"
            >
              <IconVoiceprint size={24} color={isRecording ? '#00f0ff' : '#0094D9'} />
            </button>

            {/* Submit Paper Plane Line Icon Button */}
            <button
              type="submit"
              className="send-circle-btn"
              title="Send Message (Enter)"
              data-name="send-plane-button"
            >
              <IconSendPlane size={22} color="#0094D9" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
