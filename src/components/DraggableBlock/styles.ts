import styled from "styled-components";
import { BlockType } from "../../types/blockType";

type Props = {
  left: string;
  top: string;
  type: BlockType
}

export const Wrapper = styled.div<Props>`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: ${props => props.type === "PROCESS" ? "blue" : "red"};
  border-radius: 20px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
  left: ${props => props.left};
  top: ${props => props.top};
  
  span {
    :hover{
      cursor: grab;
    }
  }

  :hover {
    cursor: grab;
  }
`