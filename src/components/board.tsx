import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { calculateShadedCells } from "../utils/shader";
import type { CellStyle } from "../types/board";
import { Cell } from "./cell";
import {
  checkWinCondition,
  checkLossCondition,
  getRegionBlocks,
} from "../utils/game";
import { useGameState } from "../hooks/useGameState";
import { WinModal } from "./WinModal";
import { LossModal } from "./LossModal";

const SIZE_CONST = window.innerWidth < 400 ? "1.8em" : "3em";

type BoardProps = {
  board: string[][];
  boardId: string;
};

const INDEX_BACKGROUND = "#efefef";

export function Board({ board, boardId }: BoardProps) {
  // Modal visibility state
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);

  // Use the custom hook for state management with persistence
  const {
    selectedCells,
    gameStatus,
    updateSelectedCells,
    updateGameStatus,
    resetState,
    isLoading,
    error,
  } = useGameState(boardId, board);

  const regions = useMemo(() => getRegionBlocks(board), [board]);

  // Calculate shaded cells based on current selected cells
  const shadedCells = useMemo(() => {
    return calculateShadedCells(selectedCells, regions);
  }, [selectedCells, regions]);

  // Check for win and loss conditions and update game status
  useEffect(() => {
    const isWon = checkWinCondition(selectedCells, regions, board);
    const isLost = checkLossCondition(selectedCells, shadedCells);

    // Check if any cells are selected to determine if game has started
    const hasSelectedCells = selectedCells.some((row) =>
      row.some((cell) => cell)
    );

    let newStatus: "not-started" | "won" | "lost" | "playing";
    if (isWon) {
      newStatus = "won";
    } else if (isLost) {
      newStatus = "lost";
    } else if (hasSelectedCells) {
      newStatus = "playing";
    } else {
      newStatus = "not-started";
    }

    // Only update if status changed to avoid unnecessary re-renders
    if (gameStatus !== newStatus) {
      updateGameStatus(newStatus);
    }
  }, [
    selectedCells,
    shadedCells,
    regions,
    board,
    gameStatus,
    updateGameStatus,
  ]);

  // Show modals based on game status
  useEffect(() => {
    if (gameStatus === "won") {
      setShowWinModal(true);
    } else if (gameStatus === "lost") {
      setShowLossModal(true);
    }
  }, [gameStatus]);

  function onSelect(row: number, col: number) {
    // Disable moves when game is won or lost
    if (gameStatus === "won" || gameStatus === "lost") return;

    if (!selectedCells[row][col] && shadedCells[row][col]) return;

    updateSelectedCells((prev) => {
      const newSelectedCells = prev.map((rowArray) => [...rowArray]); // Deep copy
      newSelectedCells[row][col] = !newSelectedCells[row][col];
      return newSelectedCells;
    });
  }

  function RowCheck({ row }: { row: number }) {
    const checkedCount = selectedCells[row].filter(Boolean).length;
    return <StatusBlock value={checkedCount} />;
  }

  function ColCheck({ col }: { col: number }) {
    //if rows has 2 selection then set to true
    const checkedCount = selectedCells.filter((row) => row[col]).length;
    return <StatusBlock value={checkedCount} />;
  }

  function StatusBlock({ value }: { value: number }) {
    return (
      <OuterBlock>
        {value == 0 ? (
          <></>
        ) : value == 2 ? (
          <i
            className="fa-solid fa-check"
            style={{ color: "#28a745", fontSize: "1.6em", fontWeight: "bold" }}
          ></i>
        ) : (
          <i
            className="fa-solid fa-xmark"
            style={{ color: "#dc3545", fontSize: "1.6em", fontWeight: "bold" }}
          ></i>
        )}
      </OuterBlock>
    );
  }

  // Modal handlers
  const handleCloseWinModal = () => {
    setShowWinModal(false);
  };

  const handleCloseLossModal = () => {
    setShowLossModal(false);
  };

  const handlePlayAgain = () => {
    setShowWinModal(false);
    resetState();
  };

  const handleTryAgain = () => {
    setShowLossModal(false);
    resetState();
  };

  // Show loading state while restoring saved game
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingMessage>Loading saved game...</LoadingMessage>
      </LoadingContainer>
    );
  }

  return (
    <div>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Modals */}
      <WinModal
        isOpen={showWinModal}
        onClose={handleCloseWinModal}
        onPlayAgain={handlePlayAgain}
      />
      <LossModal
        isOpen={showLossModal}
        onClose={handleCloseLossModal}
        onTryAgain={handleTryAgain}
      />

      <BoardContainer>
        <div style={{ display: "flex" }}>
          <OuterBlock></OuterBlock>

          {board[board.length - 1].map((_, colIndex) => (
            <OuterBlock key={colIndex}>{colIndex + 1}</OuterBlock>
          ))}
        </div>
        {board.map((row, rowIndex) => (
          <div key={rowIndex}>
            <div style={{ display: "flex" }}>
              <OuterBlock
                key={rowIndex}
                style={{
                  background: INDEX_BACKGROUND,
                  border: `2px solid none`,
                }}
              >
                {rowIndex + 1}
              </OuterBlock>
              {row.map((_, colIndex) => (
                <Cell
                  key={colIndex}
                  cellStyle={cellStyle(rowIndex, colIndex)}
                  isSelected={selectedCells[rowIndex][colIndex]}
                  isShaded={shadedCells[rowIndex][colIndex]}
                  onSelect={() => onSelect(rowIndex, colIndex)}
                />
              ))}
              {rowIndex < board.length && <RowCheck row={rowIndex} />}
            </div>
          </div>
        ))}
        <div style={{ display: "flex" }}>
          <OuterBlock style={{ background: "none" }}></OuterBlock>
          {board[board.length - 1].map((_, colIndex) => (
            <ColCheck key={colIndex} col={colIndex} />
          ))}
        </div>
      </BoardContainer>
    </div>
  );

  function cellStyle(row: number, col: number): CellStyle {
    return {
      t: row === 0 || board[row - 1][col] !== board[row][col],
      r: col === board[0].length - 1 || board[row][col + 1] !== board[row][col],
      b: row === board.length - 1 || board[row + 1][col] !== board[row][col],
      l: col === 0 || board[row][col - 1] !== board[row][col],
    };
  }
}

const BoardContainer = styled.div`
  display: inline-block;
  margin: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #666;
  font-style: italic;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #dc3545;
  background-color: #f8d7da;
  border: 2px solid #dc3545;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const OuterBlock = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SIZE_CONST};
  height: ${SIZE_CONST};
  color: black;
  text-align: center;
  line-height: ${SIZE_CONST};
  border: 2px solid transparent;
`;
