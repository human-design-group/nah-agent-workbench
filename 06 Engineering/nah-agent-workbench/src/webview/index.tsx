import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import { useWorkbenchState } from './hooks/useWorkbenchState';
import { ControlBar } from './components/ControlBar';
import { GridContainer } from './components/GridContainer';
import { OnboardingModal } from './components/OnboardingModal';

const App: React.FC = () => {
  const {
    state,
    showOnboarding,
    setShowOnboarding,
    requestScan,
    completeOnboarding,
    setLayoutMode,
    setSessionMode,
    switchAgentSlot,
    addAgentSlot,
    setAgentModel,
    setAgentPermissions,
    attachContext,
    removeAttachedContext,
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
        onOpenSettings={() => setShowOnboarding(true)}
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
        onAttachContext={attachContext}
        onRemoveContext={removeAttachedContext}
        onForkSession={forkSession}
        onNewSession={newSession}
        onFindInSession={findInSession}
        onExportSession={exportSession}
        onDuplicateSession={duplicateSession}
        onClearSession={(agentId) => newSession(agentId)}
        onClosePanel={closeAgentPanel}
        onAddAgentClick={() => addAgentSlot('astro')}
      />

      {showOnboarding && (
        <OnboardingModal
          scan={state.environmentScan}
          onRefreshScan={requestScan}
          onComplete={completeOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
