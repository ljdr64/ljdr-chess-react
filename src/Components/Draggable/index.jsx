import React, { useEffect, useRef, useState } from 'react';
import Piece from '../Piece';

const Draggable = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const dropAreaRef = useRef(null);
  let dimension = { width: 0, height: 0 };
  let positionElement = { x: 0, y: 0 };
  let positionDropArea = { x: 0, y: 0 };

  function handleMouseDown(e) {
    const element = elementRef.current;
    dimension = { width: element.clientWidth, height: element.clientHeight };

    const posX = element.offsetLeft;
    const posY = element.offsetTop;
    positionElement = { x: posX, y: posY };
    console.log('Element: ', positionElement);

    setIsDragging(true);
    setPosition({ x: e.clientX - posX - dimension.width / 2, y: e.clientY - posY - dimension.height / 2 });
  }

  function handleMouseMove(e) {
    const element = elementRef.current;
    dimension = { width: element.clientWidth, height: element.clientHeight };

    const posX = element.offsetLeft;
    const posY = element.offsetTop;

    if (isDragging) {
      const newX = e.clientX - posX - dimension.width / 2;
      const newY = e.clientY - posY - dimension.height / 2;
      setPosition({ x: newX, y: newY });
    }
  }

  function handleMouseUp() {
    const dropArea = dropAreaRef.current;
    const element = elementRef.current;
    dimension = { width: element.clientWidth, height: element.clientHeight };

    const posX = element.offsetLeft;
    const posY = element.offsetTop;
    positionElement = { x: posX, y: posY };
    console.log('Element: ', positionElement);

    const dropPosX = dropArea.offsetLeft;
    const dropPosY = dropArea.offsetTop;
    positionDropArea = { x: dropPosX, y: dropPosY };
    console.log('Drop Area: ', positionDropArea);

    console.log('Position: ', position);

    setIsDragging(false);
    if (position.y >= dropPosY - posY - dimension.width
       && position.y <= dropPosY - posY + dimension.width
       && position.x >= dropPosX - posX - dimension.height 
       && position.x <= dropPosX - posX + dimension.height
    ) {
      setPosition({ x: dropPosX - posX, y: dropPosY - posY})
    } else {
      setPosition({ x: 0, y: 0})
    }
  }

  return (
    <div className="container mx-auto mt-4 select-none">
      <div
        className="absolute w-12 h-12 bg-blue-500 rounded-md shadow-md pointer-events-none"
        style={{
          top: '20',
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
      ></div>
      <div
        ref={elementRef}
        id="element"
        className="card w-12 h-12 rounded-md cursor-pointer"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className='h-full pointer-events-none'>
          <Piece piece={'N'} />
        </div>
        
      </div>
      <div
        ref={dropAreaRef}
        className="drop-area absolute w-12 h-12 top-[460px] rounded-md shadow-md cursor-pointer select-none"
        style={{
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
          pointerEvents: 'none',
        }}
      >        
        <div className='h-full pointer-events-none'>
          <Piece piece={'n'} />
        </div>
      </div>
    </div>
  );
};

export default Draggable;