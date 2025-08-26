import React, { useState, useMemo, useEffect } from 'react';
import { PsalmSection } from '../../types';

interface GameProps {
  section: PsalmSection;
  onGameOver: (score: number) => void;
  onQuit: () => void;
}

const WordWeaver: React.FC<GameProps> = ({ section, onGameOver, onQuit }) => {
  const [score, setScore] = useState(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [wordBank, setWordBank] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isClueUsed, setIsClueUsed] = useState(false);

  const currentVerse = section.verses[currentVerseIndex];
  const correctWords = useMemo(() => currentVerse.text.split(/\s+/), [currentVerse]);
  const clueText = useMemo(() => correctWords.slice(0, 3).join(' ') + '...', [correctWords]);

  useEffect(() => {
    setAnswer([]);
    setWordBank([...correctWords].sort(() => 0.5 - Math.random()));
    setFeedback(null);
    setIsClueUsed(false);
  }, [currentVerseIndex, correctWords]);
  
  const handleWordClick = (word: string, source: 'bank' | 'answer', index: number) => {
    if (source === 'bank') {
      setAnswer([...answer, word]);
      const newBank = [...wordBank];
      newBank.splice(index, 1);
      setWordBank(newBank);
    } else {
      setWordBank([...wordBank, word]);
      const newAnswer = [...answer];
      newAnswer.splice(index, 1);
      setAnswer(newAnswer);
    }
    setFeedback(null);
  };
  
  const handleSubmit = () => {
    const isCorrect = answer.join(' ') === correctWords.join(' ');
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if(isCorrect) {
        setScore(s => s + 25);
        setTimeout(() => {
            if (currentVerseIndex < section.verses.length - 1) {
                setCurrentVerseIndex(v => v + 1);
            } else {
                onGameOver(score + 25);
            }
        }, 1200);
    } else {
        setScore(s => Math.max(0, s - 5));
        setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleGetClue = () => {
    if (!isClueUsed) {
      setIsClueUsed(true);
      setScore(s => Math.max(0, s - 10)); // Penalty for using a clue
    }
  };

  const getAnswerBoxStyle = () => {
    if (feedback === 'correct') return 'border-green-500';
    if (feedback === 'incorrect') return 'border-red-500 animate-shake';
    return 'border-amber-300';
  };

  return (
    <div className="bg-amber-50/70 border border-amber-200 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-800">{section.hebrewLetter}</h1>
          <h2 className="text-xl text-stone-600">Word Weaver</h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-stone-800">Score: {score}</div>
          <div className="text-sm text-stone-600">Verse {currentVerse.verse}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-stone-600 text-lg">Arrange the words to form the verse.</p>
        <button onClick={handleGetClue} disabled={isClueUsed} className="bg-stone-200 text-stone-700 font-semibold py-1 px-3 rounded-md text-sm hover:bg-stone-300 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed">
          Get a Clue (-10 pts)
        </button>
      </div>

      {isClueUsed && (
        <div className="bg-amber-100/50 border border-amber-200 p-2 rounded-lg text-center mb-4">
          <span className="font-semibold text-amber-800">Clue:</span> <span className="text-stone-700 italic">{clueText}</span>
        </div>
      )}

      <div className={`bg-white/60 rounded-lg p-4 mb-4 border-2 min-h-[100px] flex flex-wrap gap-2 items-center justify-center transition-colors ${getAnswerBoxStyle()}`}>
        {answer.map((word, index) => (
          <button key={`${word}-${index}`} onClick={() => handleWordClick(word, 'answer', index)} className="bg-amber-200 text-amber-900 font-semibold py-2 px-4 rounded-md shadow-sm text-lg">
            {word}
          </button>
        ))}
        {answer.length === 0 && <span className="text-stone-400">Click words below to add them here</span>}
      </div>

      <div className="bg-white/40 rounded-lg p-4 mb-6 min-h-[100px] flex flex-wrap gap-2 items-center justify-center">
        {wordBank.map((word, index) => (
          <button key={`${word}-${index}`} onClick={() => handleWordClick(word, 'bank', index)} className="bg-stone-200 text-stone-800 font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-stone-300 transition-colors text-lg">
            {word}
          </button>
        ))}
      </div>
      
       {feedback === 'correct' && (
        <div className="text-center text-2xl font-bold text-green-600 my-4">
            Correct! Well done!
        </div>
       )}

      <button onClick={handleSubmit} disabled={wordBank.length > 0 || feedback === 'correct'} className="w-full bg-amber-600 text-white font-bold text-xl py-3 px-10 rounded-lg shadow-md hover:bg-amber-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400 disabled:bg-stone-400 disabled:cursor-not-allowed">
        Check Answer
      </button>

      <div className="text-center mt-6">
        <button onClick={onQuit} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">Quit to Game Select</button>
      </div>
    </div>
  );
};

export default WordWeaver;
