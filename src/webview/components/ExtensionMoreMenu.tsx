import React, { useState } from 'react';
import { Settings, Share2, Search, Copy, Globe, Key, Check, Sparkles } from 'lucide-react';
import { RemoteShareInfo } from '../types/workbench';

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
      <div className="extension-more-menu" onClick={e => e.stopPropagation()}>
        <div className="menu-section">
          <button
            className="menu-item"
            onClick={() => {
              onOpenWalkthrough();
              onClose();
            }}
          >
            <Sparkles size={14} className="menu-icon text-cyan" />
            <span>Welcome & Walkthrough</span>
          </button>

          <button
            className="menu-item"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
          >
            <Settings size={14} className="menu-icon" />
            <span>Extension Settings</span>
          </button>

          <button
            className="menu-item"
            onClick={() => {
              onExportSession();
              onClose();
            }}
          >
            <Share2 size={14} className="menu-icon" />
            <span>Export Session</span>
          </button>

          <button
            className="menu-item"
            onClick={() => {
              onFindInSession();
              onClose();
            }}
          >
            <Search size={14} className="menu-icon" />
            <span>Find in Session</span>
          </button>

          <button
            className="menu-item"
            onClick={() => {
              onDuplicateSession();
              onClose();
            }}
          >
            <Copy size={14} className="menu-icon" />
            <span>Duplicate Session</span>
          </button>
        </div>

        <div className="menu-divider" />

        <div className="menu-section">
          <div className="menu-section-header">Remote Control</div>

          <button className="menu-item" onClick={() => handleCopy('session')}>
            {copiedKey === 'session' ? (
              <Check size={14} className="menu-icon text-cyan" />
            ) : (
              <Globe size={14} className="menu-icon" />
            )}
            <span>{copiedKey === 'session' ? 'URL Copied!' : 'Copy Current Session URL'}</span>
          </button>

          <button className="menu-item" onClick={() => handleCopy('workspace')}>
            {copiedKey === 'workspace' ? (
              <Check size={14} className="menu-icon text-cyan" />
            ) : (
              <Globe size={14} className="menu-icon" />
            )}
            <span>{copiedKey === 'workspace' ? 'URL Copied!' : 'Copy Workspace URL'}</span>
          </button>

          <button className="menu-item" onClick={() => handleCopy('shareCode')}>
            {copiedKey === 'shareCode' ? (
              <Check size={14} className="menu-icon text-cyan" />
            ) : (
              <Key size={14} className="menu-icon" />
            )}
            <span>
              {copiedKey === 'shareCode'
                ? 'Code Copied!'
                : `Copy Workspace Share Code ${remoteInfo?.shareCode ? `(${remoteInfo.shareCode})` : ''}`}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
