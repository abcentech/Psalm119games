
import React from 'react';
import ScrollIcon from './icons/ScrollIcon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-amber-50/50 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-lg text-center p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-center mb-6">
        <ScrollIcon className="w-24 h-24 text-amber-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">Psalm 119 Scroll Master</h1>
      <p className="text-lg text-stone-700 mb-8">
        An interactive game to help you learn and memorize all 176 verses of Psalm 119. 
        Complete the missing words in each verse to master the sections of this beautiful psalm.
      </p>
      <button
        onClick={onStart}
        className="bg-amber-600 text-white font-bold text-xl py-3 px-10 rounded-lg shadow-md hover:bg-amber-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400"
      >
        Begin the Journey
      </button>
    </div>
  );
};

export default WelcomeScreen;
