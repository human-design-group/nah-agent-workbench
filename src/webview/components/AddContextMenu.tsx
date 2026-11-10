import React, { useState } from 'react';
import {
  IconImageEdit,
  IconFile,
  IconHammer,
  IconPlug,
  IconClapperboard,
  IconGlobalLine,
  IconArrowRightS,
} from './FigmaIcons';

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
    { name: 'nah-garage-door', desc: 'SSoT Capability Broker' },
  ];

  const connectorsList = [
    { name: 'Brave Search', desc: 'Web Search API' },
    { name: 'GitHub MCP', desc: 'Repo & PR Management' },
    { name: 'Desktop Commander', desc: 'System Operations' },
    { name: 'Playwright', desc: 'Browser Automation' },
  ];

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div
        className="add-context-menu figma-styled-menu"
        onClick={(e) => e.stopPropagation()}
        data-name="add-prompt-context"
      >
        <div className="add-context-header" data-name="add-context-heading">
          Add Context
        </div>

        <button
          className="context-menu-item"
          onClick={() => {
            onSelectContext('media');
            onClose();
          }}
        >
          <IconImageEdit size={14} color="#F5FCFF" className="menu-icon" />
          <span>Media</span>
        </button>

        <button
          className="context-menu-item"
          onClick={() => {
            onSelectContext('file');
            onClose();
          }}
        >
          <IconFile size={14} color="#F5FCFF" className="menu-icon" />
          <span>File</span>
        </button>

        <div
          className="context-menu-item has-submenu"
          onMouseEnter={() => setActiveSubmenu('skills')}
          onClick={() => setActiveSubmenu(activeSubmenu === 'skills' ? null : 'skills')}
        >
          <IconHammer size={14} color="#F5FCFF" className="menu-icon" />
          <span>Skills</span>
          <IconArrowRightS size={12} color="#939698" className="submenu-arrow" />

          {activeSubmenu === 'skills' && (
            <div className="context-submenu">
              {skillsList.map((skill) => (
                <button
                  key={skill.name}
                  className="submenu-item"
                  onClick={(e) => {
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
          <IconPlug size={14} color="#F5FCFF" className="menu-icon" />
          <span>Connectors</span>
          <IconArrowRightS size={12} color="#939698" className="submenu-arrow" />

          {activeSubmenu === 'connectors' && (
            <div className="context-submenu">
              {connectorsList.map((conn) => (
                <button
                  key={conn.name}
                  className="submenu-item"
                  onClick={(e) => {
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
          <IconClapperboard size={14} color="#F5FCFF" className="menu-icon" />
          <span>Actions</span>
        </button>

        <button
          className="context-menu-item"
          onClick={() => {
            onSelectContext('websearch');
            onClose();
          }}
        >
          <IconGlobalLine size={14} color="#F5FCFF" className="menu-icon" />
          <span>Web Search</span>
        </button>
      </div>
    </>
  );
};
