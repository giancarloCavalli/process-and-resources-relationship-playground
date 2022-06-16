import { Block, equals } from "../../types/block";
import { BlockPosition } from "../../types/blockPosition";
import { Position } from "../../types/position";

export const isBlockWaitingSelection = (block: Block, blockInEdition: Block | undefined): boolean => {
  if (blockInEdition === undefined) return false
  
  if (equals(block, blockInEdition)) return false
  
  if (blockInEdition.type === block.type) return false

  return true
}

export const getPosition = (block: Block, blocksPosition: BlockPosition[]): Position => {
  const blockPosition = blocksPosition.find(blockPos => (blockPos.block.id === block.id) && (blockPos.block.type === block.type));

  if (blockPosition != null) {
    return blockPosition.position;
  }

  return { top: 50, left: 10 };
}