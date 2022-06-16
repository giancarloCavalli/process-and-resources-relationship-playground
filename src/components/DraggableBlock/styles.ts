import styled from "styled-components";
import { BlockType } from "../../types/blockType";

type Props = {
  left: string;
  top: string;
}

type BlockProps = {
  type: BlockType
}

type ButtonProps = {
  backgroundColor: string;
}

export const Wrapper = styled.div<Props>`
  position: absolute;
  display: flex;
  flex-direction: column;
  font-size: 30px;
  left: ${props => props.left};
  top: ${props => props.top};
  `

export const Block = styled.div<BlockProps>`
  background-color: ${props => props.type === "PROCESS" ? "blue" : "green"};
  border-radius: 20px;
  padding: 2px;
  color: white;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    :hover{
      cursor: grab;
    }
  }
  
  :hover {
    cursor: grab;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`

export const SmallButton = styled.button<ButtonProps>`
  background-color: ${props => props.backgroundColor};
  font-weight: 700;
  color: white;
  font-size: 15px;
  border-radius: 15px;
  border-style: none;

  :hover {
    cursor: pointer;
  }
`

export const Button = styled.button<ButtonProps>`
  background-color: ${props => props.backgroundColor};
  font-weight: 700;
  width: 25px;
  height: 25px;
  color: white;
  font-size: 15px;
  border-radius: 50px;
  border-style: none;

  :hover {
    cursor: pointer;
  }
`