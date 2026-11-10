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
    closeSlotIndex,
    closeAgentPanel,
    reorderSlots,
    setAgentModel,
    setAgentPermissions,
    sendMessageToAgent,
    forkSession,
    newSession,
    exportSession,
    duplicateSession,
    findInSession,
    copyRemoteUrl,
    reloadWorkbench,
    resetToFreshSessions,
    availableModels,
    providerConfig,
    providerTestResult,
    isTestingProvider,
    testProviderConnection,
    saveProviderConfig,
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
        onResetToFresh={resetToFreshSessions}
      />
      <GridContainer
        layoutMode={state.layoutMode}
        agents={state.agents}
        slotKeys={state.panelSlots}
        availableModels={availableModels}
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
        onCloseSlot={closeSlotIndex}
        onReorderSlots={reorderSlots}
        onAddAgentClick={() => addAgentSlot('gravito')}
      />

      {showOnboarding && (
        <OnboardingModal
          availableAgents={state.agents}
          currentSlots={state.panelSlots}
          initialMode={state.sessionMode}
          providerConfig={providerConfig}
          providerTestResult={providerTestResult}
          isTestingProvider={isTestingProvider}
          onTestProvider={testProviderConnection}
          onSaveProvider={saveProviderConfig}
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
          providerConfig={providerConfig}
          providerTestResult={providerTestResult}
          isTestingProvider={isTestingProvider}
          onTestProvider={testProviderConnection}
          onSaveProvider={saveProviderConfig}
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
