import { useState } from 'react';
import { DraggableBlock } from '../../components/DraggableBlock';
import { GenerateBlockButton } from '../../components/GenerateBlockButton';
import { BlockType } from '../../types/blockType';
import * as S from './style';

export const Homepage = () => {

  const [blocks, setBlocks] = useState<BlockType[]>([]);

  const addBlock = (blockType: BlockType) => {
    setBlocks([...blocks, blockType]);
  }

  return (
    <>
      <S.Header>
        <GenerateBlockButton blockType='PROCESS' handleClick={addBlock} />
        <GenerateBlockButton blockType='RESOURCE' handleClick={addBlock} />
      </S.Header>
      <main>
        {blocks.map((blockType, index) => (
          <DraggableBlock key={index} type={blockType} />
        )
        )}
      </main>
    </>
  )
}