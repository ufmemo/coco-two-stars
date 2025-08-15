import { board1 } from "./board1";
import { board2 } from "./board2";
import { board3 } from "./board3";
import { board4 } from "./board4";
import { board5 } from "./board5";

export interface BoardData {
  id: string;
  name: string;
  board: string[][];
}

export const boards: BoardData[] = [
  {
    id: "board1",
    name: "Board 1",
    board: board1,
  },
  {
    id: "board2",
    name: "Board 2",
    board: board2,
  },
  {
    id: "board3",
    name: "Board 3",
    board: board3,
  },
  {
    id: "board4",
    name: "Board 4",
    board: board4,
  },
  {
    id: "board5",
    name: "Board 5",
    board: board5,
  },
];

export { board1, board2, board3, board4, board5 };
