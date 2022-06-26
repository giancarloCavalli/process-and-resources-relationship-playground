import styled from "styled-components";

type Props = {
  backgroundColor: string
}

export const Wrapper = styled.button<Props>`
  padding: 15px;
  border-radius: 20px;
  border: grey;
  background-color: ${({ backgroundColor }) => backgroundColor};
  font-weight: bold;
  color: white;

  :hover {
    cursor: pointer;
  }
`