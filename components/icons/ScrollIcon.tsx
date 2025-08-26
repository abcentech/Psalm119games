
import React from 'react';

const ScrollIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M8 20v-2.2c0-1.02.5-1.94 1.34-2.5C10.18 14.5 11 14 12 14s1.82.5 2.66 1.3c.84.56 1.34 1.48 1.34 2.5V20" />
    <path d="M14 4a2 2 0 1 0-4 0" />
    <path d="M12 4v10" />
    <path d="M4.2 11.2c0-2.3 1.8-4.2 4-4.2h1.1c1.3 0 2.5.8 3.2 2" />
    <path d="M19.8 11.2c0-2.3-1.8-4.2-4-4.2h-1.1c-1.3 0-2.5.8-3.2 2" />
    <path d="M7 14.5c0 1.5.8 2.8 2 3.5" />
    <path d="M15 14.5c0 1.5-.8 2.8-2 3.5" />
  </svg>
);

export default ScrollIcon;
