import { Position } from "../../types/position";
import { Wrapper } from "./styles"

type Connection = {
  positionFrom: Position;
  positionTo: Position;
}

type Props = {
  connections: Connection[]
}

export const ConnectionArrow = ({ connections }: Props) => {

  return (
    <Wrapper height="100vh" width="100%">
      {connections.map(({ positionFrom, positionTo }, index) => (
        <line key={index} x1={positionFrom.left} y1={positionFrom.top - 75} x2={positionTo.left} y2={positionTo.top - 75} />
      ))}
    </Wrapper>
  )
}