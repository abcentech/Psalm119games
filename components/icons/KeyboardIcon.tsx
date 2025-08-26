import React from 'react';

const KeyboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    <line x1="6" y1="10" x2="6" y2="10"></line>
    <line x1="10" y1="10" x2="10" y2="10"></line>
    <line x1="14" y1="10" x2="14" y2="10"></line>
    <line x1="18" y1="10" x2="18" y2="10"></line>
    <line x1="8" y1="14" x2="8" y2="14"></line>
    <line x1="12" y1="14" x2="12" y2="14"></line>
    <line x1="16" y1="14" x2="16" y2="14"></line>
    <line x1="6" y1="14" x2="6" y2="14"></line>
  </svg>
);

export default KeyboardIcon;
