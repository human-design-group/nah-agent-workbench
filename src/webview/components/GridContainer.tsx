import React, { useState } from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { AgentConfig, LayoutMode } from '../types/workbench';
import { AgentCard } from './AgentCard';
import { ResizeHandle } from './ResizeHandle';
import { Plus } from 'lucide-react';

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
  onAddAgentClick?: () => void;
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
  onAddAgentClick,
}) => {
  const [focusedSlot, setFocusedSlot] = useState<number>(0);
  const allAgentsList = agents.map((a) => ({ key: a.key, name: a.name, runtime: a.runtime }));

  const getAgentForSlot = (slotIdx: number): AgentConfig => {
    const key = slotKeys[slotIdx];
    return agents.find((a) => a.key === key) || agents.find((a) => a.id === key) || agents[0];
  };

  const renderCard = (slotIdx: number) => {
    const agent = getAgentForSlot(slotIdx);
    if (!agent) return null;

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

  // Empty state if all slots closed
  if (!slotKeys || slotKeys.length === 0) {
    return (
      <div className="grid-stage empty-stage">
        <div className="empty-state-card">
          <h3>No Active Agent Panels</h3>
          <p>Add an agent to start collaborating across the workbench.</p>
          <button className="btn-go" onClick={onAddAgentClick}>
            <Plus size={14} />
            <span>Add Agent</span>
          </button>
        </div>
      </div>
    );
  }

  // 1. Single Agent Focus Mode (1x1)
  if (layoutMode === 'focus') {
    const safeSlot = focusedSlot < slotKeys.length ? focusedSlot : 0;
    return (
      <div className="grid-stage">
        {renderCard(safeSlot)}
      </div>
    );
  }

  // 2. Horizontal Stack Mode (Stacked vertical rows)
  if (layoutMode === 'horizontal') {
    const count = slotKeys.length;
    const defaultSize = 100 / count;
    return (
      <div className="grid-stage">
        <PanelGroup direction="vertical">
          {slotKeys.map((key, idx) => (
            <React.Fragment key={`horiz-${key}-${idx}`}>
              <Panel defaultSize={defaultSize} minSize={15}>
                {renderCard(idx)}
              </Panel>
              {idx < count - 1 && <ResizeHandle direction="horizontal" />}
            </React.Fragment>
          ))}
        </PanelGroup>
      </div>
    );
  }

  // 3. 3-Column Split Mode (Up to 3 columns)
  if (layoutMode === 'split-3') {
    const visibleSlots = slotKeys.slice(0, 3);
    const count = visibleSlots.length;
    const defaultSize = 100 / count;
    return (
      <div className="grid-stage">
        <PanelGroup direction="horizontal">
          {visibleSlots.map((key, idx) => (
            <React.Fragment key={`split3-${key}-${idx}`}>
              <Panel defaultSize={defaultSize} minSize={20}>
                {renderCard(idx)}
              </Panel>
              {idx < count - 1 && <ResizeHandle direction="vertical" />}
            </React.Fragment>
          ))}
        </PanelGroup>
      </div>
    );
  }

  // 4. Vertical Mode (Columns side by side)
  if (layoutMode === 'vertical') {
    const count = slotKeys.length;
    const defaultSize = 100 / count;
    return (
      <div className="grid-stage">
        <PanelGroup direction="horizontal">
          {slotKeys.map((key, idx) => (
            <React.Fragment key={`vert-${key}-${idx}`}>
              <Panel defaultSize={defaultSize} minSize={15}>
                {renderCard(idx)}
              </Panel>
              {idx < count - 1 && <ResizeHandle direction="vertical" />}
            </React.Fragment>
          ))}
        </PanelGroup>
      </div>
    );
  }

  // 5. 2x2 Grid Layout
  const count = slotKeys.length;
  if (count <= 2) {
    const defaultSize = 100 / count;
    return (
      <div className="grid-stage">
        <PanelGroup direction="horizontal">
          {slotKeys.map((key, idx) => (
            <React.Fragment key={`grid-${key}-${idx}`}>
              <Panel defaultSize={defaultSize} minSize={20}>
                {renderCard(idx)}
              </Panel>
              {idx < count - 1 && <ResizeHandle direction="vertical" />}
            </React.Fragment>
          ))}
        </PanelGroup>
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid-stage">
        <PanelGroup direction="vertical">
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
          <Panel defaultSize={50} minSize={25}>
            {renderCard(2)}
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // 4 or more: 2x2 grid
  return (
    <div className="grid-stage">
      <PanelGroup direction="vertical">
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
