import { board01 } from "./board01";
import { board02 } from "./board02";
import { board03 } from "./board03";
import { board04 } from "./board04";
import { board05 } from "./board05";
import { board06 } from "./board06";
import { board07 } from "./board07";
import { board08 } from "./board08";
import { board09 } from "./board09";
import { board10 } from "./board10";
import { board11 } from "./board11";
import { board12 } from "./board12";
import { board13 } from "./board13";

export interface BoardData {
  id: string;
  name: string;
  board: string[][];
}

export const boards: BoardData[] = [
  {
    id: "board1",
    name: "Board 1",
    board: board01,
  },
  {
    id: "board2",
    name: "Board 2",
    board: board02,
  },
  {
    id: "board3",
    name: "Board 3",
    board: board03,
  },
  {
    id: "board4",
    name: "Board 4",
    board: board04,
  },
  {
    id: "board5",
    name: "Board 5",
    board: board05,
  },

  {
    id: "board6",
    name: "Board 6",
    board: board06,
  },
  {
    id: "board7",
    name: "Board 7",
    board: board07,
  },
  {
    id: "board8",
    name: "Board 8",
    board: board08,
  },
  {
    id: "board9",
    name: "Board 9",
    board: board09,
  },
  {
    id: "board10",
    name: "Board 10",
    board: board10,
  },
  {
    id: "board11",
    name: "Board 11",
    board: board11,
  },
  {
    id: "board12",
    name: "Board 12",
    board: board12,
  },
  {
    id: "board13",
    name: "Board 13",
    board: board13,
  },
];

export {
  board01,
  board02,
  board03,
  board04,
  board05,
  board06,
  board07,
  board08,
  board09,
  board10,
  board11,
  board12,
  board13,
};
