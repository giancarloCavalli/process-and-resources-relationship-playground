import { Block, equals } from "../../types/block";

export const isBlockWaitingSelection = (block: Block, blockInEdition: Block | undefined): boolean => {
  if (blockInEdition === undefined) return false
  
  if (equals(block, blockInEdition)) return false
  
  if (blockInEdition.type === block.type) return false

  return true
}
