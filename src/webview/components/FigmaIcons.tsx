import React from 'react';

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const IconAdd: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-add ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="add">
<path id="Vector" d="M9.16667 9.16667V4.16667H10.8333V9.16667H15.8333V10.8333H10.8333V15.8333H9.16667V10.8333H4.16667V9.16667H9.16667Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconAdd1: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-add1 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="add">
<path id="Vector" d="M9.16667 9.16667V4.16667H10.8333V9.16667H15.8333V10.8333H10.8333V15.8333H9.16667V10.8333H4.16667V9.16667H9.16667Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconAddCircle: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 24;
  const h = height || size || 24;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-addcircle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="add-circle">
<path id="Vector" d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill={color || "#0094D9"}/>
</g>
    </svg>
  );
};

export const IconArrowDownS: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 22;
  const h = height || size || 22;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-arrowdowns ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="arrow-down-s">
<path id="Vector" d="M10.9997 12.0738L15.537 7.53654L16.8334 8.8329L10.9997 14.6666L5.16609 8.8329L6.46246 7.53654L10.9997 12.0738Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconArrowDownS1: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 16;
  const h = height || size || 16;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-arrowdowns1 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="arrow-down-s">
<path id="Vector" d="M7.9998 8.78093L11.2997 5.48112L12.2425 6.42393L7.9998 10.6666L3.75716 6.42393L4.69997 5.48112L7.9998 8.78093Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconArrowDownS2: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 24;
  const h = height || size || 24;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-arrowdowns2 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="arrow-down-s">
<path id="Vector" d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconArrowGoBack: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 8;
  const h = height || size || 8;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-arrowgoback ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="arrow-go-back">
<path id="Vector" d="M2.66667 2.33333V3.66667L0.666667 2L2.66667 0.333333V1.66667H4.33333C5.8061 1.66667 7 2.86057 7 4.33333C7 5.8061 5.8061 7 4.33333 7H1.33333V6.33333H4.33333C5.4379 6.33333 6.33333 5.4379 6.33333 4.33333C6.33333 3.22876 5.4379 2.33333 4.33333 2.33333H2.66667Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconArrowRightS: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-arrowrights ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="arrow-right-s">
<path id="Vector" d="M6.5857 6.00035L4.11084 3.52547L4.81795 2.81836L7.99995 6.00035L4.81795 9.1823L4.11084 8.4752L6.5857 6.00035Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconArrowUpCircle: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 24;
  const h = height || size || 24;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-arrowupcircle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="arrow-up-circle">
<path id="Vector" d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12V16H11V12H8L12 8L16 12H13Z" fill={color || "#0094D9"}/>
</g>
    </svg>
  );
};

export const IconSendPlane: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || '#0094D9'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-sendplane ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
};

