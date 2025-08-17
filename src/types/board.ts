export type Cell = {
  row: number;
  col: number;
};

export type RegionMap = {
  [key: string]: { cells: Cell[] };
};

export type CellStyle = { t: boolean; r: boolean; b: boolean; l: boolean };

export type GameStatus = "not-started" | "playing" | "won" | "lost";

// New types for state management
export interface GameState {
  selectedCells: boolean[][];
  gameStatus: GameStatus;
  timestamp: number;
  version: number;
}

export interface BoardStatus {
  boardId: string;
  status: "not-started" | "in-progress" | "won" | "lost";
  lastPlayed?: number;
}

export type StorageStatus =
  | { success: true }
  | {
      success: false;
      error:
        | "quota_exceeded"
        | "corrupted_data"
        | "unavailable"
        | "invalid_data";
    };

// Version constant for data migration
export const GAME_STATE_VERSION = 1;
