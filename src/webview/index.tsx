import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import { useWorkbenchState } from './hooks/useWorkbenchState';
import { ControlBar } from './components/ControlBar';
import { GridContainer } from './components/GridContainer';

import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const {
    state,
    showOnboarding,
    setShowOnboarding,
    showSettings,
    setShowSettings,
    settings,
    updateSettings,
    resetSettings,
    diagnosticResults,
    runDiagnostics,
    completeOnboarding,
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
        onOpenSettings={() => setShowSettings(true)}
        onOpenWalkthrough={() => setShowOnboarding(true)}
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
        onClearSession={(agentId) => newSession(agentId)}
        onClosePanel={closeAgentPanel}
        onAddAgentClick={() => addAgentSlot('humano')}
      />

      {showOnboarding && (
        <OnboardingModal
          availableAgents={state.agents}
          currentSlots={state.panelSlots}
          initialMode={state.sessionMode}
          onComplete={completeOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currentSettings={settings}
          onSaveSettings={updateSettings}
          onResetSettings={resetSettings}
          availableAgents={state.agents}
          diagnosticResults={diagnosticResults}
          onRunDiagnostics={runDiagnostics}
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
