import React, { useState } from 'react';
import { AgentConfig } from '../types/workbench';
import { AgentHeader } from './AgentHeader';
import { AgentChatView } from './AgentChatView';
import { AgentDrawer } from './AgentDrawer';

interface AgentCardProps {
  agent: AgentConfig;
  allAgents: { key: string; name: string; runtime: string }[];
  availableModels?: string[];
  slotIndex?: number;
  totalSlots?: number;
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
  onDragStart?: (slotIndex: number) => void;
  onDragEnd?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  allAgents,
  availableModels,
  slotIndex,
  totalSlots,
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
  onDragStart,
  onDragEnd,
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
        slotIndex={slotIndex}
        totalSlots={totalSlots}
        onToggleDrawer={() => setDrawerOpen(true)}
        onSwitchAgent={onSwitchAgent}
        onFork={onFork}
        onNewSession={onNewSession}
        onFindInSession={onFindInSession}
        onExportSession={onExportSession}
        onDuplicateSession={onDuplicateSession}
        onClearSession={onClearSession}
        onClosePanel={onClosePanel}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
      <AgentChatView
        agent={agent}
        availableModels={availableModels}
        onSendMessage={onSendMessage}
        onSelectModel={onSelectModel}
        onSelectPermissions={onSelectPermissions}
        onFork={onFork}
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
