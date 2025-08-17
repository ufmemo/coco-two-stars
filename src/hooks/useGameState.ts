import { useState, useEffect, useCallback, useRef } from "react";
import type { GameStatus } from "../types/board";
import {
  saveGameState,
  loadGameState,
  clearGameState,
  validateGameState,
} from "../utils/localStorage";

interface UseGameStateReturn {
  selectedCells: boolean[][];
  gameStatus: GameStatus;
  saveState: () => boolean;
  loadState: () => boolean;
  resetState: () => void;
  isLoading: boolean;
  error: string | null;
  updateSelectedCells: (updater: (prev: boolean[][]) => boolean[][]) => void;
  updateGameStatus: (status: GameStatus) => void;
}

/**
 * Custom hook for managing game state with persistence
 * @param boardId - Unique identifier for the board
 * @param initialBoard - The initial board configuration
 * @returns Object containing game state and methods to manage it
 */
export function useGameState(
  boardId: string,
  initialBoard: string[][]
): UseGameStateReturn {
  // Initialize selectedCells with the same dimensions as the board
  const createInitialSelectedCells = useCallback(
    () => initialBoard.map((row) => Array(row.length).fill(false)),
    [initialBoard]
  );

  const [selectedCells, setSelectedCells] = useState<boolean[][]>(
    createInitialSelectedCells
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>("not-started");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if auto-save should be enabled (after initial load)
  const autoSaveEnabled = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);

  // Auto-save with debouncing (300ms delay)
  const debouncedSave = useCallback(() => {
    if (!autoSaveEnabled.current) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      const result = saveGameState(boardId, {
        selectedCells,
        gameStatus,
        timestamp: Date.now(),
        version: 1,
      });

      if (!result.success) {
        setError(
          result.error === "quota_exceeded"
            ? "Storage full - game progress cannot be saved"
            : result.error === "unavailable"
            ? "Storage unavailable - game progress cannot be saved"
            : "Failed to save game progress"
        );
      } else {
        setError(null);
      }
    }, 300);
  }, [boardId, selectedCells, gameStatus]);

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = () => {
      setIsLoading(true);
      setError(null);

      try {
        const savedState = loadGameState(boardId);

        if (savedState && validateGameState(savedState, initialBoard)) {
          // Validate dimensions match current board
          if (
            savedState.selectedCells.length === initialBoard.length &&
            savedState.selectedCells.every(
              (row, i) => row.length === initialBoard[i].length
            )
          ) {
            setSelectedCells(savedState.selectedCells);
            setGameStatus(savedState.gameStatus);
          } else {
            // Clear corrupted state that doesn't match current board
            clearGameState(boardId);
          }
        }
      } catch (err) {
        setError("Failed to load saved game");
        console.warn("Error loading game state:", err);
      } finally {
        setIsLoading(false);
        // Enable auto-save after initial load is complete
        autoSaveEnabled.current = true;
      }
    };

    loadSavedState();
  }, [boardId, initialBoard]);

  // Auto-save when state changes (after initial load)
  useEffect(() => {
    debouncedSave();

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [debouncedSave]);

  // Manual save function
  const saveState = useCallback((): boolean => {
    const result = saveGameState(boardId, {
      selectedCells,
      gameStatus,
      timestamp: Date.now(),
      version: 1,
    });

    if (!result.success) {
      setError(
        result.error === "quota_exceeded"
          ? "Storage full - game progress cannot be saved"
          : result.error === "unavailable"
          ? "Storage unavailable - game progress cannot be saved"
          : "Failed to save game progress"
      );
      return false;
    }

    setError(null);
    return true;
  }, [boardId, selectedCells, gameStatus]);

  // Manual load function
  const loadState = useCallback((): boolean => {
    try {
      const savedState = loadGameState(boardId);

      if (savedState && validateGameState(savedState, initialBoard)) {
        // Validate dimensions match current board
        if (
          savedState.selectedCells.length === initialBoard.length &&
          savedState.selectedCells.every(
            (row, i) => row.length === initialBoard[i].length
          )
        ) {
          setSelectedCells(savedState.selectedCells);
          setGameStatus(savedState.gameStatus);
          setError(null);
          return true;
        } else {
          // Clear corrupted state that doesn't match current board
          clearGameState(boardId);
          setError("Saved game data is incompatible with current board");
          return false;
        }
      }

      return false;
    } catch (err) {
      setError("Failed to load saved game");
      console.warn("Error loading game state:", err);
      return false;
    }
  }, [boardId, initialBoard]);

  // Reset state function
  const resetState = useCallback(() => {
    // Temporarily disable auto-save during reset
    const wasAutoSaveEnabled = autoSaveEnabled.current;
    autoSaveEnabled.current = false;

    setSelectedCells(createInitialSelectedCells());
    setGameStatus("not-started");
    setError(null);

    // Clear saved state
    clearGameState(boardId);

    // Re-enable auto-save
    autoSaveEnabled.current = wasAutoSaveEnabled;
  }, [boardId, createInitialSelectedCells]);

  // Provide method to update selected cells (for use by Board component)
  const updateSelectedCells = useCallback(
    (updater: (prev: boolean[][]) => boolean[][]) => {
      setSelectedCells(updater);
    },
    []
  );

  // Provide method to update game status (for use by Board component)
  const updateGameStatus = useCallback((status: GameStatus) => {
    setGameStatus(status);
  }, []);

  return {
    selectedCells,
    gameStatus,
    saveState,
    loadState,
    resetState,
    isLoading,
    error,
    updateSelectedCells,
    updateGameStatus,
  };
}
