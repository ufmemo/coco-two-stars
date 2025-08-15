import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { getRegionBlocks } from "../boards/board1";
import { calculateShadedCells } from "../utils/shader";
import type { CellStyle } from "../types/board";
import { Cell } from "./cell";

type BoardProps = {
  board: string[][];
};

export function Board({ board }: BoardProps) {
  const [selectedCells, setSelectedCells] = useState<boolean[][]>(
    board.map((row) => Array(row.length).fill(false))
  );
  const [shadedCells, setShadedCells] = useState<boolean[][]>(
    board.map((row) => Array(row.length).fill(false))
  );

  const regions = useMemo(() => getRegionBlocks(board), [board]);

  useEffect(() => {
    const newShadedCells = calculateShadedCells(selectedCells, regions);
    setShadedCells(newShadedCells);
  }, [selectedCells, regions]);

  function isSelectionAllowed(row: number, col: number): boolean {
    // Selections cannot be made on previously shaded cells
    return !shadedCells[row][col];
  }

  function onSelect(row: number, col: number) {
    if (!selectedCells[row][col] && !isSelectionAllowed(row, col)) return;

    setSelectedCells((prev) => {
      const newSelectedCells = prev.map((row) => [...row]); // Deep copy
      newSelectedCells[row][col] = !newSelectedCells[row][col];
      return newSelectedCells;
    });
  }

  return (
    <BoardContainer>
      {board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((_, colIndex) => (
            <Cell
              key={colIndex}
              cellStyle={cellStyle(rowIndex, colIndex)}
              isSelected={selectedCells[rowIndex][colIndex]}
              isShaded={shadedCells[rowIndex][colIndex]}
              onSelect={() => onSelect(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </BoardContainer>
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
  padding: 12px;
`;
