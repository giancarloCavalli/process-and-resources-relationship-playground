import * as S from './styles';
import React, { useContext, useRef } from 'react';
import { Block, BlockContextType } from '../../types/block';
import { Position } from '../../types/position';
import { BlockContext } from '../../context/blockContext';

type Props = {
  block: Block;
  position: Position;
  isWaitingSelection: boolean;
  isInEditConnectionMode: boolean;
  onEditButtonClick: (block: Block) => void
  onCancelEditButtonClick: () => void
  onDropConnectionButtonClick: (block: Block) => void
  onConnectButtonClick: (block: Block) => void
  onIncrementResourceQuantityClick: (block: Block) => void
  onDecrementResourceQuantityClick: (block: Block) => void
}

export const DraggableBlock = ({
  block,
  position,
  isWaitingSelection,
  isInEditConnectionMode,
  onEditButtonClick,
  onCancelEditButtonClick,
  onDropConnectionButtonClick,
  onConnectButtonClick,
  onIncrementResourceQuantityClick,
  onDecrementResourceQuantityClick
}: Props) => {

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
    if (block.resourceQuantity < 4) {
      const resourceQuantity = block.resourceQuantity + 1
      onIncrementResourceQuantityClick({ ...block, resourceQuantity })
    }
  }

  const handleDecrementResourceQuantity = () => {
    if (block.resourceQuantity > 1) {
      const resourceQuantity = block.resourceQuantity - 1
      onDecrementResourceQuantityClick({ ...block, resourceQuantity })
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

  return (
    <S.Wrapper
      id={block.id}
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