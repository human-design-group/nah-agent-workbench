import React, { useState } from 'react';
import { AgentConfig } from '../types/workbench.js';
import { AgentHeader } from './AgentHeader.js';
import { AgentChatView } from './AgentChatView.js';
import { AgentDrawer } from './AgentDrawer.js';

interface AgentCardProps {
  agent: AgentConfig;
  allAgents: { key: string; name: string; runtime: string }[];
  isFocused?: boolean;
  onFocus?: () => void;
  onSwitchAgent?: (newAgentKey: string) => void;
  onSendMessage: (text: string) => void;
  onSelectModel: (model: string) => void;
  onSelectPermissions: (mode: string) => void;
  onFork: () => void;
  onNewSession: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  allAgents,
  isFocused,
  onFocus,
  onSwitchAgent,
  onSendMessage,
  onSelectModel,
  onSelectPermissions,
  onFork,
  onNewSession,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      className={`agent-card ${isFocused ? 'agent-card-focused' : ''}`}
      onClick={onFocus}
    >
      <AgentHeader
        agent={agent}
        allAgents={allAgents}
        onToggleDrawer={() => setDrawerOpen(true)}
        onSwitchAgent={onSwitchAgent}
        onFork={onFork}
        onNewSession={onNewSession}
      />
      <AgentChatView
        agent={agent}
        onSendMessage={onSendMessage}
        onSelectModel={onSelectModel}
        onSelectPermissions={onSelectPermissions}
      />
      <AgentDrawer
        agent={agent}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectSession={(sessionId) => {
          console.log('Selected session:', sessionId);
          setDrawerOpen(false);
        }}
        onOpenNativeApp={() => {
          console.log('Opening native app for', agent.name);
          setDrawerOpen(false);
        }}
      />
    </div>
  );
};
