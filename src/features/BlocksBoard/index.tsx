import * as S from './style';
import { useContext, useState } from 'react';
import { DraggableBlock } from './DraggableBlock';
import { buildDependenciesSolvingScenario, equals, isBlockWaitingSelection } from './helpers';
import { ConnectionArrow } from './ConnectionArrow';
import { Button } from '../../components/Button';
import { BlockContextType, DependencySolvingScenario } from './types';
import { BlockContext } from './context';
import { Block, BlockType } from './DraggableBlock/types';
import { BlockTypeEnum } from './DraggableBlock/enum';

type BlockControl = {
  idCounter: number;
  type: BlockType;
}

export const BlocksBoard = () => {
  const [blockControl, setBlockControl] = useState<BlockControl[]>(
    Object.keys(BlockTypeEnum).map(v => { return { type: v as BlockType, idCounter: 0 } })
  )

  const {
    blocks, saveBlock, deleteAll, editingBlock,
    connections, updateConnections,
    solvingScenarios, updateSolvingScenarios,
    solvingScene, updateSolvingScene
  } = useContext(BlockContext) as BlockContextType

  const DEVIATION_BASE_NUMBER = 8;

  const getBlockId = (blockType: BlockType): string => {
    let control = blockControl.find(({ type }) => type === blockType);

    let id = control ? control.idCounter.toString() : "0";
    setBlockControl(blockControl.map(value => { return value.type === blockType ? { ...value, idCounter: value.idCounter + 1 } : value }));
    return id;
  }

  const addResourceBlock = () => {
    addBlock('RESOURCE');
  }

  const addProcessBlock = () => {
    addBlock('PROCESS');
  }

  const addBlock = (blockType: BlockType) => {
    const block: Block = { id: getBlockId(blockType), type: blockType, resourceQuantity: 1, position: { top: 50, left: 10 } };

    saveBlock(block)
  }

  const handleCheckDeadlock = () => {
    const scenario: DependencySolvingScenario[] = buildDependenciesSolvingScenario(connections)
    updateSolvingScenarios(scenario);

    if (scenario.length === 0) window.alert("The system will generate a deadlock error!")
    else updateSolvingScene(0);
  }

  const handleSelectScene = (sceneNumber: number) => {
    updateSolvingScene(sceneNumber)
  }

  const handleDeleteAll = () => {
    clearConnections()
    clearAll()
  }

  const clearAll = () => {
    deleteAll()
    setBlockControl(Object.keys(BlockTypeEnum).map(v => { return { type: v as BlockType, idCounter: 0 } }))
  }

  const clearConnections = () => {
    updateConnections([])
    updateSolvingScene(undefined)
    updateSolvingScenarios([])
  }

  return (
    <>
      <S.Header>
        <Button handleClick={addProcessBlock}>ADD PROCESS</Button>
        <Button handleClick={addResourceBlock}>ADD RESOURCE</Button>
        <Button handleClick={handleDeleteAll} backgroundColor='#BD1728'>DELETE ALL</Button>
        <Button handleClick={handleCheckDeadlock} backgroundColor='#00609C'>CHECK DEADLOCK</Button>
      </S.Header>
      <main>
        <S.SceneButtonsWrapper>
          {solvingScene !== undefined && <span style={{ marginLeft: "10px" }}>See each of the solution steps here 👉</span>}
          {solvingScenarios.map(({ sequence }) => (
            <S.SceneButton
              key={sequence}
              selected={solvingScene === sequence}
              onClick={() => handleSelectScene(sequence)}
            >
              {sequence + 1}
            </S.SceneButton>
          ))}
          {solvingScene !== undefined && <span style={{ marginLeft: "10px" }}>*To start a new test with the same blocks, just start editing again. 😊</span>}
        </S.SceneButtonsWrapper>
        {blocks.map((block, index) => (
          <DraggableBlock
            key={index}
            isWaitingSelection={isBlockWaitingSelection(block, editingBlock)}
            isInEditConnectionMode={equals(block, editingBlock)}
            block={block}
          />
        ))}
        <ConnectionArrow connections={
          solvingScene === undefined ?
            connections.map(({ from, to, sequenceItHasBeenAddedConsideringEquals }) => {
              return {
                positionFrom: from.position,
                positionTo: to.position,
                lineSlackness: 0.2,
                deviation: DEVIATION_BASE_NUMBER * sequenceItHasBeenAddedConsideringEquals
              }
            })
            :
            solvingScenarios[solvingScene].blockConnections.map(({ from, to, sequenceItHasBeenAddedConsideringEquals }) => {
              return {
                positionFrom: from.position,
                positionTo: to.position,
                lineSlackness: 0.2,
                deviation: DEVIATION_BASE_NUMBER * sequenceItHasBeenAddedConsideringEquals
              }
            })
        } />
      </main>
    </>
  )
}