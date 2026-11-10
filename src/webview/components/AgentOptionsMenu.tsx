import React, { useState } from 'react';
import {
  IconSearch,
  IconFileCopy,
  IconGlobalLine,
  IconFileCopy1,
  IconCloseCircle,
} from './FigmaIcons';

interface AgentOptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  onFindInSession: (agentId: string) => void;
  onExportSession: (agentId: string) => void;
  onDuplicateSession: (agentId: string) => void;
  onClearSession: (agentId: string) => void;
  onClosePanel: (agentId: string) => void;
}

export const AgentOptionsMenu: React.FC<AgentOptionsMenuProps> = ({
  isOpen,
  onClose,
  agentId,
  onFindInSession,
  onExportSession,
  onDuplicateSession,
  onClearSession,
  onClosePanel,
}) => {
  if (!isOpen) return null;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div
        className="agent-options-menu figma-styled-menu"
        onClick={(e) => e.stopPropagation()}
        data-name="Agent-Session-Additional-Settings"
      >
        <button
          className="menu-item"
          onClick={() => {
            onFindInSession(agentId);
            onClose();
          }}
          data-name="Find-in-Session"
        >
          <IconSearch size={14} color="#F5FCFF" className="menu-icon" />
          <span>Find in Session</span>
        </button>

        <button
          className="menu-item"
          onClick={() => {
            onDuplicateSession(agentId);
            onClose();
          }}
          data-name="Duplicate-Session"
        >
          <IconFileCopy size={14} color="#F5FCFF" className="menu-icon" />
          <span>Duplicate Session</span>
        </button>

        <button
          className="menu-item"
          onClick={() => {
            handleCopy('url', window.location.href);
          }}
          data-name="Copy-Current-Session-URL"
        >
          <IconGlobalLine size={14} color="#F5FCFF" className="menu-icon" />
          <span>{copiedKey === 'url' ? 'URL Copied!' : 'Copy Session URL'}</span>
        </button>

        <button
          className="menu-item"
          onClick={() => {
            handleCopy('name', `Session-${agentId}`);
          }}
        >
          <IconFileCopy1 size={14} color="#F5FCFF" className="menu-icon" />
          <span>{copiedKey === 'name' ? 'Name Copied!' : 'Copy Session Name & ID'}</span>
        </button>

        <div className="menu-divider" />

        <button
          className="menu-item-destructive-text"
          onClick={() => {
            onClosePanel(agentId);
            onClose();
          }}
          data-name="Close-Agent-Session"
        >
          <IconCloseCircle size={14} color="#D96B00" />
          <span>Close Agent Session</span>
        </button>
      </div>
    </>
  );
};
