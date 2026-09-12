import React from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';

interface ResizeHandleProps {
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ direction = 'vertical', className = '' }) => {
  const isVert = direction === 'vertical';
  return (
    <PanelResizeHandle
      className={`${isVert ? 'resize-gutter-vert' : 'resize-gutter-horiz'} ${className}`}
    />
  );
};
