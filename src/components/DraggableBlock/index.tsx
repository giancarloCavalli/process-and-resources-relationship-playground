import * as S from './styles';
import React, { useRef } from 'react';
import { Block } from '../../types/block';
import { Position } from '../../types/position';

type Props = {
  block: Block;
  position: Position;
  onPositionChange: (block: Block, top: number, left: number) => void
  onAddConnectionButtonClick?: () => void
  onDropConnectionButtonClick?: () => void
  onConfirmConnectionButtonClick?: () => void
}

export const DraggableBlock = ({
  block,
  position,
  onPositionChange,
  onAddConnectionButtonClick,
  onDropConnectionButtonClick,
  onConfirmConnectionButtonClick
}: Props) => {

  const handleAddConnectionButtonClick = () => {

  }

  const handleDropConnectionButtonClick = () => {

  }

  const handleConfirmConnectionButtonClick = () => {

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
    onPositionChange(block, wrapperRef.current ? wrapperRef.current.offsetTop - pos2 : 0, wrapperRef.current ? wrapperRef.current.offsetLeft - pos1 : 0)
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
      <S.Block type={block.type}>
        <span>{block.type === 'PROCESS' ? "P" : "R"}{block.id}</span>
      </S.Block>

      <S.ButtonWrapper>
        {false &&
          <S.Button onClick={handleConfirmConnectionButtonClick}>+</S.Button>
        }
        {true &&
          <>
            <S.SmallButton backgroundColor='green' onClick={handleAddConnectionButtonClick}>+</S.SmallButton>
            <S.SmallButton backgroundColor='red' onClick={handleDropConnectionButtonClick}>-</S.SmallButton>
          </>
        }
      </S.ButtonWrapper>
    </S.Wrapper>
  )
}