export const IconClapperboard: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-clapperboard ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="clapperboard">
<path id="Vector" d="M2.99903 3.5L4.15374 1.5H5.99905L4.84434 3.5H2.99903ZM5.99905 3.5L7.15375 1.5H8.99905L7.84435 3.5H5.99905ZM8.99905 3.5L10.1538 1.5H10.5041C10.778 1.5 11 1.72248 11 1.9967V10.0033C11 10.2776 10.7724 10.5 10.5041 10.5H1.4959C1.22203 10.5 1 10.2775 1 10.0033V1.9967C1 1.72238 1.22766 1.5 1.4959 1.5H2.99903L2 3.23038V9.5H10V3.5H8.99905Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconClose: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 18;
  const h = height || size || 18;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || '#F5FCFF'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`figma-icon figma-icon-close ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
};

export const IconCloseCircle: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-closecircle ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="close-circle">
<path id="Vector" d="M6 11C3.23857 11 1 8.7614 1 6C1 3.23857 3.23857 1 6 1C8.7614 1 11 3.23857 11 6C11 8.7614 8.7614 11 6 11ZM6 10C8.20915 10 10 8.20915 10 6C10 3.79086 8.20915 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20915 3.79086 10 6 10ZM6 5.2929L7.4142 3.87868L8.1213 4.58578L6.7071 6L8.1213 7.4142L7.4142 8.1213L6 6.7071L4.58578 8.1213L3.87868 7.4142L5.2929 6L3.87868 4.58578L4.58578 3.87868L6 5.2929Z" fill={color || "#D96B00"}/>
</g>
    </svg>
  );
};

export const IconDeleteBin6: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 8;
  const h = height || size || 8;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-deletebin6 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="delete-bin-6" clip-path="url(#clip0_0_772)">
<path id="Vector" d="M2.33333 1.33333V0.666667H5.66667V1.33333H7.33333V2H6.66667V7C6.66667 7.1841 6.51743 7.33333 6.33333 7.33333H1.66667C1.48257 7.33333 1.33333 7.1841 1.33333 7V2H0.666667V1.33333H2.33333ZM2 2V6.66667H6V2H2ZM3 3H3.66667V5.66667H3V3ZM4.33333 3H5V5.66667H4.33333V3Z" fill={color || "#F5FCFF"}/>
</g>
<defs>
<clipPath id="clip0_0_772">
<rect width="8" height="8" fill={color || "#F5FCFF"}/>
</clipPath>
</defs>
    </svg>
  );
};

export const IconDraggable: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-draggable ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="draggable">
<path id="Vector" d="M7.08333 5.83333C7.77369 5.83333 8.33333 5.27369 8.33333 4.58333C8.33333 3.89297 7.77369 3.33333 7.08333 3.33333C6.39298 3.33333 5.83333 3.89297 5.83333 4.58333C5.83333 5.27369 6.39298 5.83333 7.08333 5.83333ZM7.08333 11.25C7.77369 11.25 8.33333 10.6903 8.33333 10C8.33333 9.30967 7.77369 8.75 7.08333 8.75C6.39298 8.75 5.83333 9.30967 5.83333 10C5.83333 10.6903 6.39298 11.25 7.08333 11.25ZM8.33333 15.4167C8.33333 16.107 7.77369 16.6667 7.08333 16.6667C6.39298 16.6667 5.83333 16.107 5.83333 15.4167C5.83333 14.7263 6.39298 14.1667 7.08333 14.1667C7.77369 14.1667 8.33333 14.7263 8.33333 15.4167ZM12.9167 5.83333C13.607 5.83333 14.1667 5.27369 14.1667 4.58333C14.1667 3.89297 13.607 3.33333 12.9167 3.33333C12.2263 3.33333 11.6667 3.89297 11.6667 4.58333C11.6667 5.27369 12.2263 5.83333 12.9167 5.83333ZM14.1667 10C14.1667 10.6903 13.607 11.25 12.9167 11.25C12.2263 11.25 11.6667 10.6903 11.6667 10C11.6667 9.30967 12.2263 8.75 12.9167 8.75C13.607 8.75 14.1667 9.30967 14.1667 10ZM12.9167 16.6667C13.607 16.6667 14.1667 16.107 14.1667 15.4167C14.1667 14.7263 13.607 14.1667 12.9167 14.1667C12.2263 14.1667 11.6667 14.7263 11.6667 15.4167C11.6667 16.107 12.2263 16.6667 12.9167 16.6667Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconFile: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-file ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="file">
<path id="Vector" d="M4.5 1.00159V1H9.9989C10.2757 1 10.5 1.22766 10.5 1.4959V10.5041C10.5 10.778 10.2775 11 10.0033 11H1.9967C1.72238 11 1.5 10.7751 1.5 10.4966V4L4.5 1.00159ZM2.91459 4H4.5V2.41543L2.91459 4ZM5.5 2V4.5C5.5 4.77614 5.27615 5 5 5H2.5V10H9.5V2H5.5Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconFileCopy: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 8;
  const h = height || size || 8;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-filecopy ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="file-copy">
<path id="Vector" d="M2.33327 2V1C2.33327 0.815907 2.48251 0.666667 2.6666 0.666667H6.6666C6.8507 0.666667 6.99993 0.815907 6.99993 1V5.66667C6.99993 5.85077 6.8507 6 6.6666 6H5.6666V6.9997C5.6666 7.18397 5.51663 7.33333 5.331 7.33333H1.33555C1.1502 7.33333 1 7.18513 1 6.9997L1.00087 2.33362C1.0009 2.14937 1.15088 2 1.33647 2H2.33327ZM1.66747 2.66667L1.66673 6.66667H4.99993V2.66667H1.66747ZM2.99993 2H5.6666V5.33333H6.33327V1.33333H2.99993V2Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconFileCopy1: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-filecopy1 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="file-copy">
<path id="Vector" d="M3.4999 3V1.5C3.4999 1.22386 3.72376 1 3.9999 1H9.9999C10.276 1 10.4999 1.22386 10.4999 1.5V8.5C10.4999 8.77615 10.276 9 9.9999 9H8.4999V10.4995C8.4999 10.7759 8.27495 11 7.9965 11H2.00333C1.72529 11 1.5 10.7777 1.5 10.4995L1.5013 3.50044C1.50135 3.22406 1.72632 3 2.00471 3H3.4999ZM2.50121 4L2.50009 10H7.4999V4H2.50121ZM4.4999 3H8.4999V8H9.4999V2H4.4999V3Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconFileCopy2: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-filecopy2 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="file-copy-2">
<path id="Vector" d="M3.4999 3V1.5C3.4999 1.22386 3.72376 1 3.9999 1H9.9999C10.276 1 10.4999 1.22386 10.4999 1.5V8.5C10.4999 8.77615 10.276 9 9.9999 9H8.4999V10.4995C8.4999 10.7759 8.27495 11 7.9965 11H2.00333C1.72529 11 1.5 10.7777 1.5 10.4995L1.5013 3.50044C1.50135 3.22406 1.72632 3 2.00471 3H3.4999ZM2.50121 4L2.50009 10H7.4999V4H2.50121ZM4.4999 3H8.4999V8H9.4999V2H4.4999V3ZM3.5 5.5H6.5V6.5H3.5V5.5ZM3.5 7.5H6.5V8.5H3.5V7.5Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconFocus2: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-focus2 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="focus-2">
<path id="Vector" d="M10 1.66667C14.6 1.66667 18.3333 5.4 18.3333 10C18.3333 14.6 14.6 18.3333 10 18.3333C5.4 18.3333 1.66667 14.6 1.66667 10C1.66667 5.4 5.4 1.66667 10 1.66667ZM10 16.6667C13.6889 16.6667 16.6667 13.6889 16.6667 10C16.6667 6.31111 13.6889 3.33333 10 3.33333C6.31111 3.33333 3.33333 6.31111 3.33333 10C3.33333 13.6889 6.31111 16.6667 10 16.6667ZM10 15C7.23333 15 5 12.7667 5 10C5 7.23333 7.23333 5 10 5C12.7667 5 15 7.23333 15 10C15 12.7667 12.7667 15 10 15ZM10 8.33333C9.08333 8.33333 8.33333 9.08333 8.33333 10C8.33333 10.9167 9.08333 11.6667 10 11.6667C10.9167 11.6667 11.6667 10.9167 11.6667 10C11.6667 9.08333 10.9167 8.33333 10 8.33333Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconFolder: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-folder ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="folder">
<path id="Vector" d="M2 2.5V9.5H10V3.5H5.7929L4.79289 2.5H2ZM6.2071 2.5H10.5C10.7761 2.5 11 2.72386 11 3V10C11 10.2761 10.7761 10.5 10.5 10.5H1.5C1.22386 10.5 1 10.2761 1 10V2C1 1.72386 1.22386 1.5 1.5 1.5H5.2071L6.2071 2.5Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconGitBranch: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-gitbranch ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="git-branch">
<path id="Vector" d="M3.55254 7.60505C4.10753 7.82505 4.5 8.3667 4.5 9C4.5 9.82845 3.82842 10.5 3 10.5C2.17158 10.5 1.5 9.82845 1.5 9C1.5 8.3469 1.91741 7.79125 2.5 7.58535V4.41465C1.91741 4.20873 1.5 3.65311 1.5 3C1.5 2.17158 2.17158 1.5 3 1.5C3.82842 1.5 4.5 2.17158 4.5 3C4.5 3.65311 4.08259 4.20873 3.5 4.41465V5.9998C3.91783 5.68595 4.4372 5.5 5 5.5H7C7.69175 5.5 8.2741 5.03175 8.44745 4.39496C7.89245 4.17494 7.5 3.63331 7.5 3C7.5 2.17158 8.17155 1.5 9 1.5C9.82845 1.5 10.5 2.17158 10.5 3C10.5 3.6666 10.0652 4.23165 9.4637 4.42696C9.2611 5.60425 8.23515 6.5 7 6.5H5C4.30826 6.5 3.7259 6.96825 3.55254 7.60505ZM3 8.5C2.72386 8.5 2.5 8.72385 2.5 9C2.5 9.27615 2.72386 9.5 3 9.5C3.27614 9.5 3.5 9.27615 3.5 9C3.5 8.72385 3.27614 8.5 3 8.5ZM3 2.5C2.72386 2.5 2.5 2.72386 2.5 3C2.5 3.27614 2.72386 3.5 3 3.5C3.27614 3.5 3.5 3.27614 3.5 3C3.5 2.72386 3.27614 2.5 3 2.5ZM9 2.5C8.72385 2.5 8.5 2.72386 8.5 3C8.5 3.27614 8.72385 3.5 9 3.5C9.27615 3.5 9.5 3.27614 9.5 3C9.5 2.72386 9.27615 2.5 9 2.5Z" fill={color || "#0094D9"}/>
</g>
    </svg>
  );
};

export const IconGlobalLine: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-globalline ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="global-line">
<path id="Vector" d="M6 11C3.23857 11 1 8.7614 1 6C1 3.23857 3.23857 1 6 1C8.7614 1 11 3.23857 11 6C11 8.7614 8.7614 11 6 11ZM4.85501 9.8337C4.37371 8.81295 4.07866 7.6871 4.01366 6.5H2.03095C2.229 8.08825 3.3582 9.38735 4.85501 9.8337ZM5.01535 6.5C5.09055 7.7194 5.4389 8.86485 6 9.876C6.5611 8.86485 6.90945 7.7194 6.98465 6.5H5.01535ZM9.96905 6.5H7.98635C7.92135 7.6871 7.6263 8.81295 7.145 9.8337C8.6418 9.38735 9.771 8.08825 9.96905 6.5ZM2.03095 5.5H4.01366C4.07866 4.31289 4.37371 3.18704 4.85501 2.16628C3.3582 2.61267 2.229 3.91175 2.03095 5.5ZM5.01535 5.5H6.98465C6.90945 4.28061 6.5611 3.13513 6 2.124C5.4389 3.13513 5.09055 4.28061 5.01535 5.5ZM7.145 2.16628C7.6263 3.18704 7.92135 4.31289 7.98635 5.5H9.96905C9.771 3.91175 8.6418 2.61267 7.145 2.16628Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconHammer: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-hammer ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="hammer">
<path id="Vector" d="M10 1C10.2761 1 10.5 1.22386 10.5 1.5V4C10.5 4.27614 10.2761 4.5 10 4.5H7.5V11C7.5 11.2761 7.27615 11.5 7 11.5H5C4.72386 11.5 4.5 11.2761 4.5 11V4.5H1.75C1.47386 4.5 1.25 4.27614 1.25 4V2.80902C1.25 2.61963 1.357 2.4465 1.52639 2.3618L4.25 1H10ZM7.5 2H4.48607L2.25 3.11804V3.5H5.5V10.5H6.5V3.5H7.5V2ZM9.5 2H8.5V3.5H9.5V2Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconImageEdit: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-imageedit ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="image-edit">
<path id="Vector" d="M10 1.5C10.2761 1.5 10.5 1.72386 10.5 2V2.8785L9.5 3.8785V2.5H2.5V6.55L4.5 4.55025L6.664 6.7145L5.9566 7.4211L4.5 5.96445L2.5 7.964V9.5H7.7665L8.1207 9.5006L8.785 8.8355L9.44975 9.5H9.5V8.121L10.5 7.121V10C10.5 10.2761 10.2761 10.5 10 10.5H2C1.725 10.5 1.5 10.275 1.5 10V2C1.5 1.72386 1.72386 1.5 2 1.5H10ZM10.8891 3.90381L11.5962 4.61092L7.7071 8.5L6.99895 8.49895L7 7.7929L10.8891 3.90381ZM7.75 3.5C8.1642 3.5 8.5 3.83578 8.5 4.25C8.5 4.66422 8.1642 5 7.75 5C7.3358 5 7 4.66422 7 4.25C7 3.83578 7.3358 3.5 7.75 3.5Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconLayout: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-layout ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="layout">
<path id="Vector" d="M13.3333 17.5V8.33333H17.5V16.6667C17.5 17.1269 17.1269 17.5 16.6667 17.5H13.3333ZM11.6667 17.5H3.33333C2.8731 17.5 2.5 17.1269 2.5 16.6667V8.33333H11.6667V17.5ZM17.5 6.66667H2.5V3.33333C2.5 2.8731 2.8731 2.5 3.33333 2.5H16.6667C17.1269 2.5 17.5 2.8731 17.5 3.33333V6.66667Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconMenu: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-menu ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="menu">
<path id="Vector" d="M2.5 3.33333H17.5V5H2.5V3.33333ZM2.5 9.16667H17.5V10.8333H2.5V9.16667ZM2.5 15H17.5V16.6667H2.5V15Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconMore2: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-more2 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="more-2">
<path id="Vector" d="M10 2.5C9.08333 2.5 8.33333 3.25 8.33333 4.16667C8.33333 5.08333 9.08333 5.83333 10 5.83333C10.9167 5.83333 11.6667 5.08333 11.6667 4.16667C11.6667 3.25 10.9167 2.5 10 2.5ZM10 14.1667C9.08333 14.1667 8.33333 14.9167 8.33333 15.8333C8.33333 16.75 9.08333 17.5 10 17.5C10.9167 17.5 11.6667 16.75 11.6667 15.8333C11.6667 14.9167 10.9167 14.1667 10 14.1667ZM10 8.33333C9.08333 8.33333 8.33333 9.08333 8.33333 10C8.33333 10.9167 9.08333 11.6667 10 11.6667C10.9167 11.6667 11.6667 10.9167 11.6667 10C11.6667 9.08333 10.9167 8.33333 10 8.33333Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconMore3: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-more3 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="more-2">
<path id="Vector" d="M10 2.5C9.08333 2.5 8.33333 3.25 8.33333 4.16667C8.33333 5.08333 9.08333 5.83333 10 5.83333C10.9167 5.83333 11.6667 5.08333 11.6667 4.16667C11.6667 3.25 10.9167 2.5 10 2.5ZM10 14.1667C9.08333 14.1667 8.33333 14.9167 8.33333 15.8333C8.33333 16.75 9.08333 17.5 10 17.5C10.9167 17.5 11.6667 16.75 11.6667 15.8333C11.6667 14.9167 10.9167 14.1667 10 14.1667ZM10 8.33333C9.08333 8.33333 8.33333 9.08333 8.33333 10C8.33333 10.9167 9.08333 11.6667 10 11.6667C10.9167 11.6667 11.6667 10.9167 11.6667 10C11.6667 9.08333 10.9167 8.33333 10 8.33333Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconPlug: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-plug ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="plug">
<path id="Vector" d="M6.5 9V10H9.5V11H6.5C5.9477 11 5.5 10.5523 5.5 10V9H4C2.89543 9 2 8.10455 2 7V3.5C2 3.22386 2.22386 3 2.5 3H4V1H5V3H7V1H8V3H9.5C9.77615 3 10 3.22386 10 3.5V7C10 8.10455 9.10455 9 8 9H6.5ZM4 8H8C8.5523 8 9 7.5523 9 7V5.5H3V7C3 7.5523 3.44772 8 4 8ZM9 4H3V4.5H9V4ZM6 7.25C5.72385 7.25 5.5 7.02615 5.5 6.75C5.5 6.47385 5.72385 6.25 6 6.25C6.27615 6.25 6.5 6.47385 6.5 6.75C6.5 7.02615 6.27615 7.25 6 7.25Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconSearch: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-search ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="search">
<path id="Vector" d="M9.0155 8.3084L11.1568 10.4497L10.4497 11.1568L8.3084 9.0155C7.53845 9.6315 6.562 10 5.5 10C3.016 10 1 7.984 1 5.5C1 3.016 3.016 1 5.5 1C7.984 1 10 3.016 10 5.5C10 6.562 9.6315 7.53845 9.0155 8.3084ZM8.01235 7.9374C8.62375 7.3073 9 6.4478 9 5.5C9 3.56625 7.43375 2 5.5 2C3.56625 2 2 3.56625 2 5.5C2 7.43375 3.56625 9 5.5 9C6.4478 9 7.3073 8.62375 7.9374 8.01235L8.01235 7.9374Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconSettings: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 20;
  const h = height || size || 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-settings ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="settings">
<path id="Vector" d="M10 0.833333L17.9167 5.41667V14.5833L10 19.1667L2.08333 14.5833V5.41667L10 0.833333ZM10 2.75917L3.75 6.37759V13.6224L10 17.2408L16.25 13.6224V6.37759L10 2.75917ZM10 13.3333C8.15905 13.3333 6.66667 11.8409 6.66667 10C6.66667 8.15905 8.15905 6.66667 10 6.66667C11.8409 6.66667 13.3333 8.15905 13.3333 10C13.3333 11.8409 11.8409 13.3333 10 13.3333ZM10 11.6667C10.9205 11.6667 11.6667 10.9205 11.6667 10C11.6667 9.0795 10.9205 8.33333 10 8.33333C9.0795 8.33333 8.33333 9.0795 8.33333 10C8.33333 10.9205 9.0795 11.6667 10 11.6667Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconSettings3: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-settings3 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="settings-3">
<path id="Vector" d="M1.66973 8.5001C1.4536 8.12575 1.29139 7.7351 1.18067 7.33705C1.6669 7.08895 1.99986 6.5834 1.99986 6.0001C1.99986 5.41725 1.6674 4.912 1.18176 4.6637C1.40512 3.85825 1.82928 3.10814 2.43237 2.495C2.89035 2.79208 3.49468 2.82767 3.99986 2.536C4.50504 2.24433 4.77638 1.70318 4.7481 1.15802C5.58065 0.9423 6.44235 0.95002 7.25155 1.15931C7.22375 1.70403 7.49505 2.24456 7.99985 2.536C8.50505 2.82766 9.10935 2.79208 9.5673 2.49503C9.85665 2.78993 10.1138 3.12575 10.33 3.5001C10.5461 3.87445 10.7084 4.26512 10.819 4.66314C10.3328 4.91123 9.99985 5.4168 9.99985 6.0001C9.99985 6.583 10.3323 7.0882 10.818 7.3365C10.5946 8.14195 10.1705 8.89205 9.56735 9.5052C9.10935 9.20815 8.50505 9.17255 7.99985 9.4642C7.49465 9.75585 7.22335 10.2971 7.2516 10.8422C6.4191 11.0579 5.5574 11.0502 4.74817 10.8409C4.77596 10.2962 4.50465 9.75565 3.99986 9.4642C3.49469 9.17255 2.8904 9.2081 2.43242 9.50515C2.14309 9.21025 1.88586 8.87445 1.66973 8.5001ZM4.49986 8.5982C5.04555 8.91325 5.43745 9.41135 5.62515 9.98295C5.8743 10.0066 6.1251 10.007 6.3743 9.98375C6.5619 9.41185 6.9539 8.9134 7.49985 8.5982C8.0458 8.28295 8.6735 8.19275 9.2626 8.3162C9.4073 8.112 9.5324 7.8946 9.63645 7.667C9.2353 7.21865 8.99985 6.6302 8.99985 6.0001C8.99985 5.37 9.2353 4.7816 9.63645 4.33325C9.5844 4.22025 9.5269 4.10911 9.46395 4.0001C9.401 3.89109 9.3335 3.78574 9.26165 3.68421C8.67285 3.80738 8.04555 3.71707 7.49985 3.40203C6.95415 3.08697 6.5623 2.58884 6.37455 2.01728C6.12545 1.99357 5.8746 1.99323 5.62545 2.01646C5.4378 2.58836 5.0458 3.08682 4.49986 3.40203C3.9539 3.71724 3.32622 3.80747 2.73714 3.68402C2.59242 3.88821 2.46732 4.10559 2.36328 4.33319C2.76441 4.78156 2.99986 5.37 2.99986 6.0001C2.99986 6.6302 2.76442 7.2186 2.36328 7.66695C2.41534 7.77995 2.47282 7.8911 2.53576 8.0001C2.59869 8.1091 2.6662 8.21445 2.73806 8.316C3.32688 8.19285 3.95419 8.28315 4.49986 8.5982ZM5.99985 7.5001C5.17145 7.5001 4.49986 6.82855 4.49986 6.0001C4.49986 5.1717 5.17145 4.5001 5.99985 4.5001C6.8283 4.5001 7.49985 5.1717 7.49985 6.0001C7.49985 6.82855 6.8283 7.5001 5.99985 7.5001ZM5.99985 6.5001C6.276 6.5001 6.49985 6.27625 6.49985 6.0001C6.49985 5.72395 6.276 5.5001 5.99985 5.5001C5.7237 5.5001 5.49985 5.72395 5.49985 6.0001C5.49985 6.27625 5.7237 6.5001 5.99985 6.5001Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconShareForward2: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-shareforward2 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="share-forward-2">
<path id="Vector" d="M2 9.49985H10V6.99985H11V9.99985C11 10.276 10.7761 10.4999 10.5 10.4999H1.5C1.22386 10.4999 1 10.276 1 9.99985V6.99985H2V9.49985ZM8.0858 3.49985L6.1109 1.52498L6.818 0.81787L10 3.99985L6.818 7.18185L6.1109 6.47475L8.0858 4.49985H2.5V3.49985H8.0858Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconTeam: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 12;
  const h = height || size || 12;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-team ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="team">
<path id="Vector" d="M6 5.5C7.3807 5.5 8.5 6.6193 8.5 8V11H7.5V8C7.5 7.20115 6.87555 6.54815 6.08815 6.50255L6 6.5C5.20115 6.5 4.54817 7.12445 4.50254 7.91185L4.5 8V11H3.5V8C3.5 6.6193 4.61929 5.5 6 5.5ZM2.75 7C2.88943 7 3.02504 7.0163 3.15505 7.0471C3.07101 7.297 3.01936 7.561 3.00448 7.83465L3 8L3.00035 8.0428C2.94378 8.0228 2.88411 8.00935 2.82223 8.00345L2.75 8C2.36015 8 2.03977 8.29745 2.00343 8.67775L2 8.75V11H1V8.75C1 7.7835 1.7835 7 2.75 7ZM9.25 7C10.2165 7 11 7.7835 11 8.75V11H10V8.75C10 8.36015 9.70255 8.0398 9.32225 8.00345L9.25 8C9.1624 8 9.0783 8.015 9.00015 8.0426L9 8C9 7.66715 8.9458 7.347 8.84575 7.0478C8.97495 7.0163 9.11055 7 9.25 7ZM2.75 4C3.44036 4 4 4.55964 4 5.25C4 5.94035 3.44036 6.5 2.75 6.5C2.05964 6.5 1.5 5.94035 1.5 5.25C1.5 4.55964 2.05964 4 2.75 4ZM9.25 4C9.94035 4 10.5 4.55964 10.5 5.25C10.5 5.94035 9.94035 6.5 9.25 6.5C8.55965 6.5 8 5.94035 8 5.25C8 4.55964 8.55965 4 9.25 4ZM2.75 5C2.61193 5 2.5 5.11195 2.5 5.25C2.5 5.38805 2.61193 5.5 2.75 5.5C2.88807 5.5 3 5.38805 3 5.25C3 5.11195 2.88807 5 2.75 5ZM9.25 5C9.11195 5 9 5.11195 9 5.25C9 5.38805 9.11195 5.5 9.25 5.5C9.38805 5.5 9.5 5.38805 9.5 5.25C9.5 5.11195 9.38805 5 9.25 5ZM6 1C7.10455 1 8 1.89543 8 3C8 4.10457 7.10455 5 6 5C4.89543 5 4 4.10457 4 3C4 1.89543 4.89543 1 6 1ZM6 2C5.4477 2 5 2.44772 5 3C5 3.55228 5.4477 4 6 4C6.5523 4 7 3.55228 7 3C7 2.44772 6.5523 2 6 2Z" fill={color || "#F5FCFF"}/>
</g>
    </svg>
  );
};

export const IconVoiceprint: React.FC<IconProps> = ({
  size,
  width,
  height,
  color,
  className = '',
  style,
}) => {
  const w = width || size || 24;
  const h = height || size || 24;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`figma-icon figma-icon-voiceprint ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <g id="voiceprint">
<path id="Vector" d="M5 7H7V17H5V7ZM1 10H3V14H1V10ZM9 2H11V20H9V2ZM13 4H15V22H13V4ZM17 7H19V17H17V7ZM21 10H23V14H21V10Z" fill={color || "#0094D9"}/>
</g>
    </svg>
  );
};
