import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, showLabel }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const clamped = Math.min(percentage, 100);
  return (
    <div className="relative w-full bg-stone-200 rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className="bg-gradient-to-r from-amber-500 to-amber-700 h-full rounded-full transition-all duration-300"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-stone-700">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;

