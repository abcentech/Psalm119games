import React, { useMemo, useState } from 'react';
import { PsalmSection } from '../../types';
import ProgressBar from '../ProgressBar';

interface GameProps {
  section: PsalmSection;
  onGameOver: (score: number) => void;
  onQuit: () => void;
}

interface VerseAsset {
  verse: { verse: number; text: string };
  cost: number;
}

const ValueTrader: React.FC<GameProps> = ({ section, onGameOver, onQuit }) => {
  const assets = useMemo<VerseAsset[]>(
    () =>
      section.verses.map(v => ({
        verse: v,
        cost: v.text.split(/\s+/).length * 5,
      })),
    [section]
  );

  const [position, setPosition] = useState(0);
  const [coins, setCoins] = useState(100);
  const [owned, setOwned] = useState<Set<number>>(new Set());
  const [diceRoll, setDiceRoll] = useState(0);
  const [message, setMessage] = useState('');

  const totalSquares = assets.length;
  const current = assets[position];

  const roll = () => {
    const rollValue = Math.floor(Math.random() * 3) + 1;
    setDiceRoll(rollValue);
    const newPos = position + rollValue;
    if (newPos >= totalSquares) {
      const ownedValue = Array.from(owned).reduce((sum, idx) => sum + assets[idx].cost, 0);
      onGameOver(coins + ownedValue);
    } else {
      setPosition(newPos);
      setMessage('');
    }
  };

  const buy = () => {
    if (owned.has(position) || coins < current.cost) return;
    const next = new Set(owned);
    next.add(position);
    setOwned(next);
    setCoins(c => c - current.cost);
    setMessage('Acquired this verse.');
  };

  const sell = () => {
    if (!owned.has(position)) return;
    const next = new Set(owned);
    next.delete(position);
    setOwned(next);
    setCoins(c => c + current.cost);
    setMessage('Sold this verse.');
  };

  return (
    <div className="bg-amber-50/70 border border-amber-200 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-bold text-amber-800">{section.hebrewLetter}</h1>
          <h2 className="text-xl text-stone-600">Value Trader</h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-stone-800">Coins: {coins}</div>
          <div className="text-sm text-stone-600">Position {position + 1}/{totalSquares}</div>
        </div>
      </div>
      <ProgressBar current={position} total={totalSquares - 1} showLabel />
      <div className="mt-4 p-4 bg-white/50 rounded-lg min-h-[120px]">
        <p className="text-stone-600 mb-2">Verse {current.verse.verse}: "{current.verse.text}"</p>
        <p className="text-stone-800 font-bold">Value: {current.cost} coins</p>
      </div>
      {message && <div className="text-center text-green-700 mt-2">{message}</div>}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={roll}
          disabled={diceRoll > 0}
          className="bg-amber-600 text-white font-bold text-lg py-2 px-6 rounded-lg shadow-md hover:bg-amber-700 transition-colors disabled:bg-stone-400"
        >
          {diceRoll > 0 ? `Rolled ${diceRoll}` : 'Roll Dice'}
        </button>
        {!owned.has(position) && coins >= current.cost && (
          <button
            onClick={buy}
            className="bg-green-600 text-white font-bold text-lg py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors"
          >
            Buy
          </button>
        )}
        {owned.has(position) && (
          <button
            onClick={sell}
            className="bg-red-600 text-white font-bold text-lg py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            Sell
          </button>
        )}
      </div>
      <div className="text-center mt-6">
        <button onClick={onQuit} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">Quit to Game Select</button>
      </div>
    </div>
  );
};

export default ValueTrader;

