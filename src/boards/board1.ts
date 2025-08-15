import type { RegionMap } from "../types/board";

export const board1 = [
  ["A", "A", "A", "A", "A", "A", "A", "A", "B", "B"],
  ["A", "A", "A", "A", "A", "A", "C", "A", "B", "B"],
  ["D", "E", "E", "E", "A", "C", "C", "C", "B", "B"],
  ["D", "D", "D", "D", "F", "G", "G", "C", "B", "B"],
  ["D", "D", "D", "F", "F", "F", "G", "G", "B", "B"],
  ["D", "D", "H", "F", "F", "F", "G", "G", "B", "B"],
  ["D", "D", "H", "H", "H", "G", "G", "G", "I", "B"],
  ["D", "D", "D", "D", "D", "D", "G", "G", "I", "B"],
  ["D", "J", "J", "J", "J", "J", "J", "J", "I", "I"],
  ["J", "J", "J", "J", "J", "J", "J", "J", "J", "I"],
];

export function getRegionBlocks(board: string[][]): RegionMap {
  const regions: RegionMap = {};

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (!regions[cell]) {
        regions[cell] = { cells: [] };
      }
      regions[cell].cells.push({ row, col });
    }
  }

  return regions;
}
