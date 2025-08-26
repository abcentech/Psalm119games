
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PsalmSection, Verse } from '../types';

interface GameScreenProps {
  section: PsalmSection;
  onGameOver: (score: number) => void;
  onQuit: () => void;
}

interface PreparedWord {
  original: string;
  answer: string;
  isBlank: boolean;
}

interface PreparedVerse {
  verseInfo: Verse;
  words: PreparedWord[];
  blanks: string[];
}

const BLANKS_PER_VERSE = 2;

const prepareVerse = (verse: Verse): PreparedVerse => {
  const words = verse.text.split(/\s+/);
  const potentialBlankIndices = words
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => word.length > 4 && /^[a-zA-Z]+$/.test(word))
    .map(({ index }) => index);

  const shuffled = potentialBlankIndices.sort(() => 0.5 - Math.random());
  const blankIndicesSet = new Set(shuffled.slice(0, Math.min(shuffled.length, BLANKS_PER_VERSE)));

  const preparedWords: PreparedWord[] = words.map((word, index) => {
    const isBlank = blankIndicesSet.has(index);
    return {
      original: word,
      answer: word.replace(/[.,;:]/g, ''),
      isBlank,
    };
  });
  
  const blanks = preparedWords.filter(w => w.isBlank).map(w => w.answer);

  return { verseInfo: verse, words: preparedWords, blanks };
};


const GameScreen: React.FC<GameScreenProps> = ({ section, onGameOver, onQuit }) => {
  const [score, setScore] = useState(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const preparedVerses = useMemo(() => section.verses.map(prepareVerse), [section]);

  const currentVerseData = preparedVerses[currentVerseIndex];
  const totalBlanksInVerse = currentVerseData.blanks.length;
  const currentTargetWord = totalBlanksInVerse > 0 ? currentVerseData.blanks[currentBlankIndex] : '';

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentVerseIndex, currentBlankIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setFeedback(null);
  };
  
  const showFeedback = (type: 'correct' | 'incorrect') => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (userInput.trim().toLowerCase() === currentTargetWord.toLowerCase()) {
      setScore(s => s + 10);
      showFeedback('correct');
      setUserInput('');

      if (currentBlankIndex < totalBlanksInVerse - 1) {
        setCurrentBlankIndex(b => b + 1);
      } else {
        if (currentVerseIndex < preparedVerses.length - 1) {
          setCurrentVerseIndex(v => v + 1);
          setCurrentBlankIndex(0);
        } else {
          onGameOver(score + 10);
        }
      }
    } else {
      setScore(s => Math.max(0, s - 2));
      showFeedback('incorrect');
    }
  };
  
  const getBlankStyle = (feedback: 'correct' | 'incorrect' | null) => {
    if (feedback === 'correct') return 'border-green-500 ring-green-500';
    if (feedback === 'incorrect') return 'border-red-500 ring-red-500 animate-shake';
    return 'border-amber-400 focus:ring-amber-500';
  };

  return (
    <div className="bg-amber-50/70 border border-amber-200 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-3xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-amber-800">{section.hebrewLetter}</h1>
            <div className="text-right">
                <div className="text-2xl font-bold text-stone-800">Score: {score}</div>
                <div className="text-sm text-stone-600">Verse {currentVerseData.verseInfo.verse}</div>
            </div>
        </div>

        <div className="bg-white/50 rounded-lg p-6 mb-6 text-2xl leading-relaxed text-stone-700 min-h-[120px]">
            {currentVerseData.words.map((word, index) => {
                if (!word.isBlank) {
                    return <span key={index}>{word.original} </span>;
                }
                const blankIndexInVerse = currentVerseData.words.slice(0, index + 1).filter(w => w.isBlank).length - 1;
                if (blankIndexInVerse < currentBlankIndex) {
                    return <span key={index} className="font-bold text-green-700">{word.original} </span>;
                }
                const placeholder = '_______';
                return <span key={index} className={`font-bold ${blankIndexInVerse === currentBlankIndex ? 'text-amber-600' : 'text-stone-400'}`}>{placeholder} </span>;
            })}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the missing word..."
            className={`w-full p-4 text-xl border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${getBlankStyle(feedback)}`}
            disabled={totalBlanksInVerse === 0}
            />
          <button type="submit" className="w-full mt-4 bg-amber-600 text-white font-bold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-amber-700 transition-colors focus:outline-none focus:ring-4 focus:ring-amber-400 disabled:bg-gray-400" disabled={totalBlanksInVerse === 0}>
            Submit Answer
          </button>
        </form>
        {totalBlanksInVerse === 0 && (
             <div className="text-center text-stone-600 mt-4 p-4 bg-amber-100 rounded-lg">
                <p>This verse has no missing words. Let's move to the next one!</p>
                <button onClick={() => {
                     if (currentVerseIndex < preparedVerses.length - 1) {
                        setCurrentVerseIndex(v => v + 1);
                        setCurrentBlankIndex(0);
                      } else {
                        onGameOver(score);
                      }
                }} className="mt-2 text-amber-700 font-bold">Continue</button>
             </div>
        )}

        <div className="text-center mt-6">
            <button onClick={onQuit} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">Quit to Level Select</button>
        </div>
    </div>
  );
};

export default GameScreen;
