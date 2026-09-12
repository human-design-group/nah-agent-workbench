import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig, AgentChatMessage } from '../types/workbench.js';
import { PlusCircle, ChevronDown, ChevronRight, Circle, ArrowUp, Activity, Check, Copy, Terminal, Cpu } from 'lucide-react';

interface AgentChatViewProps {
  agent: AgentConfig;
  onSendMessage: (text: string) => void;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Chat Messages Viewport */}
      <div className="chat-viewport">
        {agent.messages.map((msg) => (
          <div key={msg.id} className="message-container">
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
            <button type="button" className="icon-button" title="Add attachment or tool">
              <PlusCircle size={15} color="#94a3b8" />
            </button>

            {/* Permissions Select */}
            <div
              className="control-pill"
              title="Permissions Policy"
              onClick={() => {
                const modes = ['Supervised', 'Auto-Approve', 'Autonomous', 'Sandbox'];
                const nextIdx = (modes.indexOf(agent.permissionsMode) + 1) % modes.length;
                onSelectPermissions(modes[nextIdx]);
              }}
            >
              <span>{agent.permissionsMode || 'Supervised'}</span>
              <ChevronDown size={10} />
            </div>

            {/* Model Selector Pill */}
            <div
              className="control-pill"
              title="Model & Gateway Route"
              onClick={() => {
                const models = [
                  'OmniRoute - Uno Orchestrate',
                  'OmniRoute - Omo Production',
                  'Gemini 2.5 Flash',
                  'Claude 3.7 Sonnet',
                  'DeepSeek-R1 (Bifrost)'
                ];
                const nextIdx = (models.indexOf(agent.selectedModel) + 1) % models.length;
                onSelectModel(models[nextIdx]);
              }}
            >
              <Circle size={9} color="#85BFD1" />
              <span>{agent.selectedModel}</span>
              <ChevronDown size={10} />
            </div>
          </div>

          <div className="composer-controls-right">
            {/* Voice Waveform Indicator */}
            <button
              type="button"
              className={`icon-button ${isRecording ? 'voice-active' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Recording Audio...' : 'Start Voice Input'}
            >
              <Activity size={14} color={isRecording ? '#38bdf8' : '#94a3b8'} />
            </button>

            {/* Submit Arrow */}
            <button type="submit" className="send-circle-btn" title="Send Message (Enter)">
              <ArrowUp size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
