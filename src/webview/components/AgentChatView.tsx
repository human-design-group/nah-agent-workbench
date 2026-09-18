import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig } from '../types/workbench';
import { Plus, ChevronDown, ChevronRight, Circle, ArrowUp, Mic, Check, Copy, Terminal, Cpu, Folder, GitFork, AudioLines, RotateCcw, PlusCircle } from 'lucide-react';
import { AddContextMenu } from './AddContextMenu';
import { useClickOutside } from '../hooks/useClickOutside';

interface AgentChatViewProps {
  agent: AgentConfig;
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const MODELS = [
    'OmniRoute - Humano Assistant',
    'OmniRoute - Uno Orchestrate',
    'OmniRoute - Omo Production',
    'Gemini 2.5 Flash',
    'Claude 3.7 Sonnet',
    'DeepSeek-R1 (Bifrost)'
  ];

  const PERMS = ['Selector Label', 'Supervised', 'Auto-Approve', 'Autonomous', 'Sandbox'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
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
                  <Cpu size={12} className="cot-icon" />
                  <span>Thinking Process</span>
                  {expandedCot[msg.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
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
                    <Terminal size={11} />
                    <span className="tool-name">{tc.name}</span>
                    <span className="tool-summary">{tc.summary}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Main Message Bubble */}
            <div className={msg.sender === 'user' ? 'bubble-user' : 'bubble-agent'}>
              <div className="bubble-text">{msg.content}</div>
              
              {/* Message Footer Meta (tokens, latency, copy, retry) */}
              <div className="bubble-meta">
                <span className="bubble-tokens">{msg.tokens ? `${msg.tokens.toLocaleString()} tokens` : '12,345 tokens'}</span>
                <span className="bubble-latency">{msg.latencyMs ? `${(msg.latencyMs / 1000).toFixed(1)}s` : '0.5s'}</span>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => handleCopy(msg.content, msg.id)}
                  title="Copy message"
                >
                  {copiedId === msg.id ? <Check size={10} color="#22c55e" /> : <Copy size={10} />}
                </button>
                <button
                  type="button"
                  className="retry-btn"
                  title="Regenerate / Retry"
                >
                  <RotateCcw size={10} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Block (Figma 2101:12865) */}
      <form className="agent-composer-container" onSubmit={handleSubmit}>
        {/* Project & Git & Worktree Flat Sub-bar (Figma 2101:12950) */}
        <div className="project-and-git-and-worktree-info">
          <div className="composer-git-left">
            <Folder size={11} className="composer-folder-icon" />
            <span className="composer-git-path-text">
              {agent.gitStatus ? `${agent.gitStatus.workspace} / ${agent.gitStatus.worktree}` : 'notahuman / agent-name / worktree-name / branch-name'}
            </span>
          </div>

          <div className="composer-git-right">
            <div className="composer-git-stats">
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
            >
              <GitFork size={10} className="fork-icon-cyan" />
              <span>Fork</span>
            </button>
          </div>
        </div>

        {/* Input Row (Figma 2101:12952) */}
        <div className="composer-input-row">
          <input
            type="text"
            className="composer-textarea"
            placeholder={isRecording ? 'Listening for voice input...' : 'Type your message'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Controls Toolbar (Figma 2101:12953) */}
        <div className="composer-toolbar">
          <div className="composer-controls-left">
            {/* Cyan Circular Add Context Button */}
            <div className="relative" ref={addContextMenuRef}>
              <button
                type="button"
                className="btn-add-context-circle"
                onClick={() => setShowAddContextMenu(!showAddContextMenu)}
                title="Add Media and Context (⊕)"
              >
                <PlusCircle size={15} className="text-cyan" />
              </button>

              <AddContextMenu
                isOpen={showAddContextMenu}
                onClose={() => setShowAddContextMenu(false)}
                onSelectContext={handleSelectContext}
              />
            </div>

            {/* Selector Label Pill */}
            <div className="dropdown-pill-wrapper" ref={permsMenuRef}>
              <div
                className="control-pill"
                title={`Permissions Mode: ${agent.permissionsMode}`}
                onClick={() => setShowPermsMenu(!showPermsMenu)}
              >
                <span>Selector Label</span>
                <ChevronDown size={10} className="text-muted" />
              </div>
              {showPermsMenu && (
                <div className="pill-dropdown-menu">
                  {PERMS.map((p) => (
                    <div
                      key={p}
                      className={`pill-menu-item ${p === agent.permissionsMode ? 'selected' : ''}`}
                      onClick={() => {
                        onSelectPermissions(p);
                        setShowPermsMenu(false);
                      }}
                    >
                      <span>{p}</span>
                      {p === agent.permissionsMode && <Check size={11} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Model Selector Pill with Rainbow Gradient Underline */}
            <div className="dropdown-pill-wrapper model-pill-wrapper" ref={modelMenuRef}>
              <div
                className="control-pill model-control-pill with-rainbow"
                title={`Full Model: ${agent.selectedModel}`}
                onClick={() => setShowModelMenu(!showModelMenu)}
              >
                <span className="model-name-text">{agent.selectedModel}</span>
                <ChevronDown size={10} className="text-muted flex-shrink-0" />
                <div className="model-rainbow-bar" />
              </div>
              {showModelMenu && (
                <div className="pill-dropdown-menu model-dropdown">
                  <div className="dropdown-heading">Select Model / Route</div>
                  {MODELS.map((m) => (
                    <div
                      key={m}
                      className={`pill-menu-item ${m === agent.selectedModel ? 'selected' : ''}`}
                      onClick={() => {
                        onSelectModel(m);
                        setShowModelMenu(false);
                      }}
                    >
                      <span>{m}</span>
                      {m === agent.selectedModel && <Check size={11} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="composer-controls-right">
            {/* Waveform Audio Voice Button */}
            <button
              type="button"
              className={`icon-button voice-btn ${isRecording ? 'voice-active' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Recording Voice...' : 'Voice Input (Waveform)'}
            >
              <AudioLines size={15} color={isRecording ? '#00f0ff' : '#0094d9'} />
            </button>

            {/* Submit Arrow Circle (Cyan Theme Primary) */}
            <button type="submit" className="send-circle-btn" title="Send Message (Enter)">
              <ArrowUp size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
