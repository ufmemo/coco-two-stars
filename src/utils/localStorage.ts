import type { GameState, BoardStatus, StorageStatus } from "../types/board";
import { GAME_STATE_VERSION } from "../types/board";

const STORAGE_PREFIX = "two-star-game";
const BOARD_STATE_KEY = (boardId: string) =>
  `${STORAGE_PREFIX}-board-${boardId}`;
const BOARD_STATUS_KEY = "two-star-board-statuses";

/**
 * Checks if localStorage is available in the current environment
 * @returns true if localStorage is available and functional
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Saves game state for a specific board to localStorage
 * @param boardId - The ID of the board
 * @param state - The game state to save
 */
export function saveGameState(
  boardId: string,
  state: GameState
): StorageStatus {
  if (!isLocalStorageAvailable()) {
    return { success: false, error: "unavailable" };
  }

  try {
    const stateWithVersion = {
      ...state,
      version: GAME_STATE_VERSION,
      timestamp: Date.now(),
    };

    const serializedState = JSON.stringify(stateWithVersion);
    localStorage.setItem(BOARD_STATE_KEY(boardId), serializedState);

    // Update board status - map GameStatus to BoardStatus
    let boardStatus: BoardStatus["status"];
    switch (state.gameStatus) {
      case "not-started":
        boardStatus = "not-started";
        break;
      case "playing":
        boardStatus = "in-progress";
        break;
      case "won":
        boardStatus = "won";
        break;
      case "lost":
        boardStatus = "lost";
        break;
      default:
        boardStatus = "not-started";
    }
    updateBoardStatus(boardId, boardStatus);

    return { success: true };
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      return { success: false, error: "quota_exceeded" };
    }
    return { success: false, error: "unavailable" };
  }
}

/**
 * Loads game state for a specific board from localStorage
 * @param boardId - The ID of the board
 * @returns The game state or null if not found/invalid
 */
export function loadGameState(boardId: string): GameState | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const serializedState = localStorage.getItem(BOARD_STATE_KEY(boardId));
    if (!serializedState) {
      return null;
    }

    const state = JSON.parse(serializedState);

    // Validate the loaded state
    if (!isValidGameState(state)) {
      // Clean up corrupted data
      localStorage.removeItem(BOARD_STATE_KEY(boardId));
      return null;
    }

    return state;
  } catch {
    // Clean up corrupted data
    localStorage.removeItem(BOARD_STATE_KEY(boardId));
    return null;
  }
}

/**
 * Clears game state for a specific board
 * @param boardId - The ID of the board
 */
export function clearGameState(boardId: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(BOARD_STATE_KEY(boardId));
    updateBoardStatus(boardId, "not-started");
  } catch {
    // Silently fail - not critical
  }
}

/**
 * Clears all game states for all boards
 */
export function clearAllGameStates(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    // Get all keys that match our pattern
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    // Remove all matching keys
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Clear board statuses
    localStorage.removeItem(BOARD_STATUS_KEY);
  } catch {
    // Silently fail - not critical
  }
}

/**
 * Gets the status of all boards
 * @returns Array of board statuses
 */
export function getAllBoardStatuses(): BoardStatus[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const serializedStatuses = localStorage.getItem(BOARD_STATUS_KEY);
    if (!serializedStatuses) {
      return [];
    }

    const statuses = JSON.parse(serializedStatuses);

    // Validate the structure
    if (!Array.isArray(statuses)) {
      localStorage.removeItem(BOARD_STATUS_KEY);
      return [];
    }

    return statuses.filter(isValidBoardStatus);
  } catch {
    // Clean up corrupted data
    localStorage.removeItem(BOARD_STATUS_KEY);
    return [];
  }
}

/**
 * Validates a game state object
 * @param state - The state to validate
 * @param boardData - The board data to validate against (optional for basic validation)
 * @returns true if the state is valid
 */
export function validateGameState(
  state: unknown,
  boardData?: string[][]
): boolean {
  if (!isValidGameState(state)) {
    return false;
  }

  // If board data is provided, validate dimensions
  if (boardData) {
    const expectedRows = boardData.length;
    const expectedCols = boardData[0]?.length || 0;

    if (state.selectedCells.length !== expectedRows) {
      return false;
    }

    for (const row of state.selectedCells) {
      if (!Array.isArray(row) || row.length !== expectedCols) {
        return false;
      }

      // Check that all cells are booleans
      if (!row.every((cell: unknown) => typeof cell === "boolean")) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Internal helper to validate basic game state structure
 */
function isValidGameState(state: unknown): state is GameState {
  if (!state || typeof state !== "object") {
    return false;
  }

  const s = state as Record<string, unknown>;

  return (
    Array.isArray(s.selectedCells) &&
    (s.gameStatus === "not-started" ||
      s.gameStatus === "playing" ||
      s.gameStatus === "won" ||
      s.gameStatus === "lost") &&
    typeof s.timestamp === "number" &&
    typeof s.version === "number"
  );
}

/**
 * Internal helper to validate board status structure
 */
function isValidBoardStatus(status: unknown): status is BoardStatus {
  if (!status || typeof status !== "object") {
    return false;
  }

  const s = status as Record<string, unknown>;

  return (
    typeof s.boardId === "string" &&
    (s.status === "not-started" ||
      s.status === "in-progress" ||
      s.status === "won" ||
      s.status === "lost") &&
    (s.lastPlayed === undefined || typeof s.lastPlayed === "number")
  );
}

/**
 * Internal helper to update board status
 */
function updateBoardStatus(
  boardId: string,
  status: BoardStatus["status"]
): void {
  try {
    const statuses = getAllBoardStatuses();

    // Find existing status or create new one
    const existingStatusIndex = statuses.findIndex(
      (s) => s.boardId === boardId
    );

    const boardStatus: BoardStatus = {
      boardId,
      status,
      lastPlayed: Date.now(),
    };

    if (existingStatusIndex >= 0) {
      statuses[existingStatusIndex] = boardStatus;
    } else {
      statuses.push(boardStatus);
    }

    localStorage.setItem(BOARD_STATUS_KEY, JSON.stringify(statuses));
  } catch {
    // Silently fail - not critical
  }
}
