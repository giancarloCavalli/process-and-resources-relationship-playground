import * as S from './style';
import { useState } from 'react';
import { DraggableBlock } from '../../components/DraggableBlock';
import { GenerateBlockButton } from '../../components/GenerateBlockButton';
import { BlockTypeEnum } from '../../enum/blockTypeEnum';
import { Block, equals } from '../../types/block';
import { BlockType } from '../../types/blockType';
import { getPosition, isBlockWaitingSelection } from './helpers';
import { ConnectionArrow } from '../../components/ConnectionArrow';
import { BlockPosition } from '../../types/blockPosition';

type BlockControl = {
  idCounter: number;
  type: BlockType;
}

type EditControl = {
  editingForBlock: Block | undefined;
}

type BlockConnection = {
  from: Block;
  to: Block;
  sequenceItHasBeenAddedBetweenEquals: number;
}

export const Homepage = () => {

  // states
  const [blocksPosition, setBlocksPosition] = useState<BlockPosition[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockControl, setBlockControl] = useState<BlockControl[]>(
    Object.keys(BlockTypeEnum).map(v => { return { type: v as BlockType, idCounter: 0 } })
  );
  const [editControl, setEditControl] = useState<EditControl>({ editingForBlock: undefined });
  const [connections, setConnections] = useState<BlockConnection[]>([]);

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

    setConnections([...connections, { from: editControl.editingForBlock as Block, to: block, sequenceItHasBeenAddedBetweenEquals: sequence }])
    setEditControl({ editingForBlock: undefined })
  }

  const handleIncrementResourceQuantityClick = (block: Block) => {
    const blockList = blocks.filter(blockFromList => !equals(blockFromList, block))

    setBlocks([...blockList, block])
  }

  const handleDecrementResourceQuantityClick = (block: Block) => {
    const blockList = blocks.filter(blockFromList => !equals(blockFromList, block))

    setBlocks([...blockList, block])
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

  return (
    <>
      <S.Header>
        <GenerateBlockButton blockType='PROCESS' handleClick={addBlock} />
        <GenerateBlockButton blockType='RESOURCE' handleClick={addBlock} />
      </S.Header>
      <main>
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
          connections.map(({ from, to, sequenceItHasBeenAddedBetweenEquals }) => {
            return {
              positionFrom: getPosition(from, blocksPosition),
              positionTo: getPosition(to, blocksPosition),
              lineSlackness: 0.2,
              deviation: deviationBaseNumber * sequenceItHasBeenAddedBetweenEquals
            }
          })
        } />
      </main>
    </>
  )
}