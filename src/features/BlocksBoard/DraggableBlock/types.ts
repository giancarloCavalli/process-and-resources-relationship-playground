import { Position } from "../../../types/position";

export type BlockType = 'PROCESS' | 'RESOURCE';

export type Block = {
  id: string;
  type: BlockType;
  resourceQuantity: number;
  position: Position;
}