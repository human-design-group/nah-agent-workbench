import React from 'react';
import { Search, Share2, Copy, Trash2, XCircle } from 'lucide-react';

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

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div className="agent-options-menu" onClick={e => e.stopPropagation()}>
        <button
          className="menu-item"
          onClick={() => {
            onFindInSession(agentId);
            onClose();
          }}
        >
          <Search size={14} className="menu-icon" />
          <span>Find in Session</span>
        </button>

        <button
          className="menu-item"
          onClick={() => {
            onExportSession(agentId);
            onClose();
          }}
        >
          <Share2 size={14} className="menu-icon" />
          <span>Export Session</span>
        </button>

        <button
          className="menu-item"
          onClick={() => {
            onDuplicateSession(agentId);
            onClose();
          }}
        >
          <Copy size={14} className="menu-icon" />
          <span>Duplicate Session</span>
        </button>

        <button
          className="menu-item"
          onClick={() => {
            onClearSession(agentId);
            onClose();
          }}
        >
          <Trash2 size={14} className="menu-icon" />
          <span>Clear History</span>
        </button>

        <div className="menu-divider" />

        <button
          className="menu-item text-danger"
          onClick={() => {
            onClosePanel(agentId);
            onClose();
          }}
        >
          <XCircle size={14} className="menu-icon" />
          <span>Close Agent Panel</span>
        </button>
      </div>
    </>
  );
};
