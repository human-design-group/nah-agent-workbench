import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import { useWorkbenchState } from './hooks/useWorkbenchState.js';
import { ControlBar } from './components/ControlBar.js';
import { GridContainer } from './components/GridContainer.js';

const App: React.FC = () => {
  const {
    state,
    setLayoutMode,
    switchAgentSlot,
    setAgentModel,
    setAgentPermissions,
    sendMessageToAgent,
    forkSession,
    newSession,
    resetLayout,
  } = useWorkbenchState();

  const onlineCount = state.agents.filter((a) => a.status === 'online' || a.status === 'thinking').length;

  return (
    <div className="workbench-app">
      <ControlBar
        layoutMode={state.layoutMode}
        onLayoutChange={setLayoutMode}
        onResetLayout={resetLayout}
        onlineCount={onlineCount}
      />
      <GridContainer
        layoutMode={state.layoutMode}
        agents={state.agents}
        slotKeys={state.panelSlots}
        onSwitchSlot={switchAgentSlot}
        onSendMessage={sendMessageToAgent}
        onSelectModel={setAgentModel}
        onSelectPermissions={setAgentPermissions}
        onForkSession={forkSession}
        onNewSession={newSession}
      />
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
