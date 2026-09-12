import React, { useState } from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { AgentConfig, LayoutMode } from '../types/workbench';
import { AgentCard } from './AgentCard';
import { ResizeHandle } from './ResizeHandle';

interface GridContainerProps {
  layoutMode: LayoutMode;
  agents: AgentConfig[];
  slotKeys: string[];
  onSwitchSlot: (slotIndex: number, newAgentKey: string) => void;
  onSendMessage: (agentId: string, text: string, attachments?: any[]) => void;
  onSelectModel: (agentId: string, model: string) => void;
  onSelectPermissions: (agentId: string, mode: string) => void;
  onForkSession: (agentId: string) => void;
  onNewSession: (agentId: string) => void;
  onFindInSession?: (agentId: string) => void;
  onExportSession?: (agentId: string) => void;
  onDuplicateSession?: (agentId: string) => void;
  onClearSession?: (agentId: string) => void;
  onClosePanel?: (agentId: string) => void;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  layoutMode,
  agents,
  slotKeys,
  onSwitchSlot,
  onSendMessage,
  onSelectModel,
  onSelectPermissions,
  onForkSession,
  onNewSession,
  onFindInSession,
  onExportSession,
  onDuplicateSession,
  onClearSession,
  onClosePanel,
}) => {
  const [focusedSlot, setFocusedSlot] = useState<number>(0);
  const allAgentsList = agents.map((a) => ({ key: a.key, name: a.name, runtime: a.runtime }));

  const getAgentForSlot = (slotIdx: number): AgentConfig => {
    const key = slotKeys[slotIdx] || agents[slotIdx % agents.length]?.key || 'humano';
    return agents.find((a) => a.key === key) || agents[0];
  };

  const renderCard = (slotIdx: number) => {
    const agent = getAgentForSlot(slotIdx);
    return (
      <AgentCard
        agent={agent}
        allAgents={allAgentsList}
        isFocused={focusedSlot === slotIdx}
        onFocus={() => setFocusedSlot(slotIdx)}
        onSwitchAgent={(newKey) => onSwitchSlot(slotIdx, newKey)}
        onSendMessage={(text, attachments) => onSendMessage(agent.id, text, attachments)}
        onSelectModel={(model) => onSelectModel(agent.id, model)}
        onSelectPermissions={(mode) => onSelectPermissions(agent.id, mode)}
        onFork={() => onForkSession(agent.id)}
        onNewSession={() => onNewSession(agent.id)}
        onFindInSession={onFindInSession}
        onExportSession={onExportSession}
        onDuplicateSession={onDuplicateSession}
        onClearSession={onClearSession}
        onClosePanel={onClosePanel}
      />
    );
  };

  // 1. Single Agent Focus Mode (1x1)
  if (layoutMode === 'focus') {
    return (
      <div className="grid-stage">
        {renderCard(focusedSlot)}
      </div>
    );
  }

  // 2. Horizontal Stack Mode (4x1 panels stacked on top of one another)
  if (layoutMode === 'horizontal') {
    return (
      <div className="grid-stage">
        <PanelGroup direction="vertical">
          <Panel defaultSize={25} minSize={15}>
            {renderCard(0)}
          </Panel>
          <ResizeHandle direction="horizontal" />

          <Panel defaultSize={25} minSize={15}>
            {renderCard(1)}
          </Panel>
          <ResizeHandle direction="horizontal" />

          <Panel defaultSize={25} minSize={15}>
            {renderCard(2)}
          </Panel>
          <ResizeHandle direction="horizontal" />

          <Panel defaultSize={25} minSize={15}>
            {renderCard(3)}
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // 3. 3-Column Split Mode (1x3)
  if (layoutMode === 'split-3') {
    return (
      <div className="grid-stage">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={33.33} minSize={20}>
            {renderCard(0)}
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={33.33} minSize={20}>
            {renderCard(1)}
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={33.33} minSize={20}>
            {renderCard(2)}
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // 4. Vertical 1x4 Layout (Frame 2011:2051 in Figma)
  if (layoutMode === 'vertical') {
    return (
      <div className="grid-stage">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={25} minSize={15}>
            {renderCard(0)}
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            {renderCard(1)}
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            {renderCard(2)}
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            {renderCard(3)}
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // 5. 2x2 Grid Layout (Frame 2001:213 in Figma)
  return (
    <div className="grid-stage">
      <PanelGroup direction="vertical">
        {/* Top Row: Panel 0 + Panel 1 */}
        <Panel defaultSize={50} minSize={25}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={20}>
              {renderCard(0)}
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={20}>
              {renderCard(1)}
            </Panel>
          </PanelGroup>
        </Panel>

        <ResizeHandle direction="horizontal" />

        {/* Bottom Row: Panel 2 + Panel 3 */}
        <Panel defaultSize={50} minSize={25}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={20}>
              {renderCard(2)}
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={20}>
              {renderCard(3)}
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};
