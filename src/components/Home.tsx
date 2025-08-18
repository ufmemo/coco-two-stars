import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { boards } from "../boards";
import { BoardStatusIcon } from "./BoardStatusIcon";
import { ResetAllButton } from "./ResetAllButton";
import { Instructions2Modal } from "./Instructions2Modal";
import { getAllBoardStatuses } from "../utils/localStorage";
import type { BoardStatus } from "../types/board";

export function Home() {
  const navigate = useNavigate();
  const [boardStatuses, setBoardStatuses] = useState<BoardStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  // Load board statuses on component mount
  const loadStatuses = () => {
    try {
      const statuses = getAllBoardStatuses();
      setBoardStatuses(statuses);
    } catch (error) {
      console.warn("Failed to load board statuses:", error);
      setBoardStatuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatuses();

    // Listen for localStorage changes (e.g., from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("two-star-")) {
        loadStatuses();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle reset all action - refresh board statuses
  const handleResetAll = () => {
    setIsLoading(true);
    // Small delay to ensure localStorage is cleared before reloading
    setTimeout(() => {
      loadStatuses();
    }, 100);
  };

  const handleBoardSelect = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  // Get status for a specific board
  const getBoardStatus = (boardId: string): BoardStatus["status"] => {
    const status = boardStatuses.find((s) => s.boardId === boardId);
    return status?.status || "not-started";
  };

  return (
    <HomeContainer>
      <Header>
        <Title>Two Stars Game</Title>
        <Subtitle>Choose a board to start playing</Subtitle>
        <InstructionsLink onClick={() => setShowInstructions(true)}>
          📖 How to Play
        </InstructionsLink>
      </Header>

      <ResetAllSection>
        <ResetAllButton onReset={handleResetAll} />
      </ResetAllSection>

      <BoardGrid>
        {isLoading ? (
          <LoadingMessage>Loading board statuses...</LoadingMessage>
        ) : (
          boards.map((board) => {
            const status = getBoardStatus(board.id);
            return (
              <BoardCard
                key={board.id}
                onClick={() => handleBoardSelect(board.id)}
                $status={status}
              >
                <BoardHeader>
                  <BoardName>{board.name}</BoardName>
                  <BoardStatusIcon status={status} size={24} />
                </BoardHeader>
                <PlayButton $status={status}>
                  {status === "won"
                    ? "Play Again"
                    : status === "lost"
                    ? "Try Again"
                    : status === "in-progress"
                    ? "Continue"
                    : "Play"}
                </PlayButton>
              </BoardCard>
            );
          })
        )}
      </BoardGrid>

      <Instructions2Modal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div``;

const Title = styled.h1`
  color: #333;
  margin: 0;
  font-size: 2.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin: 0;
`;

const InstructionsLink = styled.button`
  background: none;
  border: none;
  color: #2d5a27;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f7f0;
    text-decoration: none;
  }

  &:focus {
    outline: 2px solid #2d5a27;
    outline-offset: 2px;
  }
`;

const ResetAllSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0px;
`;

const BoardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
`;

const BoardCard = styled.div<{ $status: BoardStatus["status"] }>`
  display: flex;
  justify-content: space-between;
  background: white;
  border: 2px solid
    ${(props) =>
      props.$status === "won"
        ? "#16a34a"
        : props.$status === "lost"
        ? "#dc2626"
        : props.$status === "in-progress"
        ? "#d97706"
        : "#ddd"};
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    border-color: ${(props) =>
      props.$status === "won"
        ? "#15803d"
        : props.$status === "lost"
        ? "#b91c1c"
        : props.$status === "in-progress"
        ? "#c2410c"
        : "#2d5a27"};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BoardName = styled.h3`
  color: #333;
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
`;

const PlayButton = styled.div<{ $status: BoardStatus["status"] }>`
  background-color: ${(props) =>
    props.$status === "won"
      ? "#16a34a"
      : props.$status === "lost"
      ? "#dc2626"
      : props.$status === "in-progress"
      ? "#d97706"
      : "#2d5a27"};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  display: inline-block;
  font-size: 0.9rem;

  &:hover {
    background-color: ${(props) =>
      props.$status === "won"
        ? "#15803d"
        : props.$status === "lost"
        ? "#b91c1c"
        : props.$status === "in-progress"
        ? "#c2410c"
        : "#1f4a1f"};
  }
`;

const LoadingMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  padding: 40px;
`;
