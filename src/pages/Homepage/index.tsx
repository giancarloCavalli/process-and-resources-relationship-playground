import * as S from './style';
import { useState } from 'react';
import { DraggableBlock } from '../../components/DraggableBlock';
import { BlockTypeEnum } from '../../enum/blockTypeEnum';
import { Block, equals } from '../../types/block';
import { BlockType } from '../../types/blockType';
import { buildDependenciesSolvingScenario, getPosition, isBlockWaitingSelection } from './helpers';
import { ConnectionArrow } from '../../components/ConnectionArrow';
import { BlockPosition } from '../../types/blockPosition';
import { Button } from '../../components/Button';
import { BlockConnection, DependencySolvingScenario } from './types';

type BlockControl = {
  idCounter: number;
  type: BlockType;
}

type EditControl = {
  editingForBlock: Block | undefined;
}

export const Homepage = () => {

  // states
  const [blocksPosition, setBlocksPosition] = useState<BlockPosition[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [blockControl, setBlockControl] = useState<BlockControl[]>(
    Object.keys(BlockTypeEnum).map(v => { return { type: v as BlockType, idCounter: 0 } })
  )
  const [editControl, setEditControl] = useState<EditControl>({ editingForBlock: undefined })
  const [connections, setConnections] = useState<BlockConnection[]>([])
  const [solvingScenario, setSolvingScenario] = useState<DependencySolvingScenario[]>([])
  const [solvingScene, setSolvingScene] = useState<number | undefined>(undefined)

  const deviationBaseNumber = 8;

  const getBlockId = (blockType: BlockType): string => {
    let control = blockControl.find(({ type }) => type === blockType);

    let id = control ? control.idCounter.toString() : "0";
    setBlockControl(blockControl.map(value => { return value.type === blockType ? { ...value, idCounter: value.idCounter + 1 } : value }));
    return id;
  }

  const handleBlockEditClick = (block: Block) => {
    setEditControl({ editingForBlock: block });
  }

  const handleCancelBlockEditClick = () => {
    setEditControl({ editingForBlock: undefined });
  }

  const handleDropConnectionClick = (block: Block) => {
    setConnections(connections.filter(connection => !equals(connection.from, block)))
  }

  const handleConnectBlockClick = (block: Block) => {
    const sequence = connections.filter(({ from, to }) => equals(from, editControl.editingForBlock) && equals(to, block)).length;

    setConnections([...connections, { from: editControl.editingForBlock as Block, to: block, sequenceItHasBeenAddedConsideringEquals: sequence }])
    setEditControl({ editingForBlock: undefined })
  }

  const handleIncrementResourceQuantityClick = (block: Block) => {
    setBlocks(blocks.map((blockMap) => {
      if (equals(blockMap, block)) {
        blockMap.resourceQuantity = block.resourceQuantity
        return blockMap
      }
      else
        return blockMap
    }))
  }

  const handleDecrementResourceQuantityClick = (block: Block) => {
    setBlocks(blocks.map((blockMap) => {
      if (equals(blockMap, block)) {
        blockMap.resourceQuantity = block.resourceQuantity
        return blockMap
      }
      else
        return blockMap
    }))
  }

  const addResourceBlock = () => {
    addBlock('RESOURCE');
  }

  const addProcessBlock = () => {
    addBlock('PROCESS');
  }

  const addBlock = (blockType: BlockType) => {
    const block: Block = { id: getBlockId(blockType), type: blockType, resourceQuantity: 1 };

    setBlocks([...blocks, block]);

    setBlocksPosition([...blocksPosition, { block, position: { top: 50, left: 10 } }])
  }

  const handlePositionChange = (block: Block, top: number, left: number) => {
    setBlocksPosition(blocksPosition.map(blockPosition => {
      if ((blockPosition.block.id === block.id) && (blockPosition.block.type === block.type)) {
        return { block, position: { top, left } };
      }
      return blockPosition;
    }))
  }

  const handleCheckDeadlock = () => {
    const scenario: DependencySolvingScenario[] = buildDependenciesSolvingScenario(connections)
    setSolvingScenario(scenario);

    if (scenario.length === 0) window.alert("The system will generate a deadlock error!")
    else setSolvingScene(0);
  }

  const handleSelectScene = (sceneNumber: number) => {
    setSolvingScene(sceneNumber)
  }

  const handleClearConnections = () => {
    setConnections([])
    setSolvingScene(undefined)
    setSolvingScenario([])
  }

  return (
    <>
      <S.Header>
        <Button handleClick={addProcessBlock}>ADD PROCESS</Button>
        <Button handleClick={addResourceBlock}>ADD RESOURCE</Button>
        <Button handleClick={handleClearConnections} backgroundColor='#BD1728'>CLEAR CONNECTIONS</Button>
        <Button handleClick={handleCheckDeadlock} backgroundColor='#00609C'>CHECK DEADLOCK</Button>
      </S.Header>
      <main>
        <div>
          {solvingScenario.map(({ sequence }) => (
            <button key={sequence} onClick={() => handleSelectScene(sequence)}>{sequence + 1}</button>
          ))}
        </div>
        {blocks.map((block, index) => (
          <DraggableBlock
            isWaitingSelection={isBlockWaitingSelection(block, editControl.editingForBlock)}
            isInEditConnectionMode={equals(block, editControl.editingForBlock)}
            position={getPosition(block, blocksPosition)}
            onPositionChange={handlePositionChange}
            block={block}
            key={index}
            onEditButtonClick={handleBlockEditClick}
            onCancelEditButtonClick={handleCancelBlockEditClick}
            onDropConnectionButtonClick={handleDropConnectionClick}
            onConnectButtonClick={handleConnectBlockClick}
            onIncrementResourceQuantityClick={handleIncrementResourceQuantityClick}
            onDecrementResourceQuantityClick={handleDecrementResourceQuantityClick}
          />
        ))}
        <ConnectionArrow connections={
          solvingScene === undefined ?
            connections.map(({ from, to, sequenceItHasBeenAddedConsideringEquals }) => {
              return {
                positionFrom: getPosition(from, blocksPosition),
                positionTo: getPosition(to, blocksPosition),
                lineSlackness: 0.2,
                deviation: deviationBaseNumber * sequenceItHasBeenAddedConsideringEquals
              }
            })
            :
            solvingScenario[solvingScene].blockConnections.map(({ from, to, sequenceItHasBeenAddedConsideringEquals }) => {
              return {
                positionFrom: getPosition(from, blocksPosition),
                positionTo: getPosition(to, blocksPosition),
                lineSlackness: 0.2,
                deviation: deviationBaseNumber * sequenceItHasBeenAddedConsideringEquals
              }
            })
        } />
      </main>
    </>
  )
}