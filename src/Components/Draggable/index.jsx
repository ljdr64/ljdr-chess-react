import React, { useRef, useState } from 'react';
import Piece from '../Piece';

const Draggable = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const dropAreaRef = useRef(null);

  function handleMouseDown(e) {
    const element = elementRef.current;
    const posX = element.offsetLeft;
    const posY = element.offsetTop;
    setIsDragging(true);
    setPosition({ x: e.clientX - posX - 24, y: e.clientY - posY - 24 });
  }

  function handleMouseMove(e) {
    const element = elementRef.current;
    const posX = element.offsetLeft;
    const posY = element.offsetTop;
    if (isDragging) {
      const newX = e.clientX - posX - 24;
      const newY = e.clientY - posY - 24;
      setPosition({ x: newX, y: newY });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
    if (position.y >= 180 && position.y <= 350 &&
      position.x >= -50 && position.x <= 50
    ) {
      setPosition({ x: 0, y: 300})
    } 
    if (position.y >= -50 && position.y <= 50 &&
      position.x >= -50 && position.x <= 50
    ) {
      setPosition({ x: 0, y: 0})
    }
  }

  return (
    <div className="container mx-auto mt-4 select-none">
      <div
        className="absolute w-12 h-12 rounded-md shadow-md pointer-events-none"
        style={{
          backgroundColor: 'rgba(0, 0, 255, 0.3)',
          top: '20',
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
      ></div>
      <div
        ref={elementRef}
        id="element"
        className="card bg-blue-500 w-12 h-12 rounded-md shadow-md cursor-pointer"
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
          transform: 'translate(0, -50%)',
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