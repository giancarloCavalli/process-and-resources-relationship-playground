import { createContext, FC, ReactNode, useState } from "react";
import { Block, BlockContextType } from "../types/block";

type Props = {
  children: ReactNode
}

export const BlockContext = createContext<BlockContextType | null>(null);

const BlockProvider: FC<Props> = ({ children }: Props) => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  function saveBlock(block: Block) {
    setBlocks([...blocks, block])
  }

  return (
    <BlockContext.Provider value={{ blocks, saveBlock }}>{children}</BlockContext.Provider>
  )
}

export default BlockProvider;