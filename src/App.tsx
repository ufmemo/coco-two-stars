import { useState } from "react";
import styled from "styled-components";
import "./App.css";
import { Board } from "./components/board";
import { boards, type BoardData } from "./boards";

function App() {
  const [currentBoard, setCurrentBoard] = useState<BoardData>(boards[0]);
  const [boardKey, setBoardKey] = useState(0); // Force Board remount when new game is started

  const handleBoardChange = (boardId: string) => {
    const newBoard = boards.find((b) => b.id === boardId);
    if (newBoard) {
      setCurrentBoard(newBoard);
      setBoardKey((prev) => prev + 1); // Force remount of Board component
    }
  };

  const handleNewGame = () => {
    setBoardKey((prev) => prev + 1); // Force remount of Board component to reset state
  };

  return (
    <AppContainer>
      <Header>
        <Title>Two Stars Game</Title>
        <CurrentBoard>Playing: {currentBoard.name}</CurrentBoard>
      </Header>

      <Controls>
        <ControlGroup>
          <Label htmlFor="board-select">Choose Board:</Label>
          <BoardSelect
            id="board-select"
            value={currentBoard.id}
            onChange={(e) => handleBoardChange(e.target.value)}
          >
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </BoardSelect>
        </ControlGroup>

        <NewGameButton onClick={handleNewGame}>New Game</NewGameButton>
      </Controls>

      <Board key={boardKey} board={currentBoard.board} />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 8px;
`;

const CurrentBoard = styled.div`
  color: #666;
  font-size: 18px;
  font-weight: 500;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const BoardSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2d5a27;
  }
`;

const NewGameButton = styled.button`
  padding: 8px 16px;
  background-color: #2d5a27;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1e3d1a;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export default App;
