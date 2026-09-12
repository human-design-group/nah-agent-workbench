import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig } from '../types/workbench';
import { PlusCircle, ChevronDown, ChevronRight, Circle, ArrowUp, Mic, Check, Copy, Terminal, Cpu } from 'lucide-react';
import { AddContextMenu } from './AddContextMenu';

interface AgentChatViewProps {
  agent: AgentConfig;
  onSendMessage: (text: string, attachments?: any[]) => void;
  onSelectModel: (model: string) => void;
  onSelectPermissions: (mode: string) => void;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  agent,
  onSendMessage,
  onSelectModel,
  onSelectPermissions,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCot, setExpandedCot] = useState<Record<string, boolean>>({});
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showPermsMenu, setShowPermsMenu] = useState(false);
  const [showAddContextMenu, setShowAddContextMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    'OmniRoute - Uno Orchestrate',
    'OmniRoute - Omo Production',
    'Gemini 2.5 Flash',
    'Claude 3.7 Sonnet',
    'DeepSeek-R1 (Bifrost)'
  ];

  const PERMS = ['Supervised', 'Auto-Approve', 'Autonomous', 'Sandbox'];

  // Shorten model label for display if too long
  const shortModel = agent.selectedModel.length > 18
    ? agent.selectedModel.replace('OmniRoute - ', '').slice(0, 16) + '...'
    : agent.selectedModel;

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
            <div className="relative">
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowAddContextMenu(!showAddContextMenu)}
                title="Add Media and Context (+)"
              >
                <PlusCircle size={15} color="#38bdf8" />
              </button>

              <AddContextMenu
                isOpen={showAddContextMenu}
                onClose={() => setShowAddContextMenu(false)}
                onSelectContext={handleSelectContext}
              />
            </div>

            {/* Permissions Pill */}
            <div className="dropdown-pill-wrapper">
              <div
                className="control-pill"
                title={`Permissions Mode: ${agent.permissionsMode}`}
                onClick={() => setShowPermsMenu(!showPermsMenu)}
              >
                <span>Permissions</span>
                <ChevronDown size={10} />
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
            <div className="dropdown-pill-wrapper">
              <div
                className="control-pill"
                title={`Full Model: ${agent.selectedModel}`}
                onClick={() => setShowModelMenu(!showModelMenu)}
              >
                <Circle size={8} color="#38bdf8" />
                <span>{shortModel}</span>
                <ChevronDown size={10} />
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
            {/* Voice Input Button with Microphone Icon */}
            <button
              type="button"
              className={`icon-button voice-btn ${isRecording ? 'voice-active' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Recording Voice...' : 'Start Voice Input (Mic)'}
            >
              <Mic size={14} color={isRecording ? '#38bdf8' : '#94a3b8'} />
            </button>

            {/* Submit Arrow (Cyan Theme Primary) */}
            <button type="submit" className="send-circle-btn" title="Send Message (Enter)">
              <ArrowUp size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
