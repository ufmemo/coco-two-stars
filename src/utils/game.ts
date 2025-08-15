import type { RegionMap } from "../types/board";

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

export function checkWinCondition(
  selected: boolean[][],
  regions: RegionMap,
  board: string[][]
): boolean {
  // Check if all regions have exactly 2 stars
  for (const regionKey in regions) {
    const region = regions[regionKey];
    const starsInRegion = region.cells.filter(
      (cell) => selected[cell.row][cell.col]
    ).length;
    if (starsInRegion !== 2) {
      return false;
    }
  }

  // Check if all rows have exactly 2 stars
  for (let row = 0; row < board.length; row++) {
    const starsInRow = selected[row].filter(Boolean).length;
    if (starsInRow !== 2) {
      return false;
    }
  }

  // Check if all columns have exactly 2 stars
  for (let col = 0; col < board[0].length; col++) {
    const starsInCol = selected.filter((row) => row[col]).length;
    if (starsInCol !== 2) {
      return false;
    }
  }

  return true;
}
