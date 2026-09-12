import React, { useState } from 'react';
import { Image, FileText, Wrench, Plug, Film, Globe, ChevronRight } from 'lucide-react';

interface AddContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContext: (type: string, detail?: string) => void;
}

export const AddContextMenu: React.FC<AddContextMenuProps> = ({
  isOpen,
  onClose,
  onSelectContext,
}) => {
  if (!isOpen) return null;

  const [activeSubmenu, setActiveSubmenu] = useState<'skills' | 'connectors' | null>(null);

  const skillsList = [
    { name: 'nah-figma', desc: 'Figma Token Sync & Bridge' },
    { name: 'nah-remember', desc: 'Long-term Memory' },
    { name: 'nah-knows', desc: 'Codebase Knowledge Base' },
    { name: 'nah-bridge', desc: 'Ecosystem Bridge' },
  ];

  const connectorsList = [
    { name: 'Brave Search', desc: 'Web Search API' },
    { name: 'GitHub MCP', desc: 'Repo & PR Management' },
    { name: 'Postgres MCP', desc: 'Database Querying' },
    { name: 'Linear MCP', desc: 'Issue Tracking' },
  ];

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div className="add-context-menu" onClick={e => e.stopPropagation()}>
        <div className="add-context-header">Add Context</div>

        <button
          className="context-menu-item"
          onClick={() => {
            onSelectContext('media');
            onClose();
          }}
        >
          <Image size={13} className="menu-icon text-cyan" />
          <span>Media</span>
        </button>

        <button
          className="context-menu-item"
          onClick={() => {
            onSelectContext('file');
            onClose();
          }}
        >
          <FileText size={13} className="menu-icon text-cyan" />
          <span>File</span>
        </button>

        <div
          className="context-menu-item has-submenu"
          onMouseEnter={() => setActiveSubmenu('skills')}
          onClick={() => setActiveSubmenu(activeSubmenu === 'skills' ? null : 'skills')}
        >
          <Wrench size={13} className="menu-icon text-cyan" />
          <span>Skills</span>
          <ChevronRight size={12} className="submenu-arrow" />

          {activeSubmenu === 'skills' && (
            <div className="context-submenu">
              {skillsList.map(skill => (
                <button
                  key={skill.name}
                  className="submenu-item"
                  onClick={e => {
                    e.stopPropagation();
                    onSelectContext('skill', skill.name);
                    onClose();
                  }}
                >
                  <span className="submenu-item-title">{skill.name}</span>
                  <span className="submenu-item-desc">{skill.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className="context-menu-item has-submenu"
          onMouseEnter={() => setActiveSubmenu('connectors')}
          onClick={() => setActiveSubmenu(activeSubmenu === 'connectors' ? null : 'connectors')}
        >
          <Plug size={13} className="menu-icon text-cyan" />
          <span>Connectors</span>
          <ChevronRight size={12} className="submenu-arrow" />

          {activeSubmenu === 'connectors' && (
            <div className="context-submenu">
              {connectorsList.map(conn => (
                <button
                  key={conn.name}
                  className="submenu-item"
                  onClick={e => {
                    e.stopPropagation();
                    onSelectContext('connector', conn.name);
                    onClose();
                  }}
                >
                  <span className="submenu-item-title">{conn.name}</span>
                  <span className="submenu-item-desc">{conn.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="context-menu-item"
          onClick={() => {
            onSelectContext('actions');
            onClose();
          }}
        >
          <Film size={13} className="menu-icon text-cyan" />
          <span>Actions</span>
        </button>

        <button
          className="context-menu-item"
          onClick={() => {
            onSelectContext('websearch');
            onClose();
          }}
        >
          <Globe size={13} className="menu-icon text-cyan" />
          <span>Web Search</span>
        </button>
      </div>
    </>
  );
};
