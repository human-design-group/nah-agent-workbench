import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig, AttachedContextItem } from '../types/workbench';
import { Plus, ChevronDown, ChevronRight, Circle, ArrowUp, Mic, Check, Copy, Terminal, Cpu, X, FileText, GitCommit } from 'lucide-react';
import { AddContextMenu } from './AddContextMenu';
import { useClickOutside } from '../hooks/useClickOutside';

interface AgentChatViewProps {
  agent: AgentConfig;
  onSendMessage: (text: string, attachments?: any[]) => void;
  onSelectModel: (model: string) => void;
  onSelectPermissions: (mode: string) => void;
  onAttachContext?: (type: 'file' | 'git-diff' | 'terminal') => void;
  onRemoveContext?: (itemId: string) => void;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  agent,
  onSendMessage,
  onSelectModel,
  onSelectPermissions,
  onAttachContext,
  onRemoveContext,
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
    if (!inputText.trim() && (!agent.attachedContext || agent.attachedContext.length === 0)) return;
    onSendMessage(inputText || 'Process attached context files and instructions.', agent.attachedContext);
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
    setShowAddContextMenu(false);
    if (type === 'file') {
      if (onAttachContext) onAttachContext('file');
    } else if (type === 'git' || type === 'git-diff') {
      if (onAttachContext) onAttachContext('git-diff');
    } else if (type === 'terminal') {
      if (onAttachContext) onAttachContext('terminal');
    } else if (type === 'skill') {
      setInputText((prev) => prev + (prev ? ' ' : '') + `Use skill /${detail || 'nah-figma'} `);
    } else if (type === 'actions') {
      setInputText((prev) => prev + (prev ? ' ' : '') + '/');
    } else if (type === 'websearch') {
      setInputText((prev) => prev + (prev ? ' ' : '') + '/search: ');
    }
  };

  const MODELS = [
    'curso-production',
    'uno-production',
    'omo-production',
    'humano-assistant',
    'opencode-go/deepseek-v4-pro',
    'bedrock/amazon.nova-pro-v1:0',
    'bedrock/mistral.mistral-large-3-675b-instruct',
    'bedrock/moonshotai.kimi-k2.5',
    'bedrock/qwen.qwen3-coder-next',
  ];

  const PERMS = ['Autonomous', 'Supervised', 'Auto-Approve', 'Sandbox'];

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
              
              {/* Message Footer Meta (tokens, latency, copy) */}
              <div className="bubble-meta">
                {msg.tokens && <span>{msg.tokens} tokens</span>}
                {msg.latencyMs && <span>· {(msg.latencyMs / 1000).toFixed(1)}s</span>}
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(msg.content, msg.id)}
                  title="Copy message"
                >
                  {copiedId === msg.id ? <Check size={11} color="#22c55e" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Block */}
      <form className="agent-composer-container" onSubmit={handleSubmit}>
        {/* Attached Context Chips Bar */}
        {agent.attachedContext && agent.attachedContext.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              padding: '6px 12px',
              borderBottom: '1px solid #1f2023',
              backgroundColor: '#121316',
            }}
          >
            {agent.attachedContext.map((item: AttachedContextItem) => (
              <div
                key={item.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: '#1c1d21',
                  border: '1px solid #27282b',
                  fontSize: 11,
                  color: '#58a6ff',
                }}
              >
                {item.type === 'git-diff' ? <GitCommit size={12} /> : <FileText size={12} />}
                <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </span>
                {onRemoveContext && (
                  <button
                    type="button"
                    onClick={() => onRemoveContext(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b949e',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="composer-input-row">
          <input
            type="text"
            className="composer-textarea"
            placeholder={isRecording ? 'Listening for voice input...' : 'Type your message...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="composer-toolbar">
          <div className="composer-controls-left">
            {/* Add Context button */}
            <div className="relative" ref={addContextMenuRef}>
              <button
                type="button"
                className="btn-add-context-circle"
                onClick={() => setShowAddContextMenu(!showAddContextMenu)}
                title="Add Media and Context (+)"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>

              <AddContextMenu
                isOpen={showAddContextMenu}
                onClose={() => setShowAddContextMenu(false)}
                onSelectContext={handleSelectContext}
              />
            </div>

            {/* Permissions Pill */}
            <div className="dropdown-pill-wrapper" ref={permsMenuRef}>
              <div
                className="control-pill"
                title={`Permissions Mode: ${agent.permissionsMode}`}
                onClick={() => setShowPermsMenu(!showPermsMenu)}
              >
                <span>Permissions</span>
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

            {/* Model Selector Pill */}
            <div className="dropdown-pill-wrapper model-pill-wrapper" ref={modelMenuRef}>
              <div
                className="control-pill model-control-pill"
                title={`Selected Model: ${agent.selectedModel}`}
                onClick={() => setShowModelMenu(!showModelMenu)}
              >
                <Circle size={7} color="#38bdf8" fill="#38bdf8" className="flex-shrink-0" />
                <span className="model-name-text">{agent.selectedModel}</span>
                <ChevronDown size={10} className="text-muted flex-shrink-0" />
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
            {/* Voice Input Button */}
            <button
              type="button"
              className={`icon-button voice-btn ${isRecording ? 'voice-active' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Recording Voice...' : 'Start Voice Input (Mic)'}
            >
              <Mic size={14} color={isRecording ? '#38bdf8' : '#94a3b8'} />
            </button>

            {/* Submit Button */}
            <button type="submit" className="send-circle-btn" title="Send Message (Enter)">
              <ArrowUp size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
