import styled from "styled-components";

type ButtonProps = {
  selected: boolean
}

export const Header = styled.header`
  display: flex;
  justify-content: space-evenly;
  padding: 15px;
  z-index: 1;
`

export const SceneButtonsWrapper = styled.div`
  padding: 0px 30px;
`

export const SceneButton = styled.button<ButtonProps>`
  border-radius: 30px;
  cursor: pointer;
  background-color: ${props => props.selected ? "#3F79FE" : "#E5E6EB"};
  border-style: none;
  font-family: 700;
  margin-left: 5px;
`