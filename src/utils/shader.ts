import type { RegionMap } from "../types/board";

// Helper functions for shading calculations
function createInitialShadedGrid(selectedCells: boolean[][]): boolean[][] {
  return selectedCells.map((row) => Array(row.length).fill(false));
}

function countSelectedCellsInRegion(
  selectedCells: boolean[][],
  regionCells: { row: number; col: number }[]
): number {
  let count = 0;
  for (const cell of regionCells) {
    if (selectedCells[cell.row][cell.col]) {
      count++;
    }
  }
  return count;
}

function applyRegionBasedShading(
  shaded: boolean[][],
  selectedCells: boolean[][],
  regions: RegionMap
): void {
  for (const regionKey in regions) {
    const region = regions[regionKey];
    const selectedCount = countSelectedCellsInRegion(
      selectedCells,
      region.cells
    );

    // If region has exactly two selections, shade the entire region
    if (selectedCount === 2) {
      for (const cell of region.cells) {
        shaded[cell.row][cell.col] = true;
      }
    }
  }
}

function isAdjacentToSelectedCell(
  row: number,
  col: number,
  selectedCells: boolean[][]
): boolean {
  const rows = selectedCells.length;
  const cols = selectedCells[0].length;

  // Check all 8 adjacent cells (including diagonals)
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // Skip current cell

      const newRow = row + dr;
      const newCol = col + dc;

      // Check bounds and if adjacent cell is selected
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        selectedCells[newRow][newCol]
      ) {
        return true;
      }
    }
  }
  return false;
}

function applyColumnBasedShading(
  shaded: boolean[][],
  selectedCells: boolean[][]
): void {
  const rows = selectedCells.length;
  const cols = selectedCells[0].length;

  // Check each column
  for (let col = 0; col < cols; col++) {
    let selectedCount = 0;

    // Count selected cells in this column
    for (let row = 0; row < rows; row++) {
      if (selectedCells[row][col]) {
        selectedCount++;
      }
    }

    // If column has exactly 2 selections, shade the entire column
    if (selectedCount === 2) {
      for (let row = 0; row < rows; row++) {
        shaded[row][col] = true;
      }
    }
  }
}

function applyRowBasedShading(
  shaded: boolean[][],
  selectedCells: boolean[][]
): void {
  const rows = selectedCells.length;
  const cols = selectedCells[0].length;

  // Check each row
  for (let row = 0; row < rows; row++) {
    let selectedCount = 0;

    // Count selected cells in this row
    for (let col = 0; col < cols; col++) {
      if (selectedCells[row][col]) {
        selectedCount++;
      }
    }

    // If row has exactly 2 selections, shade the entire row
    if (selectedCount === 2) {
      for (let col = 0; col < cols; col++) {
        shaded[row][col] = true;
      }
    }
  }
}

function applyAdjacencyBasedShading(
  shaded: boolean[][],
  selectedCells: boolean[][]
): void {
  const rows = selectedCells.length;
  const cols = selectedCells[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Check if current cell is selected
      if (selectedCells[row][col]) {
        shaded[row][col] = true;
        continue;
      }

      // Skip if already shaded by region rule
      if (shaded[row][col]) {
        continue;
      }

      // Check if adjacent to any selected cell
      if (isAdjacentToSelectedCell(row, col, selectedCells)) {
        shaded[row][col] = true;
      }
    }
  }
}

export function calculateShadedCells(
  selectedCells: boolean[][],
  regions: RegionMap
): boolean[][] {
  const shaded = createInitialShadedGrid(selectedCells);

  // Apply region-based shading (regions with exactly 2 selections)
  applyRegionBasedShading(shaded, selectedCells, regions);

  // Apply column-based shading (columns with exactly 2 selections)
  applyColumnBasedShading(shaded, selectedCells);

  // Apply row-based shading (rows with exactly 2 selections)
  applyRowBasedShading(shaded, selectedCells);

  // Apply adjacency-based shading (selected cells and their neighbors)
  applyAdjacencyBasedShading(shaded, selectedCells);

  return shaded;
}
