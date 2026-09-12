import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { AgentConfig, LayoutMode } from '../types/workbench.js';
import { AgentCard } from './AgentCard.js';
import { ResizeHandle } from './ResizeHandle.js';

interface GridContainerProps {
  layoutMode: LayoutMode;
  agents: AgentConfig[];
  onSendMessage: (agentId: string, text: string) => void;
  onSelectModel: (agentId: string, model: string) => void;
  onSelectPermissions: (agentId: string, mode: string) => void;
  onForkSession: (agentId: string) => void;
  onNewSession: (agentId: string) => void;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  layoutMode,
  agents,
  onSendMessage,
  onSelectModel,
  onSelectPermissions,
  onForkSession,
  onNewSession,
}) => {
  const humano = agents.find((a) => a.key === 'humano') || agents[0];
  const uno = agents.find((a) => a.key === 'uno') || agents[1] || agents[0];
  const omo = agents.find((a) => a.key === 'omo') || agents[2] || agents[0];
  const astro = agents.find((a) => a.key === 'astro') || agents[3] || agents[0];

  // 1. Vertical 1x4 Layout (Frame 2011:2051 in Figma)
  if (layoutMode === 'vertical') {
    return (
      <div className="grid-stage">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={25} minSize={15}>
            <AgentCard
              agent={humano}
              onSendMessage={(text) => onSendMessage(humano.id, text)}
              onSelectModel={(model) => onSelectModel(humano.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(humano.id, mode)}
              onFork={() => onForkSession(humano.id)}
              onNewSession={() => onNewSession(humano.id)}
            />
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            <AgentCard
              agent={uno}
              onSendMessage={(text) => onSendMessage(uno.id, text)}
              onSelectModel={(model) => onSelectModel(uno.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(uno.id, mode)}
              onFork={() => onForkSession(uno.id)}
              onNewSession={() => onNewSession(uno.id)}
            />
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            <AgentCard
              agent={omo}
              onSendMessage={(text) => onSendMessage(omo.id, text)}
              onSelectModel={(model) => onSelectModel(omo.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(omo.id, mode)}
              onFork={() => onForkSession(omo.id)}
              onNewSession={() => onNewSession(omo.id)}
            />
          </Panel>
          <ResizeHandle direction="vertical" />

          <Panel defaultSize={25} minSize={15}>
            <AgentCard
              agent={astro}
              onSendMessage={(text) => onSendMessage(astro.id, text)}
              onSelectModel={(model) => onSelectModel(astro.id, model)}
              onSelectPermissions={(mode) => onSelectPermissions(astro.id, mode)}
              onFork={() => onForkSession(astro.id)}
              onNewSession={() => onNewSession(astro.id)}
            />
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // 2. 2x2 Grid Layout (Frame 2001:213 in Figma)
  return (
    <div className="grid-stage">
      <PanelGroup direction="vertical">
        {/* Top Row: Humano + Uno */}
        <Panel defaultSize={50} minSize={25}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={20}>
              <AgentCard
                agent={humano}
                onSendMessage={(text) => onSendMessage(humano.id, text)}
                onSelectModel={(model) => onSelectModel(humano.id, model)}
                onSelectPermissions={(mode) => onSelectPermissions(humano.id, mode)}
                onFork={() => onForkSession(humano.id)}
                onNewSession={() => onNewSession(humano.id)}
              />
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={20}>
              <AgentCard
                agent={uno}
                onSendMessage={(text) => onSendMessage(uno.id, text)}
                onSelectModel={(model) => onSelectModel(uno.id, model)}
                onSelectPermissions={(mode) => onSelectPermissions(uno.id, mode)}
                onFork={() => onForkSession(uno.id)}
                onNewSession={() => onNewSession(uno.id)}
              />
            </Panel>
          </PanelGroup>
        </Panel>

        <ResizeHandle direction="horizontal" />

        {/* Bottom Row: Omo + Astro */}
        <Panel defaultSize={50} minSize={25}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={20}>
              <AgentCard
                agent={omo}
                onSendMessage={(text) => onSendMessage(omo.id, text)}
                onSelectModel={(model) => onSelectModel(omo.id, model)}
                onSelectPermissions={(mode) => onSelectPermissions(omo.id, mode)}
                onFork={() => onForkSession(omo.id)}
                onNewSession={() => onNewSession(omo.id)}
              />
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={20}>
              <AgentCard
                agent={astro}
                onSendMessage={(text) => onSendMessage(astro.id, text)}
                onSelectModel={(model) => onSelectModel(astro.id, model)}
                onSelectPermissions={(mode) => onSelectPermissions(astro.id, mode)}
                onFork={() => onForkSession(astro.id)}
                onNewSession={() => onNewSession(astro.id)}
              />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};
