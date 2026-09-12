import React from 'react';
import { AgentConfig } from '../types/workbench.js';
import { AgentHeader } from './AgentHeader.js';
import { AgentChatView } from './AgentChatView.js';

interface AgentCardProps {
  agent: AgentConfig;
  onSendMessage: (text: string) => void;
  onSelectModel: (model: string) => void;
  onSelectPermissions: (mode: string) => void;
  onFork: () => void;
  onNewSession: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onSendMessage,
  onSelectModel,
  onSelectPermissions,
  onFork,
  onNewSession,
}) => {
  return (
    <div className="agent-card">
      <AgentHeader
        agent={agent}
        onFork={onFork}
        onNewSession={onNewSession}
      />
      <AgentChatView
        agent={agent}
        onSendMessage={onSendMessage}
        onSelectModel={onSelectModel}
        onSelectPermissions={onSelectPermissions}
      />
    </div>
  );
};
