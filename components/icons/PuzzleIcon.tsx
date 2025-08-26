import React from 'react';

const PuzzleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12.5 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    <path d="M18.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    <path d="M6 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
    <path d="M12 18.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
    <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />
    <path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
  </svg>
);

export default PuzzleIcon;
