import React from 'react';
import { GameMode, PsalmSection } from '../types';
import KeyboardIcon from './icons/KeyboardIcon';
import BoardIcon from './icons/BoardIcon';
import PuzzleIcon from './icons/PuzzleIcon';

interface GameModeSelectorProps {
  section: PsalmSection;
  onSelectGameMode: (mode: GameMode) => void;
  onBack: () => void;
}

const GameCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-amber-50/50 backdrop-blur-sm border border-amber-200 rounded-lg shadow-md p-6 text-center hover:bg-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center h-full"
  >
    <div className="text-amber-600 mb-4">{icon}</div>
    <h2 className="text-2xl font-bold text-amber-800 mb-2">{title}</h2>
    <p className="text-stone-600 flex-grow">{description}</p>
  </button>
);

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ section, onSelectGameMode, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">Choose a Game</h1>
        <p className="text-lg text-stone-600">
          You've selected <span className="font-bold text-amber-700">{section.hebrewLetter}</span> (Verses {section.startVerse}-{section.endVerse}). How would you like to study?
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GameCard
          icon={<KeyboardIcon className="w-16 h-16" />}
          title="Fill in the Blanks"
          description="Test your memory by typing the missing words. Or, try multiple choice for a different challenge!"
          onClick={() => onSelectGameMode(GameMode.FillInTheBlanks)}
        />
        <GameCard
          icon={<BoardIcon className="w-16 h-16" />}
          title="Verse Ascent"
          description="Race to the end of the section! Answer questions correctly to climb ladders, but be careful not to stumble."
          onClick={() => onSelectGameMode(GameMode.VerseAscent)}
        />
        <GameCard
          icon={<PuzzleIcon className="w-16 h-16" />}
          title="Word Weaver"
          description="Reconstruct each verse by placing the jumbled words in their correct order. A true test of your knowledge!"
          onClick={() => onSelectGameMode(GameMode.WordWeaver)}
        />
      </div>
      <div className="text-center mt-8">
        <button onClick={onBack} className="text-amber-700 hover:text-amber-900 font-semibold transition-colors">
          &larr; Back to Section Select
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;
