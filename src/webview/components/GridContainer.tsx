import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { AgentConfig, LayoutMode } from '../types/workbench.js';
import { AgentCard } from './AgentCard.js';
import { ResizeHandle } from './ResizeHandle.js';

interface GridContainerProps {
  layoutMode: LayoutMode;
  agents: AgentConfig[];
  slotKeys: string[];
  onSwitchSlot: (slotIndex: number, newAgentKey: string) => void;
  onSendMessage: (agentId: string, text: string) => void;
  onSelectModel: (agentId: string, model: string) => void;
  onSelectPermissions: (agentId: string, mode: string) => void;
  onForkSession: (agentId: string) => void;
  onNewSession: (agentId: string) => void;
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
}) => {
  const allAgentsList = agents.map((a) => ({ key: a.key, name: a.name, runtime: a.runtime }));

  const getAgentForSlot = (slotIdx: number): AgentConfig => {
    const key = slotKeys[slotIdx] || agents[slotIdx % agents.length]?.key || 'humano';
    return agents.find((a) => a.key === key) || agents[0];
  };

  // 1. Single Agent Focus Mode (1x1)
  if (layoutMode === 'focus') {
    const focusAgent = getAgentForSlot(0);
    return (
      <div className="grid-stage">
        <AgentCard
          agent={focusAgent}
          allAgents={allAgentsList}
          onSwitchAgent={(newKey) => onSwitchSlot(0, newKey)}
          onSendMessage={(text) => onSendMessage(focusAgent.id, text)}
          onSelectModel={(model) => onSelectModel(focusAgent.id, model)}
          onSelectPermissions={(mode) => onSelectPermissions(focusAgent.id, mode)}
          onFork={() => onForkSession(focusAgent.id)}
          onNewSession={() => onNewSession(focusAgent.id)}
        />
      </div>
    );
  }

  // 2. 3-Column Split Mode (1x3)
  if (layoutMode === 'split-3') {
    const agent0 = getAgentForSlot(0);
    const agent1 = getAgentForSlot(1);
    const agent2 = getAgentForSlot(2);

    return (
      <div className="grid-stage">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={33.33} minSize={20}>
            <AgentCard
              agent={agent0}
              allAgents={allAgentsList}
              onSwitchAgent={(newKey) => onSwitchSlot(0, newKey)}
              onSendMessage={(text) => onSendMessage(agent0.id, text)}
              onSelectModel={(model) => onSelectModel(agent0.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(agent0.id, mode)}
              onFork={() => onForkSession(agent0.id)}
              onNewSession={() => onNewSession(agent0.id)}
            />
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={33.33} minSize={20}>
            <AgentCard
              agent={agent1}
              allAgents={allAgentsList}
              onSwitchAgent={(newKey) => onSwitchSlot(1, newKey)}
              onSendMessage={(text) => onSendMessage(agent1.id, text)}
              onSelectModel={(model) => onSelectModel(agent1.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(agent1.id, mode)}
              onFork={() => onForkSession(agent1.id)}
              onNewSession={() => onNewSession(agent1.id)}
            />
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={33.33} minSize={20}>
            <AgentCard
              agent={agent2}
              allAgents={allAgentsList}
              onSwitchAgent={(newKey) => onSwitchSlot(2, newKey)}
              onSendMessage={(text) => onSendMessage(agent2.id, text)}
              onSelectModel={(model) => onSelectModel(agent2.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(agent2.id, mode)}
              onFork={() => onForkSession(agent2.id)}
              onNewSession={() => onNewSession(agent2.id)}
            />
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // 3. Vertical 1x4 Layout (Frame 2011:2051 in Figma)
  if (layoutMode === 'vertical') {
    const a0 = getAgentForSlot(0);
    const a1 = getAgentForSlot(1);
    const a2 = getAgentForSlot(2);
    const a3 = getAgentForSlot(3);

    return (
      <div className="grid-stage">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={25} minSize={15}>
            <AgentCard
              agent={a0}
              allAgents={allAgentsList}
              onSwitchAgent={(newKey) => onSwitchSlot(0, newKey)}
              onSendMessage={(text) => onSendMessage(a0.id, text)}
              onSelectModel={(model) => onSelectModel(a0.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(a0.id, mode)}
              onFork={() => onForkSession(a0.id)}
              onNewSession={() => onNewSession(a0.id)}
            />
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            <AgentCard
              agent={a1}
              allAgents={allAgentsList}
              onSwitchAgent={(newKey) => onSwitchSlot(1, newKey)}
              onSendMessage={(text) => onSendMessage(a1.id, text)}
              onSelectModel={(model) => onSelectModel(a1.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(a1.id, mode)}
              onFork={() => onForkSession(a1.id)}
              onNewSession={() => onNewSession(a1.id)}
            />
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            <AgentCard
              agent={a2}
              allAgents={allAgentsList}
              onSwitchAgent={(newKey) => onSwitchSlot(2, newKey)}
              onSendMessage={(text) => onSendMessage(a2.id, text)}
              onSelectModel={(model) => onSelectModel(a2.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(a2.id, mode)}
              onFork={() => onForkSession(a2.id)}
              onNewSession={() => onNewSession(a2.id)}
            />
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            <AgentCard
              agent={a3}
              allAgents={allAgentsList}
              onSwitchAgent={(newKey) => onSwitchSlot(3, newKey)}
              onSendMessage={(text) => onSendMessage(a3.id, text)}
              onSelectModel={(model) => onSelectModel(a3.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(a3.id, mode)}
              onFork={() => onForkSession(a3.id)}
              onNewSession={() => onNewSession(a3.id)}
            />
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // 4. 2x2 Grid Layout (Frame 2001:213 in Figma)
  const aTopLeft = getAgentForSlot(0);
  const aTopRight = getAgentForSlot(1);
  const aBottomLeft = getAgentForSlot(2);
  const aBottomRight = getAgentForSlot(3);

  return (
    <div className="grid-stage">
      <PanelGroup direction="vertical">
        {/* Top Row: Panel 0 + Panel 1 */}
        <Panel defaultSize={50} minSize={25}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={20}>
              <AgentCard
                agent={aTopLeft}
                allAgents={allAgentsList}
                onSwitchAgent={(newKey) => onSwitchSlot(0, newKey)}
                onSendMessage={(text) => onSendMessage(aTopLeft.id, text)}
                onSelectModel={(model) => onSelectModel(aTopLeft.id, model)}
                onSelectPermissions={(mode) => onSelectPermissions(aTopLeft.id, mode)}
                onFork={() => onForkSession(aTopLeft.id)}
                onNewSession={() => onNewSession(aTopLeft.id)}
              />
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={20}>
              <AgentCard
                agent={aTopRight}
                allAgents={allAgentsList}
                onSwitchAgent={(newKey) => onSwitchSlot(1, newKey)}
                onSendMessage={(text) => onSendMessage(aTopRight.id, text)}
                onSelectModel={(model) => onSelectModel(aTopRight.id, model)}
                onSelectPermissions={(mode) => onSelectPermissions(aTopRight.id, mode)}
                onFork={() => onForkSession(aTopRight.id)}
                onNewSession={() => onNewSession(aTopRight.id)}
              />
            </Panel>
          </PanelGroup>
        </Panel>

        <ResizeHandle direction="horizontal" />

        {/* Bottom Row: Panel 2 + Panel 3 */}
        <Panel defaultSize={50} minSize={25}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={20}>
              <AgentCard
                agent={aBottomLeft}
                allAgents={allAgentsList}
                onSwitchAgent={(newKey) => onSwitchSlot(2, newKey)}
                onSendMessage={(text) => onSendMessage(aBottomLeft.id, text)}
                onSelectModel={(model) => onSelectModel(aBottomLeft.id, model)}
                onSelectPermissions={(mode) => onSelectPermissions(aBottomLeft.id, mode)}
                onFork={() => onForkSession(aBottomLeft.id)}
                onNewSession={() => onNewSession(aBottomLeft.id)}
              />
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={20}>
              <AgentCard
                agent={aBottomRight}
                allAgents={allAgentsList}
                onSwitchAgent={(newKey) => onSwitchSlot(3, newKey)}
                onSendMessage={(text) => onSendMessage(aBottomRight.id, text)}
                onSelectModel={(model) => onSelectModel(aBottomRight.id, model)}
                onSelectPermissions={(mode) => onSelectPermissions(aBottomRight.id, mode)}
                onFork={() => onForkSession(aBottomRight.id)}
                onNewSession={() => onNewSession(aBottomRight.id)}
              />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};
