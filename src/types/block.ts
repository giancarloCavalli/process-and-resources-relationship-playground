import { BlockType } from "./blockType";

export type Block = {
  id: string;
  type: BlockType;
  resourceQuantity: number;
}

export type BlockContextType = {
  blocks: Block[];
  saveBlock: (block: Block) => void;
  updateBlock: (block: Block) => void;
  deleteAll: () => void
}

export const equals = (block1: Block | undefined, block2: Block | undefined): boolean => {
  if (block1 === undefined || block2 === undefined) return false

  if (block1.id === block2.id && block1.type === block2.type) return true

  return false
}