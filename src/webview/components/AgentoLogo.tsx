import React from 'react';

interface AgentoLogoProps {
  height?: number;
  size?: number;
  className?: string;
}

export const AgentoLogo: React.FC<AgentoLogoProps> = ({ height, size = 24, className = '' }) => {
  const actualHeight = height || size;
  const width = Math.round(actualHeight * 3.375);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 81 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`agento-wordmark-svg ${className}`}
    >
      {/* 'agent' lowercase text */}
      <text
        x="0"
        y="18"
        fill="#0094d9"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'Segoe UI', Roboto, sans-serif"
        fontSize="21"
        fontWeight="700"
        letterSpacing="-0.5px"
      >
        agent
      </text>

      {/* Stylized concentric orbital 'o' glyph */}
      <g transform="translate(68, 12)">
        <circle cx="0" cy="0" r="8" stroke="#0094d9" strokeWidth="2.4" fill="none" opacity="0.95" />
        <circle cx="0" cy="0" r="4.2" stroke="#00f0ff" strokeWidth="1.6" fill="none" opacity="0.85" />
        <circle cx="0" cy="0" r="1.5" fill="#00f0ff" />
      </g>
    </svg>
  );
};

