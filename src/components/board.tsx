import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";

import { calculateShadedCells } from "../utils/shader";
import type { CellStyle, GameStatus } from "../types/board";
import { Cell } from "./cell";
import { checkWinCondition, getRegionBlocks } from "../utils/game";

const SIZE_CONST = window.innerWidth < 400 ? "1.8em" : "3em";

type BoardProps = {
  board: string[][];
};

const INDEX_BACKGROUND = "#efefef";

export function Board({ board }: BoardProps) {
  const [selectedCells, setSelectedCells] = useState<boolean[][]>(
    board.map((row) => Array(row.length).fill(false))
  );
  const [shadedCells, setShadedCells] = useState<boolean[][]>(
    board.map((row) => Array(row.length).fill(false))
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");

  const regions = useMemo(() => getRegionBlocks(board), [board]);

  useEffect(() => {
    const newShadedCells = calculateShadedCells(selectedCells, regions);
    setShadedCells(newShadedCells);

    // Check for win condition
    const isWon = checkWinCondition(selectedCells, regions, board);

    console.log("Win condition checked:", isWon);

    setGameStatus(isWon ? "won" : "playing");
  }, [selectedCells, regions, board]);

  function onSelect(row: number, col: number) {
    // Disable moves when game is won
    if (gameStatus === "won") return;

    if (!selectedCells[row][col] && shadedCells[row][col]) return;

    setSelectedCells((prev) => {
      const newSelectedCells = prev.map((row) => [...row]); // Deep copy
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

  return (
    <div>
      {gameStatus === "won" && <WinMessage>You Win! 🎉</WinMessage>}
      <BoardContainer>
        <div style={{ display: "flex" }}>
          <OuterBlock></OuterBlock>

          {board[board.length - 1].map((_, colIndex) => (
            <OuterBlock key={colIndex}>{colIndex + 1}</OuterBlock>
          ))}
        </div>
        {board.map((row, rowIndex) => (
          <>
            <div key={rowIndex} style={{ display: "flex" }}>
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
          </>
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

const WinMessage = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #2d5a27;
  margin-bottom: 16px;
  background-color: #d4edda;
  border: 2px solid #2d5a27;
  border-radius: 8px;
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
