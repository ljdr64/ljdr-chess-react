import React, { useContext, useRef, useState } from 'react';
import Piece from '../Piece';
import { ChessBoardContext } from '../../Context';
import ChessSquare from '../ChessSquare';

const Draggable = () => {
  const context = useContext(ChessBoardContext);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [squarePieceDrop, setSquarePieceDrop] = useState([null, 'empty']);
  const elementRef = useRef(null);

  const squareRefs = {};
  context.board2DArray.forEach((row, rowIndex) =>
    row.forEach((piece, colIndex) => {
      const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
      const rank = 8 - rowIndex;
      const square = `${file}${rank}`;
      squareRefs[square] = useRef(null);
    })
  );

  let dimension = { width: 0, height: 0 };
  let positionElement = { x: 0, y: 0 };

  function handleMouseDown(e) {
    const element = elementRef.current;
    dimension = { width: element.clientWidth, height: element.clientHeight };

    const posX = element.offsetLeft;
    const posY = element.offsetTop;
    positionElement = { x: posX, y: posY };

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
    const element = elementRef.current;
    dimension = { width: element.clientWidth, height: element.clientHeight };

    const posX = element.offsetLeft;
    const posY = element.offsetTop;
    positionElement = { x: posX, y: posY };
    console.log('Element: ', positionElement);

    const squareArea = {};
    const squarePos = {};
    context.board2DArray.forEach((row, rowIndex) =>
      row.forEach((piece, colIndex) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;
        squareArea[square] = squareRefs[square].current;
        squarePos[square] = {
          posX: squareArea[square].offsetLeft,
          posY: squareArea[square].offsetTop,
        }
      })
    );

    let positionFound = false;
    context.board2DArray.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;

        if (
          position.y >= squarePos[square].posY - posY - 36 &&
          position.y <= squarePos[square].posY - posY + 36 &&
          position.x >= squarePos[square].posX - posX - 36 &&
          position.x <= squarePos[square].posX - posX + 36
        ) {
          setPosition({
            x: squarePos[square].posX - posX,
            y: squarePos[square].posY - posY
          });
          setSquarePieceDrop([square, piece])
          positionFound = true;
        }
      });
    });

    if (!positionFound) {
      setPosition({ x: 0, y: 0 })
      setSquarePieceDrop([null, 'empty'])
    }

    console.log('Position: ', position, squarePieceDrop);
    setIsDragging(false);
  }

  return (
    <div className="container mx-auto mt-4 select-none">
      <div
        className="flex flex-wrap w-96 cursor-pointer select-none"
      >
        {context.board2DArray.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
            const rank = 8 - rowIndex;
            const square = `${file}${rank}`;
            const isLightSquare = (colIndex + rowIndex) % 2 === 0;

            return (
              <div
                ref={squareRefs[square]}
              >
                <div className='h-full pointer-events-none'>
                  <ChessSquare
                    key={square}
                    square={square}
                    piece={piece}
                    isLightSquare={isLightSquare}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
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
        <div className='h-full pointer-events-none bg-blue-200'>
          <Piece piece={'N'} />
        </div>
      </div>
    </div>
  );
};

export default Draggable;