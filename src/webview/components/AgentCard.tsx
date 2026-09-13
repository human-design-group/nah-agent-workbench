import React, { useState } from 'react';
import { AgentConfig } from '../types/workbench';
import { AgentHeader } from './AgentHeader';
import { AgentChatView } from './AgentChatView';
import { AgentDrawer } from './AgentDrawer';

interface AgentCardProps {
  agent: AgentConfig;
  allAgents: { key: string; name: string; runtime: string }[];
  isFocused?: boolean;
  onFocus?: () => void;
  onSwitchAgent?: (newAgentKey: string) => void;
  onSendMessage: (text: string, attachments?: any[]) => void;
  onSelectModel: (model: string) => void;
  onSelectPermissions: (mode: string) => void;
  onFork: () => void;
  onNewSession: () => void;
  onFindInSession?: (agentId: string) => void;
  onExportSession?: (agentId: string) => void;
  onDuplicateSession?: (agentId: string) => void;
  onClearSession?: (agentId: string) => void;
  onClosePanel?: (agentId: string) => void;
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
  onFindInSession,
  onExportSession,
  onDuplicateSession,
  onClearSession,
  onClosePanel,
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
        onFindInSession={onFindInSession}
        onExportSession={onExportSession}
        onDuplicateSession={onDuplicateSession}
        onClearSession={onClearSession}
        onClosePanel={onClosePanel}
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
