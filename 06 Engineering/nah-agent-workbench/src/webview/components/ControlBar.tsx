import React from 'react';
import { LayoutMode } from '../types/workbench.js';
import { LayoutGrid, Columns, RotateCcw } from 'lucide-react';

interface ControlBarProps {
  layoutMode: LayoutMode;
  onSelectLayout: (mode: LayoutMode) => void;
  onResetLayout: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  layoutMode,
  onSelectLayout,
  onResetLayout,
}) => {
  return (
    <header className="control-bar">
      <div className="brand-section">
        <span>notahuman Multi-Agent</span>
        <span className="brand-badge">AgentOS Prototype</span>
      </div>

      <div className="toolbar-actions">
        {/* Layout Switcher */}
        <div className="mode-switcher">
          <button
            className={`mode-btn ${layoutMode === 'grid' ? 'active' : ''}`}
            onClick={() => onSelectLayout('grid')}
            title="2x2 Grid Layout"
          >
            <LayoutGrid size={13} />
            <span>2x2 Grid</span>
          </button>
          <button
            className={`mode-btn ${layoutMode === 'vertical' ? 'active' : ''}`}
            onClick={() => onSelectLayout('vertical')}
            title="Vertical 1x4 Columns"
          >
            <Columns size={13} />
            <span>Vertical 1x4</span>
          </button>
        </div>

        {/* Reset Layout */}
        <button className="icon-button" onClick={onResetLayout} title="Reset Layout Sizes">
          <RotateCcw size={13} />
        </button>
      </div>
    </header>
  );
};
