import React, { useState, useCallback } from 'react';
import { GameState, PsalmSection, GameMode } from './types';
import { PSALM_119_DATA } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import LevelSelector from './components/LevelSelector';
import GameOverScreen from './components/GameOverScreen';
import GameModeSelector from './components/GameModeSelector';
import FillInTheBlanks from './components/games/FillInTheBlanks';
import VerseAscent from './components/games/VerseAscent';
import WordWeaver from './components/games/WordWeaver';


export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [selectedSection, setSelectedSection] = useState<PsalmSection | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [gameId, setGameId] = useState(0);

  const handleStart = useCallback(() => {
    setGameState(GameState.LevelSelect);
  }, []);

  const handleLevelSelect = useCallback((section: PsalmSection) => {
    setSelectedSection(section);
    setGameState(GameState.GameModeSelect);
  }, []);

  const handleGameModeSelect = useCallback((mode: GameMode) => {
    setSelectedGameMode(mode);
    setGameState(GameState.Playing);
    setGameId(prev => prev + 1);
  }, []);

  const handleBackToLevelSelect = useCallback(() => {
    setGameState(GameState.LevelSelect);
  }, []);

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
    setGameState(GameState.GameOver);
  }, []);

  const handleQuitGame = useCallback(() => {
    setGameState(GameState.GameModeSelect);
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (selectedSection && selectedGameMode !== null) {
      setGameState(GameState.Playing);
      setGameId(prev => prev + 1);
    } else {
      setGameState(GameState.LevelSelect);
    }
  }, [selectedSection, selectedGameMode]);

  const handleNextLevel = useCallback(() => {
    if (!selectedSection) {
      setGameState(GameState.LevelSelect);
      return;
    }
    const currentIndex = PSALM_119_DATA.findIndex(s => s.hebrewLetter === selectedSection.hebrewLetter);
    if (currentIndex !== -1 && currentIndex < PSALM_119_DATA.length - 1) {
      const nextSection = PSALM_119_DATA[currentIndex + 1];
      setSelectedSection(nextSection);
      setGameState(GameState.GameModeSelect);
    } else {
      setGameState(GameState.LevelSelect);
    }
  }, [selectedSection]);

  const handleGoToMenu = useCallback(() => {
    setGameState(GameState.LevelSelect);
  }, []);
  
  const handleGoHome = useCallback(() => {
    setGameState(GameState.Welcome);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.LevelSelect:
        return <LevelSelector onSelectLevel={handleLevelSelect} onBack={handleGoHome} />;
      
      case GameState.GameModeSelect:
        if (selectedSection) {
          return <GameModeSelector section={selectedSection} onSelectGameMode={handleGameModeSelect} onBack={handleBackToLevelSelect} />;
        }
        return <LevelSelector onSelectLevel={handleLevelSelect} onBack={handleGoHome} />;

      case GameState.Playing:
        if (selectedSection && selectedGameMode !== null) {
          const gameProps = {
            key: gameId,
            section: selectedSection,
            onGameOver: handleGameOver,
            onQuit: handleQuitGame,
          };
          switch(selectedGameMode) {
            case GameMode.FillInTheBlanks:
              return <FillInTheBlanks {...gameProps} />;
            case GameMode.VerseAscent:
              return <VerseAscent {...gameProps} />;
            case GameMode.WordWeaver:
              return <WordWeaver {...gameProps} />;
            default:
              return <GameModeSelector section={selectedSection} onSelectGameMode={handleGameModeSelect} onBack={handleBackToLevelSelect} />;
          }
        }
        return <LevelSelector onSelectLevel={handleLevelSelect} onBack={handleGoHome} />;

      case GameState.GameOver:
        const currentIndex = selectedSection ? PSALM_119_DATA.findIndex(s => s.hebrewLetter === selectedSection.hebrewLetter) : -1;
        const isLastLevel = currentIndex === PSALM_119_DATA.length - 1;
        return <GameOverScreen score={finalScore} onPlayAgain={handlePlayAgain} onNextLevel={handleNextLevel} onGoToMenu={handleGoToMenu} isLastLevel={isLastLevel} />;
      
      case GameState.Welcome:
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 text-stone-800 flex items-center justify-center p-4 font-serif">
      <div className="w-full max-w-4xl mx-auto">
        {renderContent()}
      </div>
    </main>
  );
}
