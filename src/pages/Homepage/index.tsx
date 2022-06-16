import * as S from './style';
import { useState } from 'react';
import { DraggableBlock } from '../../components/DraggableBlock';
import { GenerateBlockButton } from '../../components/GenerateBlockButton';
import { BlockTypeEnum } from '../../enum/blockTypeEnum';
import { Block, equals } from '../../types/block';
import { BlockType } from '../../types/blockType';
import { Position } from '../../types/position';
import { isBlockWaitingSelection } from './helpers';
import { ConnectionArrow } from '../../components/ConnectionArrow';

type BlockControl = {
  idCounter: number;
  type: BlockType;
}

type BlockPosition = {
  block: Block;
  position: Position;
}

type EditControl = {
  editingForBlock: Block | undefined;
}

type Connection = {
  from: Block;
  to: Block;
}

export const Homepage = () => {

  const [blocksPosition, setBlocksPosition] = useState<BlockPosition[]>([]);

  const [blocks, setBlocks] = useState<Block[]>([]);

  const [blockControl, setBlockControl] = useState<BlockControl[]>(
    Object.keys(BlockTypeEnum).map(v => { return { type: v as BlockType, idCounter: 0 } })
  );

  const [editControl, setEditControl] = useState<EditControl>({ editingForBlock: undefined });

  const [connections, setConnections] = useState<Connection[]>([]);

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

  const handleConnectBlockClick = (block: Block) => {
    setConnections([...connections, { from: editControl.editingForBlock as Block, to: block }])
    setEditControl({ editingForBlock: undefined })
  }

  const addBlock = (blockType: BlockType) => {
    const block: Block = { id: getBlockId(blockType), type: blockType };

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

  const getPosition = (block: Block): Position => {
    const blockPosition = blocksPosition.find(blockPos => (blockPos.block.id === block.id) && (blockPos.block.type === block.type));

    if (blockPosition != null) {
      return blockPosition.position;
    }

    return { top: 50, left: 10 };
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
            position={getPosition(block)}
            onPositionChange={handlePositionChange}
            block={block}
            key={index}
            onEditButtonClick={handleBlockEditClick}
            onCancelEditButtonClick={handleCancelBlockEditClick}
            onConnectButtonClick={handleConnectBlockClick}
          />
        ))}
        <ConnectionArrow connections={
          connections.map(({ from, to }) => {
            return { positionFrom: getPosition(from), positionTo: getPosition(to) }
          })
        } />
      </main>

      {/*<div style={{ height: "50px", left: "400px", width: "50px", top: "300px", backgroundColor: "blue", position: "absolute" }}></div>
      <div style={{ height: "50px", left: "600px", width: "50px", top: "500px", backgroundColor: "green", position: "absolute" }}></div>*/}
    </>
  )
}