export enum GameState {
  Welcome,
  LevelSelect,
  GameModeSelect,
  Playing,
  GameOver,
}

export enum GameMode {
  FillInTheBlanks,
  VerseAscent,
  WordWeaver,
}

export interface Verse {
  verse: number;
  text: string;
}

export interface PsalmSection {
  hebrewLetter: string;
  startVerse: number;
  endVerse: number;
  verses: Verse[];
}
