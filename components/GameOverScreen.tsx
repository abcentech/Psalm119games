
import React from 'react';

interface GameOverScreenProps {
  score: number;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onGoToMenu: () => void;
  isLastLevel: boolean;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onPlayAgain, onNextLevel, onGoToMenu, isLastLevel }) => {
  return (
    <div className="bg-amber-50/50 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-lg text-center p-8 max-w-md mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold text-stone-900 mb-2">Section Complete!</h1>
      <p className="text-lg text-stone-700 mb-4">You did a wonderful job studying God's word.</p>
      <div className="my-6">
        <p className="text-xl text-stone-600">Final Score</p>
        <p className="text-6xl font-bold text-amber-700">{score}</p>
      </div>
      <div className="flex flex-col space-y-3">
        {!isLastLevel && (
          <button
            onClick={onNextLevel}
            className="w-full bg-green-600 text-white font-bold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-4 focus:ring-green-400"
          >
            Continue to Next Section
          </button>
        )}
         <button
          onClick={onPlayAgain}
          className="w-full bg-amber-600 text-white font-bold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-amber-700 transition-colors focus:outline-none focus:ring-4 focus:ring-amber-400"
        >
          Play This Section Again
        </button>
        <button
          onClick={onGoToMenu}
          className="w-full bg-stone-500 text-white font-bold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-stone-600 transition-colors focus:outline-none focus:ring-4 focus:ring-stone-400"
        >
          Choose Another Section
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
