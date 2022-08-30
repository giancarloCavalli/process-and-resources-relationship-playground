import * as S from './styles';
import React, { useContext, useRef } from 'react';
import { BlockContext } from '../context';
import { Block } from './types';
import { BlockContextType } from '../types';
import { equals } from '../helpers';
import { ResourceButtonsAndCounter } from './ResourceButtonsAndCounter';

type Props = {
  block: Block;
  isWaitingSelection: boolean;
  isInEditConnectionMode: boolean;
}

export const DraggableBlock = ({
  block,
  isWaitingSelection,
  isInEditConnectionMode,
}: Props) => {

  const limits = {
    MIN_RESOURCE: 1,
    MAX_RESOURCE: 4
  }

  const {
    updateBlock, updateEditingBlock, connections, updateConnections, clearConnections, editingBlock,
    solvingScene
  } = useContext(BlockContext) as BlockContextType

  const handleStartConnectingClick = () => {
    updateEditingBlock(block)
    if (solvingScene !== undefined) clearConnections()
  }

  const handleCancelStartConnectingClick = () => {
    updateEditingBlock(undefined)
  }

  const handleDropConnectionButtonClick = () => {
    updateConnections(connections.filter(connection => !equals(connection.from, block)))
    if (solvingScene !== undefined) clearConnections()
  }

  const handleConnectToClick = () => {
    const sequence = connections.filter(({ from, to }) => equals(from, editingBlock) && equals(to, block)).length;

    updateConnections([...connections, { from: editingBlock as Block, to: block, sequenceItHasBeenAddedConsideringEquals: sequence }])
    updateEditingBlock(undefined)
  }

  const handleIncrementResourceQuantity = () => {
    if (block.resourceQuantity < limits.MAX_RESOURCE) {
      block.resourceQuantity++
      updateBlock(block)
    }
  }

  const handleDecrementResourceQuantity = () => {
    if (block.resourceQuantity > limits.MIN_RESOURCE) {
      block.resourceQuantity--
      updateBlock(block)
    }
  }

  const wrapperRef = useRef<HTMLDivElement>(null);

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const dragMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

    event.preventDefault();
    pos3 = event.clientX;
    pos4 = event.clientY;

    document.onmouseup = closeDragElement;

    document.onmousemove = elementDrag;
  }

  function elementDrag(event: MouseEvent) {
    event = event || window.event;
    event.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;

    // set the element's new position:
    const top = wrapperRef.current ? wrapperRef.current.offsetTop - pos2 : 0
    const left = wrapperRef.current ? wrapperRef.current.offsetLeft - pos1 : 0
    block.position = { top, left }
    updateBlock(block)
  }

  const closeDragElement = () => {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  const { id, position } = block

  return (
    <S.Wrapper
      id={id}
      onMouseDown={(event) => dragMouseDown(event)}
      ref={wrapperRef}
      left={`${position.left}px`}
      top={`${position.top}px`}
    >
      {
        block.type === 'RESOURCE' &&
        <ResourceButtonsAndCounter
          resourceQuantity={block.resourceQuantity}
          handleIncrementResourceQuantity={handleIncrementResourceQuantity}
          handleDecrementResourceQuantity={handleDecrementResourceQuantity}
        />
      }

      <S.Block type={block.type}>
        <span>{block.type === 'PROCESS' ? "P" : "R"}{block.id}</span>
      </S.Block>

      <S.ButtonWrapper>
        {isWaitingSelection &&
          <S.Button backgroundColor='green' onClick={handleConnectToClick}>+</S.Button>
        }

        {isInEditConnectionMode &&
          <S.Button backgroundColor='red' onClick={handleCancelStartConnectingClick}>X</S.Button>
        }

        {!isWaitingSelection && !isInEditConnectionMode &&
          <>
            <S.SmallButton backgroundColor='green' onClick={handleStartConnectingClick}>+</S.SmallButton>
            <S.SmallButton backgroundColor='red' onClick={handleDropConnectionButtonClick}>-</S.SmallButton>
          </>
        }
      </S.ButtonWrapper>
    </S.Wrapper>
  )
}
