import React, { useState } from 'react';
import { RemoteShareInfo } from '../types/workbench';
import {
  IconTeam,
  IconSettings3,
  IconArrowRightS,
  IconShareForward2,
  IconSearch,
  IconGlobalLine,
  IconFileCopy2,
  IconCloseCircle,
  IconArrowGoBack,
} from './FigmaIcons';

interface ExtensionMoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  remoteInfo?: RemoteShareInfo;
  onOpenSettings: () => void;
  onOpenWalkthrough: () => void;
  onExportSession: () => void;
  onFindInSession: () => void;
  onDuplicateSession: () => void;
  onCopyRemoteUrl: (target: 'session' | 'workspace' | 'shareCode') => void;
  onResetToFresh?: () => void;
}

export const ExtensionMoreMenu: React.FC<ExtensionMoreMenuProps> = ({
  isOpen,
  onClose,
  remoteInfo,
  onOpenSettings,
  onOpenWalkthrough,
  onExportSession,
  onFindInSession,
  onDuplicateSession,
  onCopyRemoteUrl,
  onResetToFresh,
}) => {
  if (!isOpen) return null;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (target: 'session' | 'workspace' | 'shareCode') => {
    onCopyRemoteUrl(target);
    setCopiedKey(target);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div
        className="extension-more-menu figma-styled-menu"
        onClick={(e) => e.stopPropagation()}
        data-node-id="2090:11050"
        data-name="agento-options"
      >
        <div className="menu-header-label" data-name="agento-options">
          Agento Workbench Options
        </div>

        <div className="menu-section">
          {/* 1. Session Mode */}
          <button
            className="menu-item"
            onClick={() => {
              onOpenWalkthrough();
              onClose();
            }}
          >
            <IconTeam size={16} color="#F5FCFF" className="menu-icon" />
            <span>Session Mode</span>
          </button>

          {/* 2. Workbench Layout */}
          <button
            className="menu-item"
            onClick={() => {
              onClose();
            }}
          >
            <IconSettings3 size={16} color="#F5FCFF" className="menu-icon" />
            <span>Workbench Layout</span>
            <IconArrowRightS size={14} color="#939698" style={{ marginLeft: 'auto' }} />
          </button>

          {/* 3. Export All Current Sessions */}
          <button
            className="menu-item"
            onClick={() => {
              onExportSession();
              onClose();
            }}
          >
            <IconShareForward2 size={16} color="#F5FCFF" className="menu-icon" />
            <span>Export All Current Sessions</span>
          </button>

          {/* 4. Search in All Sessions */}
          <button
            className="menu-item"
            onClick={() => {
              onFindInSession();
              onClose();
            }}
          >
            <IconSearch size={16} color="#F5FCFF" className="menu-icon" />
            <span>Search in All Sessions</span>
          </button>

          {/* 5. Reset to Fresh Ecosystem Sessions */}
          {onResetToFresh && (
            <button
              className="menu-item"
              onClick={() => {
                onResetToFresh();
                onClose();
              }}
            >
              <IconArrowGoBack size={16} color="#0094D9" className="menu-icon" />
              <span>Reset to Fresh Sessions</span>
            </button>
          )}
        </div>

        <div className="menu-section-header">Remote Control</div>

        <div className="menu-section">
          {/* 5. Copy Workbench URL */}
          <button className="menu-item" onClick={() => handleCopy('workspace')}>
            <IconGlobalLine size={16} color="#F5FCFF" className="menu-icon" />
            <span>{copiedKey === 'workspace' ? 'URL Copied!' : 'Copy Workbench URL'}</span>
          </button>

          {/* 6. Copy Agento Share Code */}
          <button className="menu-item" onClick={() => handleCopy('shareCode')}>
            <IconFileCopy2 size={16} color="#F5FCFF" className="menu-icon" />
            <span>
              {copiedKey === 'shareCode'
                ? 'Code Copied!'
                : `Copy Agento Share Code ${remoteInfo?.shareCode ? `(${remoteInfo.shareCode})` : ''}`}
            </span>
          </button>

          {/* 7. Agento Global Settings */}
          <button
            className="menu-item"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
          >
            <IconSettings3 size={16} color="#F5FCFF" className="menu-icon" />
            <span>Agento Global Settings</span>
          </button>
        </div>

        <div className="menu-footer-actions">
          {/* 8. Close Agento Workbench */}
          <button
            className="menu-item-destructive-pill"
            onClick={() => {
              onClose();
            }}
          >
            <IconCloseCircle size={16} color="#D96B00" />
            <span>Close Agento Workbench</span>
          </button>
        </div>
      </div>
    </>
  );
};
