import { Position } from "./position";

export type Connection = {
  positionFrom: Position;
  positionTo: Position;
  lineSlackness?: number;
  deviation?: number;
}