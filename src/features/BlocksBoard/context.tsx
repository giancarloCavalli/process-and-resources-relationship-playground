import { createContext, ReactNode, useState } from "react";
import { Block } from "./DraggableBlock/types";
import { equals } from "./helpers";
import { BlockConnection, BlockContextType, DependencySolvingScenario } from "./types";

type Props = {
  children: ReactNode
}

export const BlockContext = createContext<BlockContextType | null>(null);

const BlockProvider: React.FC<Props> = ({ children }: Props) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlock, setEditingBlock] = useState<Block | undefined>(undefined);
  const [connections, setConnections] = useState<BlockConnection[]>([]);
  const [solvingScenarios, setSolvingScenarios] = useState<DependencySolvingScenario[]>([])
  const [solvingScene, setSolvingScene] = useState<number | undefined>(undefined)

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
    updateEditingBlock(undefined)
  }

  function updateEditingBlock(block: Block | undefined) {
    setEditingBlock(block)
  }

  function updateConnections(blockConnections: BlockConnection[]): BlockConnection[] {
    setConnections(blockConnections)
    return connections
  }

  function updateSolvingScenarios(dependencySolvingScenearios: DependencySolvingScenario[]): DependencySolvingScenario[] {
    setSolvingScenarios(dependencySolvingScenearios)
    return solvingScenarios
  }

  function updateSolvingScene(solvingScene: number | undefined = undefined) {
    setSolvingScene(solvingScene)
  }

  function clearConnections() {
    updateConnections([])
    updateSolvingScene()
    updateSolvingScenarios([])
  }

  return (
    <BlockContext.Provider value={{
      blocks, editingBlock, saveBlock, updateBlock, deleteAll, updateEditingBlock,
      connections, updateConnections, clearConnections,
      solvingScenarios, updateSolvingScenarios,
      solvingScene, updateSolvingScene
    }}>
      {children}
    </BlockContext.Provider>
  )
}

export default BlockProvider;