// WordConnectGameTypes.ts

export interface WordConnectGameProps {
    words: string[];
    onComplete?: () => void;
  }
  
  export interface Position {
    x: number;
    y: number;
  }
  
  export interface GameState {
    current: string;
    found: string[];
    isDragging: boolean;
  }