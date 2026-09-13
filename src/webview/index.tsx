import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import { useWorkbenchState } from './hooks/useWorkbenchState';
import { ControlBar } from './components/ControlBar';
import { GridContainer } from './components/GridContainer';

const App: React.FC = () => {
  const {
    state,
    setLayoutMode,
    setSessionMode,
    switchAgentSlot,
    addAgentSlot,
    setAgentModel,
    setAgentPermissions,
    sendMessageToAgent,
    forkSession,
    newSession,
    exportSession,
    duplicateSession,
    findInSession,
    closeAgentPanel,
    copyRemoteUrl,
    reloadWorkbench,
  } = useWorkbenchState();

  return (
    <div className="workbench-app">
      <ControlBar
        currentLayout={state.layoutMode}
        onSelectLayout={setLayoutMode}
        sessionMode={state.sessionMode}
        teamConfig={state.teamConfig}
        onApplySessionMode={setSessionMode}
        availableAgents={state.agents}
        currentSlotKeys={state.panelSlots}
        remoteInfo={state.remoteInfo}
        onReload={reloadWorkbench}
        onOpenSettings={() => console.log('Open settings')}
        onExportSession={() => exportSession()}
        onFindInSession={() => findInSession()}
        onDuplicateSession={() => duplicateSession()}
        onCopyRemoteUrl={copyRemoteUrl}
        onAddAgent={(key) => addAgentSlot(key)}
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
        onFindInSession={findInSession}
        onExportSession={exportSession}
        onDuplicateSession={duplicateSession}
        onClearSession={(agentId) => console.log('Clear session for', agentId)}
        onClosePanel={closeAgentPanel}
        onAddAgentClick={() => addAgentSlot('humano')}
      />
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
