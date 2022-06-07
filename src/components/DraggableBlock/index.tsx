import React, { useRef } from 'react';
import { useState } from 'react';
import { BlockType } from '../../types/blockType';
import * as S from './styles';

type Position = {
  top: string,
  left: string
}

type Props = {
  type: BlockType
}

export const DraggableBlock = ({ type }: Props) => {

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<Position>({ top: "0px", left: "0px" });

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const dragMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log("passei aqui uhul")

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
      onMouseDown={(event) => dragMouseDown(event)}
      ref={wrapperRef}
      left={position.left}
      top={position.top}
      type={type}
    >
      <span>{type === 'PROCESS' ? "P" : "R"}</span>
    </S.Wrapper>
  )
}