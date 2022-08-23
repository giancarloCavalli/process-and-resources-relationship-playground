import { Position } from "../../types/position";
import { Block } from "./DraggableBlock/types";

export type BlockContextType = {
  blocks: Block[];
  editingBlock: Block | undefined;
  saveBlock: (block: Block) => void;
  updateBlock: (block: Block) => void;
  deleteAll: () => void;
  updateEditingBlock: (block: Block | undefined) => void;
  connections: BlockConnection[];
  updateConnections: (connections: BlockConnection[]) => BlockConnection[];
}

export type BlockConnection = {
  from: Block;
  to: Block;
  sequenceItHasBeenAddedConsideringEquals: number;
}
  
export type DependencySolvingScenario = {
  sequence: number,
  blockConnections: BlockConnection[]
}

export type Connection = {
  positionFrom: Position;
  positionTo: Position;
  lineSlackness?: number;
  deviation?: number;
}