import React from 'react';
import { PSALM_119_DATA } from '../constants';
import { PsalmSection } from '../types';

interface LevelSelectorProps {
  onSelectLevel: (section: PsalmSection) => void;
  onBack: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
         <h1 className="text-4xl font-bold text-stone-900 mb-2">Select a Section</h1>
         <p className="text-lg text-stone-600">Choose a section of Psalm 119 to begin your study.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {PSALM_119_DATA.map((section) => (
          <button
            key={section.hebrewLetter}
            onClick={() => onSelectLevel(section)}
            className="bg-amber-50/50 backdrop-blur-sm border border-amber-200 rounded-lg shadow-md p-4 text-center hover:bg-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <h2 className="text-2xl font-bold text-amber-700">{section.hebrewLetter}</h2>
            <p className="text-sm text-stone-600">Verses {section.startVerse}-{section.endVerse}</p>
          </button>
        ))}
      </div>
       <div className="text-center mt-8">
        <button onClick={onBack} className="text-amber-700 hover:text-amber-900 font-semibold transition-colors">
          &larr; Back to Home
        </button>
      </div>
    </div>
  );
};

export default LevelSelector;
