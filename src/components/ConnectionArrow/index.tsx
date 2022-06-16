import { Wrapper } from "./styles"
import { Connection } from "../../types/connection"
import { getCurvedArrowPath } from "./helpers"

type Props = {
  connections: Connection[]
}

export const ConnectionArrow = ({ connections }: Props) => {

  return (
    <Wrapper height="100vh" width="100%">
      {connections.map(({ positionFrom, positionTo, lineSlackness, deviation }, index) => (
        <path key={index} d={getCurvedArrowPath(positionFrom, positionTo, lineSlackness ?? 0, deviation ?? 0)} fill="none" stroke="red"></path>
      ))}
    </Wrapper>
  )
}