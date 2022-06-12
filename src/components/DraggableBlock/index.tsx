import React, { useRef } from 'react';
import { useState } from 'react';
import { Block } from '../../types/block';
import { BlockType } from '../../types/blockType';
import * as S from './styles';

type Position = {
  top: string,
  left: string
}

type Props = {
  block: Block;
  dependsOnBlockId?: number
}

export const DraggableBlock = ({ block, dependsOnBlockId }: Props) => {

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<Position>({ top: "50px", left: "10px" });

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
    setPosition({
      top: `${wrapperRef.current ? wrapperRef.current.offsetTop - pos2 : 0}px`,
      left: `${wrapperRef.current ? wrapperRef.current.offsetLeft - pos1 : 0}px`
    })
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
      left={position.left}
      top={position.top}
      type={block.type}
    >
      <span>{block.type === 'PROCESS' ? "P" : "R"}{block.id}</span>
    </S.Wrapper>
  )
}