import styled from "styled-components";
import type { CellStyle } from "../types/board";

export function Cell({
  isSelected,
  isShaded,
  cellStyle,
  onSelect,
}: {
  isSelected: boolean;
  isShaded: boolean;
  cellStyle: CellStyle;
  onSelect: () => void;
}) {
  return (
    <CellBlock $cellstyle={cellStyle} onClick={onSelect} $isShaded={isShaded}>
      {isSelected ? <i className="fa-solid fa-star"></i> : "\u00A0"}
    </CellBlock>
  );
}

const CellBlock = styled.div<{ $cellstyle: CellStyle; $isShaded: boolean }>`
  cursor: pointer;
  display: inline-block;
  width: 50px;
  height: 50px;
  border-top: ${(props) =>
    props.$cellstyle.t ? "2px solid black" : "2px solid #f0f0f0"};
  border-bottom: ${(props) =>
    props.$cellstyle.b ? "2px solid black" : "2px solid #f0f0f0"};
  border-left: ${(props) =>
    props.$cellstyle.l ? "2px solid black" : "2px solid #f0f0f0"};
  border-right: ${(props) =>
    props.$cellstyle.r ? "2px solid black" : "2px solid #f0f0f0"};
  background-color: ${(props) => (props.$isShaded ? "#c4ddf4ff" : "white")};
  color: black;
  text-align: center;
  line-height: 50px;
`;
