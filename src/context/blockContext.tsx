import { createContext, FC, ReactNode, useState } from "react";
import { Block, BlockContextType, equals } from "../types/block";

type Props = {
  children: ReactNode
}

export const BlockContext = createContext<BlockContextType | null>(null);

const BlockProvider: FC<Props> = ({ children }: Props) => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  function saveBlock(block: Block) {
    setBlocks([...blocks, block])
  }

  function updateBlock(block: Block) {
    setBlocks(blocks.map(blockMap => {

      if (equals(blockMap, block)) {
        blockMap.resourceQuantity = block.resourceQuantity
        blockMap.position = block.position
      }

      return blockMap
    }))
  }

  function deleteAll() {
    setBlocks([])
  }

  return (
    <BlockContext.Provider value={{ blocks, saveBlock, updateBlock, deleteAll }}>{children}</BlockContext.Provider>
  )
}

export default BlockProvider;