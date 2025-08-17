import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Board } from "./board";
import { boards, type BoardData } from "../boards";
import { clearGameState } from "../utils/localStorage";

export function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentBoard, setCurrentBoard] = useState<BoardData | null>(null);
  const [boardKey, setBoardKey] = useState(0);

  useEffect(() => {
    if (id) {
      const board = boards.find((b) => b.id === id);
      if (board) {
        setCurrentBoard(board);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [id, navigate]);

  const handleNewGame = () => {
    if (currentBoard) {
      // Clear the saved game state
      clearGameState(currentBoard.id);
      // Force re-render of Board component to reset state
      setBoardKey((prev) => prev + 1);
    }
  };

  if (!currentBoard) {
    return <div>Loading...</div>;
  }

  return (
    <BoardPageContainer>
      <Header>
        <BackLink to="/">← Back to Board Selection</BackLink>
        <Title>Two Stars Game</Title>
        <CurrentBoard>Playing: {currentBoard.name}</CurrentBoard>
      </Header>

      <NewGameButton onClick={handleNewGame}>New Game</NewGameButton>
      <Board
        key={boardKey}
        board={currentBoard.board}
        boardId={currentBoard.id}
      />
    </BoardPageContainer>
  );
}

const BoardPageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 20px;
  @media (max-width: 768px) {
    margin-bottom: 0px;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: #2d5a27;
  text-decoration: none;
  margin-bottom: 10px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 8px;
`;

const CurrentBoard = styled.div`
  color: #666;
  font-size: 18px;
  font-weight: 500;
  @media (max-width: 768px) {
    display: none;
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
