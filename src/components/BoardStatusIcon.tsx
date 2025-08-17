import styled from "styled-components";
import type { BoardStatus } from "../types/board";

interface BoardStatusIconProps {
  status: BoardStatus["status"];
  size?: number;
}

export function BoardStatusIcon({ status, size = 20 }: BoardStatusIconProps) {
  if (status === "not-started") {
    return null;
  }

  return (
    <IconContainer size={size}>
      {status === "won" ? (
        <WonIcon size={size} title="Board completed - You won!">
          🏆
        </WonIcon>
      ) : status === "lost" ? (
        <LostIcon size={size} title="Board completed - No moves left">
          ❌
        </LostIcon>
      ) : (
        <InProgressIcon size={size} title="Board in progress">
          ⏳
        </InProgressIcon>
      )}
    </IconContainer>
  );
}

const IconContainer = styled.div<{ size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  font-weight: bold;
  font-size: ${(props) => Math.floor(props.size * 0.7)}px;
  line-height: 1;
`;

const WonIcon = styled.div<{ size: number }>`
  color: #22c55e;
  background-color: #dcfce7;
  border: 1px solid #16a34a;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(34, 197, 94, 0.2);
  font-size: ${(props) => Math.floor(props.size * 0.6)}px;

  &:hover {
    background-color: #bbf7d0;
  }
`;

const LostIcon = styled.div<{ size: number }>`
  color: #ef4444;
  background-color: #fee2e2;
  border: 1px solid #dc2626;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.2);
  font-size: ${(props) => Math.floor(props.size * 0.6)}px;

  &:hover {
    background-color: #fecaca;
  }
`;

const InProgressIcon = styled.div<{ size: number }>`
  color: #f59e0b;
  background-color: #fef3c7;
  border: 1px solid #d97706;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(245, 158, 11, 0.2);
  font-size: ${(props) => Math.floor(props.size * 0.6)}px;

  &:hover {
    background-color: #fde68a;
  }
`;
