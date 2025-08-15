import styled from "styled-components";
import type { CellStyle } from "../types/board";

const SIZE_CONST = window.innerWidth < 400 ? "1.8em" : "3em";

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
      {isSelected ? (
        <i
          style={{
            fontSize: window.innerWidth < 400 ? "1em" : "1.8em",
            position: "relative",
            top: window.innerWidth < 400 ? "0" : "5px",
            color: "#938c00ff",
          }}
          className="fa-solid fa-star"
        ></i>
      ) : (
        "\u00A0"
      )}
    </CellBlock>
  );
}

export const CellBlock = styled.div<{
  $cellstyle: CellStyle;
  $isShaded: boolean;
}>`
  cursor: pointer;
  display: inline-block;
  width: ${SIZE_CONST};
  height: ${SIZE_CONST};
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
  line-height: ${SIZE_CONST};
`;
