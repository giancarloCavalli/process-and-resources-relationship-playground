import { useState } from 'react';
import { DraggableBlock } from '../../components/DraggableBlock';
import { GenerateBlockButton } from '../../components/GenerateBlockButton';
import { BlockTypeEnum } from '../../enum/blockTypeEnum';
import { Block } from '../../types/block';
import { BlockType } from '../../types/blockType';
import * as S from './style';

type BlockControl = {
  idCounter: number,
  type: BlockType
}

export const Homepage = () => {

  const [blocks, setBlocks] = useState<Block[]>([]);

  const [blockControl, setBlockControl] = useState<BlockControl[]>(
    Object.keys(BlockTypeEnum).map(v => { return { type: v as BlockType, idCounter: 0 } })
  );

  const getBlockId = (blockType: BlockType): string => {
    let control = blockControl.find(({ type }) => type === blockType);

    let id = control ? control.idCounter.toString() : "0";
    setBlockControl(blockControl.map(value => { return value.type === blockType ? { ...value, idCounter: value.idCounter + 1 } : value }));
    return id;
  }

  const addBlock = (blockType: BlockType) => {
    setBlocks([...blocks, { id: getBlockId(blockType), type: blockType }]);
  }

  return (
    <>
      <S.Header>
        <GenerateBlockButton blockType='PROCESS' handleClick={addBlock} />
        <GenerateBlockButton blockType='RESOURCE' handleClick={addBlock} />
      </S.Header>
      <main>
        {blocks.map((block, index) => (
          <DraggableBlock block={block} key={index} />
        ))}
      </main>
    </>
  )
}