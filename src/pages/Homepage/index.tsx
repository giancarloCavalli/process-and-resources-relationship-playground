import * as S from './style';
import { useContext, useState } from 'react';
import { DraggableBlock } from '../../components/DraggableBlock';
import { BlockTypeEnum } from '../../enum/blockTypeEnum';
import { Block, BlockContextType, equals } from '../../types/block';
import { BlockType } from '../../types/blockType';
import { buildDependenciesSolvingScenario, isBlockWaitingSelection } from './helpers';
import { ConnectionArrow } from '../../components/ConnectionArrow';
import { Button } from '../../components/Button';
import { BlockConnection, DependencySolvingScenario } from './types';
import { BlockContext } from '../../context/blockContext';

type BlockControl = {
  idCounter: number;
  type: BlockType;
}

type EditControl = {
  editingForBlock: Block | undefined;
}

export const Homepage = () => {
  // states
  const [blockControl, setBlockControl] = useState<BlockControl[]>(
    Object.keys(BlockTypeEnum).map(v => { return { type: v as BlockType, idCounter: 0 } })
  )
  const [editControl, setEditControl] = useState<EditControl>({ editingForBlock: undefined })
  const [connections, setConnections] = useState<BlockConnection[]>([])
  const [solvingScenario, setSolvingScenario] = useState<DependencySolvingScenario[]>([])
  const [solvingScene, setSolvingScene] = useState<number | undefined>(undefined)

  const { blocks, saveBlock, updateBlock, deleteAll } = useContext(BlockContext) as BlockContextType

  const deviationBaseNumber = 8;

  const getBlockId = (blockType: BlockType): string => {
    let control = blockControl.find(({ type }) => type === blockType);

    let id = control ? control.idCounter.toString() : "0";
    setBlockControl(blockControl.map(value => { return value.type === blockType ? { ...value, idCounter: value.idCounter + 1 } : value }));
    return id;
  }

  const handleBlockEditClick = (block: Block) => {
    setEditControl({ editingForBlock: block });

    if (solvingScene !== undefined) clearConnections()
  }

  const handleCancelBlockEditClick = () => {
    setEditControl({ editingForBlock: undefined });
  }

  const handleDropConnectionClick = (block: Block) => {
    setConnections(connections.filter(connection => !equals(connection.from, block)))

    if (solvingScene !== undefined) clearConnections()
  }

  const handleConnectBlockClick = (block: Block) => {
    const sequence = connections.filter(({ from, to }) => equals(from, editControl.editingForBlock) && equals(to, block)).length;

    setConnections([...connections, { from: editControl.editingForBlock as Block, to: block, sequenceItHasBeenAddedConsideringEquals: sequence }])
    setEditControl({ editingForBlock: undefined })
  }

  const handleIncrementResourceQuantityClick = (block: Block) => {
    updateBlock(block)

    if (solvingScene !== undefined) clearConnections()
  }

  const handleDecrementResourceQuantityClick = (block: Block) => {
    updateBlock(block)

    if (solvingScene !== undefined) clearConnections()
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
    setSolvingScenario(scenario);

    if (scenario.length === 0) window.alert("The system will generate a deadlock error!")
    else setSolvingScene(0);
  }

  const handleSelectScene = (sceneNumber: number) => {
    setSolvingScene(sceneNumber)
  }

  const handleDeleteAll = () => {
    clearConnections()
    clearAll()
  }

  const clearAll = () => {
    deleteAll()
    setBlockControl(Object.keys(BlockTypeEnum).map(v => { return { type: v as BlockType, idCounter: 0 } }))
    setEditControl({ editingForBlock: undefined })
  }

  const clearConnections = () => {
    setConnections([])
    setSolvingScene(undefined)
    setSolvingScenario([])
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
          {solvingScenario.map(({ sequence }) => (
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
            isWaitingSelection={isBlockWaitingSelection(block, editControl.editingForBlock)}
            isInEditConnectionMode={equals(block, editControl.editingForBlock)}
            position={block.position}
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
                positionFrom: from.position,
                positionTo: to.position,
                lineSlackness: 0.2,
                deviation: deviationBaseNumber * sequenceItHasBeenAddedConsideringEquals
              }
            })
            :
            solvingScenario[solvingScene].blockConnections.map(({ from, to, sequenceItHasBeenAddedConsideringEquals }) => {
              return {
                positionFrom: from.position,
                positionTo: to.position,
                lineSlackness: 0.2,
                deviation: deviationBaseNumber * sequenceItHasBeenAddedConsideringEquals
              }
            })
        } />
      </main>
    </>
  )
}