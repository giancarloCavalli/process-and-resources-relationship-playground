import { Wrapper } from "./styles"
import { getCurvedArrowPath } from "./helpers"
import React from "react"
import { Connection } from "../types"

type Props = {
  connections: Connection[]
}

export const ConnectionArrow = ({ connections }: Props) => {

  return (
    <Wrapper>
      {connections.map(({ positionFrom, positionTo, lineSlackness, deviation }, index) => (
        <React.Fragment key={index}>
          <defs data-testid='connection-arrow-head'>
            <marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5"
              markerUnits="strokeWidth" markerWidth="17.5"
              markerHeight="14" orient="auto"
              style={{ zIndex: 1 }}
            >
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
          </defs>
          <path
            key={index}
            d={getCurvedArrowPath(positionFrom, positionTo, lineSlackness ?? 0, deviation ?? 0)}
            fill="none"
            stroke="red"
            markerEnd="url(#triangle)"
            style={{ zIndex: -1 }}
            data-testid='connection-line'
          >

          </path>
        </ React.Fragment>
      ))
      }
    </Wrapper >
  )
}