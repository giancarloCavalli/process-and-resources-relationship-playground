import * as S from './styles';
import React, { useContext, useRef } from 'react';
import { Block, BlockContextType } from '../../types/block';
import { BlockContext } from '../../context/blockContext';

type Props = {
  block: Block;
  isWaitingSelection: boolean;
  isInEditConnectionMode: boolean;
  onEditButtonClick: (block: Block) => void
  onCancelEditButtonClick: () => void
  onDropConnectionButtonClick: (block: Block) => void
  onConnectButtonClick: (block: Block) => void
}

export const DraggableBlock = ({
  block,
  isWaitingSelection,
  isInEditConnectionMode,
  onEditButtonClick,
  onCancelEditButtonClick,
  onDropConnectionButtonClick,
  onConnectButtonClick
}: Props) => {

  const limits = {
    MIN_RESOURCE: 1,
    MAX_RESOURCE: 4
  }

  const { updateBlock } = useContext(BlockContext) as BlockContextType

  const handleEditButtonClick = () => {
    onEditButtonClick(block)
  }

  const handleCancelEditButtonClick = () => {
    onCancelEditButtonClick()
  }

  const handleDropConnectionButtonClick = () => {
    onDropConnectionButtonClick(block)
  }

  const handleConnectButtonClick = () => {
    onConnectButtonClick(block)
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
      {block.type === 'RESOURCE'
        &&
        <div style={{ display: "flex", flexDirection: "column" }}>
          <S.ResourceCounterWrapper>
            {[...Array(block.resourceQuantity)].map((e, index) => (
              <S.ResourceSphere key={index} />
            ))}
          </S.ResourceCounterWrapper>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <S.SmallButton backgroundColor='orange' onClick={handleIncrementResourceQuantity}>+</S.SmallButton>
            <S.SmallButton backgroundColor='purple' onClick={handleDecrementResourceQuantity}>-</S.SmallButton>
          </div>
        </div>
      }

      <S.Block type={block.type}>
        <span>{block.type === 'PROCESS' ? "P" : "R"}{block.id}</span>
      </S.Block>

      <S.ButtonWrapper>
        {isWaitingSelection &&
          <S.Button backgroundColor='green' onClick={handleConnectButtonClick}>+</S.Button>
        }

        {isInEditConnectionMode &&
          <S.Button backgroundColor='red' onClick={handleCancelEditButtonClick}>X</S.Button>
        }

        {!isWaitingSelection && !isInEditConnectionMode &&
          <>
            <S.SmallButton backgroundColor='green' onClick={handleEditButtonClick}>+</S.SmallButton>
            <S.SmallButton backgroundColor='red' onClick={handleDropConnectionButtonClick}>-</S.SmallButton>
          </>
        }
      </S.ButtonWrapper>
    </S.Wrapper>
  )
}