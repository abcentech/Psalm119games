import React, { useState, useMemo } from 'react';
import { PsalmSection, Verse } from '../../types';

interface GameProps {
  section: PsalmSection;
  onGameOver: (score: number) => void;
  onQuit: () => void;
}

const BOARD_SIZE = 25; // 5x5 grid

const VerseAscent: React.FC<GameProps> = ({ section, onGameOver, onQuit }) => {
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(-1); // Start off the board
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<{ verse: Verse; blank: string; options: string[] } | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [diceRoll, setDiceRoll] = useState(0);

  const boardLayout = useMemo(() => {
    const layout = Array.from({ length: BOARD_SIZE }, (_, index) => ({ type: 'normal', target: index }));
    // Add 4 ladders and 4 stumbles
    const specialIndices = Array.from({ length: BOARD_SIZE - 2 }, (_, i) => i + 1);
    const shuffled = specialIndices.sort(() => 0.5 - Math.random());
    
    for(let i = 0; i < 4; i++) layout[shuffled[i]].type = 'ladder';
    for(let i = 4; i < 8; i++) layout[shuffled[i]].type = 'stumble';
    
    return layout;
  }, []);

  const prepareQuestion = (verse: Verse) => {
    const words = verse.text.split(/\s+/);
    const potentialBlanks = words
      .map((w, i) => ({ word: w, index: i }))
      .filter(item => item.word.length > 3 && /^[a-zA-Z]+$/.test(item.word));
    
    if (potentialBlanks.length === 0) return null;

    const blankItem = potentialBlanks[Math.floor(Math.random() * potentialBlanks.length)];
    const blankWord = blankItem.word.replace(/[.,;:]/g, '');
    
    const allWords = section.verses.flatMap(v => v.text.split(/\s+/)).map(w => w.replace(/[.,;:]/g, '')).filter(w => w.length > 3 && /^[a-zA-Z]+$/.test(w) && w.toLowerCase() !== blankWord.toLowerCase());
    const distractors = [...new Set(allWords)].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [...distractors, blankWord].sort(() => 0.5 - Math.random());
    
    const verseWithBlank = words.map((w, i) => i === blankItem.index ? '_______' : w).join(' ');
    
    return { verse: { ...verse, text: verseWithBlank }, blank: blankWord, options };
  };
  
  const handleRollDice = () => {
    const roll = Math.floor(Math.random() * 4) + 1; // 1 to 4
    setDiceRoll(roll);
    let newPosition = playerPosition < 0 ? roll - 1 : playerPosition + roll;

    if (newPosition >= BOARD_SIZE) {
      newPosition = BOARD_SIZE - 1;
    }
    
    const randomVerse = section.verses[Math.floor(Math.random() * section.verses.length)];
    const question = prepareQuestion(randomVerse);

    if(question) {
        setCurrentQuestion(question);
        setPlayerPosition(newPosition);
        setShowQuestion(true);
    } else {
        // No question could be generated, just move
        setPlayerPosition(newPosition);
        if (newPosition === BOARD_SIZE - 1) {
            onGameOver(score + 50); // Bonus for finishing
        }
    }
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = answer.toLowerCase() === currentQuestion.blank.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      let finalPosition = playerPosition;
      if (isCorrect) {
        setScore(s => s + 20);
        if (boardLayout[playerPosition].type === 'ladder') {
          finalPosition = Math.min(playerPosition + 5, BOARD_SIZE - 1); // Jump forward 5 spaces
        }
      } else {
        setScore(s => Math.max(0, s - 5));
        if (boardLayout[playerPosition].type === 'stumble') {
          finalPosition = Math.max(playerPosition - 5, 0); // Fall back 5 spaces
        }
      }
      
      setPlayerPosition(finalPosition);
      setShowQuestion(false);
      setFeedback(null);
      setCurrentQuestion(null);
      setDiceRoll(0);

      if (finalPosition >= BOARD_SIZE - 1) {
        onGameOver(score + (isCorrect ? 20 : 0) + 50); // Bonus for finishing
      }
    }, 1000);
  };

  return (
    <div className="bg-amber-50/70 border border-amber-200 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-800">{section.hebrewLetter}</h1>
          <h2 className="text-xl text-stone-600">Verse Ascent</h2>
        </div>
        <div className="text-2xl font-bold text-stone-800">Score: {score}</div>
      </div>
      
      <div className="grid grid-cols-5 gap-2 p-4 bg-white/50 rounded-lg">
        {Array.from({length: BOARD_SIZE}).map((_, index) => (
          <div key={index} className={`relative aspect-square border-2 ${playerPosition === index ? 'border-amber-600 ring-4 ring-amber-500' : 'border-amber-200'} rounded-lg flex flex-col justify-center items-center p-1 text-center`}>
            <span className="font-bold text-lg text-stone-800">{index + 1}</span>
            {boardLayout[index].type === 'ladder' && <span className="text-2xl" role="img" aria-label="Ladder">🪜</span>}
            {boardLayout[index].type === 'stumble' && <span className="text-2xl text-red-500" role="img" aria-label="Stumble">💥</span>}
             {playerPosition === index && <div className="absolute w-6 h-6 bg-amber-500 rounded-full border-2 border-white shadow-lg animate-bounce" />}
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button onClick={handleRollDice} disabled={showQuestion || diceRoll > 0 || playerPosition >= BOARD_SIZE -1} className="bg-amber-600 text-white font-bold text-xl py-3 px-10 rounded-lg shadow-md hover:bg-amber-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400 disabled:bg-stone-400">
          {playerPosition >= BOARD_SIZE - 1 ? 'Finished!' : diceRoll > 0 ? `Rolled a ${diceRoll}` : 'Roll Dice'}
        </button>
      </div>

      {showQuestion && currentQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`bg-amber-50 rounded-lg p-8 max-w-lg w-full transform transition-transform ${feedback === 'correct' ? 'scale-105' : ''} ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>
            <p className="text-stone-600 mb-4 text-xl">Verse {currentQuestion.verse.verse}: "{currentQuestion.verse.text}"</p>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">What is the missing word?</h3>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)} className="w-full bg-amber-600 text-white font-bold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-amber-700 transition-colors focus:outline-none focus:ring-4 focus:ring-amber-400">
                  {opt}
                </button>
              ))}
            </div>
             {feedback && <div className={`mt-4 text-2xl font-bold text-center ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>{feedback === 'correct' ? 'Correct!' : 'Incorrect'}</div>}
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <button onClick={onQuit} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">Quit to Game Select</button>
      </div>
    </div>
  );
};

export default VerseAscent;
