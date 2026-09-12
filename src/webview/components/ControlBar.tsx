import React from 'react';
import { LayoutMode } from '../types/workbench.js';
import { LayoutGrid, Columns, Rows, Maximize2, Columns3, RotateCcw, Radio } from 'lucide-react';

interface ControlBarProps {
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
  onResetLayout: () => void;
  onlineCount: number;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  layoutMode,
  onLayoutChange,
  onResetLayout,
  onlineCount,
}) => {
  return (
    <div className="control-bar">
      <div className="brand-section">
        <Radio size={14} color="#38bdf8" className="pulse-icon" />
        <span className="brand-title">Agent Workbench</span>
        <span className="brand-badge">Mission Control</span>
      </div>

      <div className="right-controls-group">
        <div className="status-pill" title="Live ACP Multi-Agent Gateway">
          <span className="live-dot" />
          <span>{onlineCount} Agents Online</span>
        </div>

        {/* Mode Switcher positioned to the right */}
        <div className="mode-switcher">
          <button
            className={`mode-btn ${layoutMode === 'grid' ? 'active' : ''}`}
            onClick={() => onLayoutChange('grid')}
            title="2x2 Grid Layout (Figma Frame 2001:213)"
          >
            <LayoutGrid size={13} />
            <span>2x2 Grid</span>
          </button>

          <button
            className={`mode-btn ${layoutMode === 'vertical' ? 'active' : ''}`}
            onClick={() => onLayoutChange('vertical')}
            title="1x4 Vertical Strip Layout (Figma Frame 2011:2051)"
          >
            <Columns size={13} />
            <span>1x4 Strip</span>
          </button>

          <button
            className={`mode-btn ${layoutMode === 'horizontal' ? 'active' : ''}`}
            onClick={() => onLayoutChange('horizontal')}
            title="4x1 Horizontal Stack Layout"
          >
            <Rows size={13} />
            <span>Horizontal Stack</span>
          </button>

          <button
            className={`mode-btn ${layoutMode === 'split-3' ? 'active' : ''}`}
            onClick={() => onLayoutChange('split-3')}
            title="1x3 Strip Layout"
          >
            <Columns3 size={13} />
            <span>1x3 Strip</span>
          </button>

          <button
            className={`mode-btn ${layoutMode === 'focus' ? 'active' : ''}`}
            onClick={() => onLayoutChange('focus')}
            title="Single Agent Focus Mode (1x1)"
          >
            <Maximize2 size={13} />
            <span>Focus</span>
          </button>
        </div>

        <button
          className="reset-btn"
          onClick={onResetLayout}
          title="Reset panels to default sizes"
        >
          <RotateCcw size={12} />
        </button>
      </div>
    </div>
  );
};
