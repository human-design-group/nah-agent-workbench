import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig } from '../types/workbench.js';
import { PlusCircle, ChevronDown, Circle, ArrowUp, Activity } from 'lucide-react';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Chat Messages */}
      <div className="chat-viewport">
        {agent.messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === 'user' ? 'bubble-user' : 'bubble-agent'}
          >
            {msg.content}
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
            placeholder="Type your message"
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
                const nextMode = agent.permissionsMode === 'Auto-Approve' ? 'Permissions Select' : 'Auto-Approve';
                onSelectPermissions(nextMode);
              }}
            >
              <span>{agent.permissionsMode}</span>
              <ChevronDown size={10} />
            </div>

            {/* Model Selector Pill */}
            <div
              className="control-pill"
              title="Model & Gateway Route"
              onClick={() => {
                const models = ['OmniRoute - Uno Orchestrate', 'OmniRoute - Omo Production', 'Gemini 3.8 Flash', 'Claude 3.7 Sonnet'];
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
            <button type="button" className="icon-button" title="Voice / Audio Transcription">
              <Activity size={14} color="#94a3b8" />
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
