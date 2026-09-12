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
  onAttachContext?: (type: 'file' | 'git-diff' | 'terminal') => void;
  onRemoveContext?: (itemId: string) => void;
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
  onAttachContext,
  onRemoveContext,
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
        onAttachContext={onAttachContext}
        onRemoveContext={onRemoveContext}
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
