export type Cell = {
  row: number;
  col: number;
};

export type RegionMap = {
  [key: string]: { cells: Cell[] };
};

export type CellStyle = { t: boolean; r: boolean; b: boolean; l: boolean };
