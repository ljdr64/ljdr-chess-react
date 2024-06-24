import React, { useContext, useRef, useState } from 'react';
import Piece from '../Piece';
import { ChessBoardContext } from '../../Context';

const Draggable = () => {
  const context = useContext(ChessBoardContext);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [draggingPiece, setDraggingPiece] = useState('empty');
  const [currentSquare, setCurrentSquare] = useState(null);

  let squarePieceDrop = [null, 'empty']
  const squareRefs = {};
  const pieceRefs = {};
  context.board2DArray.forEach((row, rowIndex) =>
    row.forEach((piece, colIndex) => {
      const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
      const rank = 8 - rowIndex;
      const square = `${file}${rank}`;
      squareRefs[square] = useRef(null);
      pieceRefs[square] = useRef(null);
    })
  );

  function handleMouseDown(e, square, piece) {
    if (piece === 'empty') return;

    setDraggingPiece(piece);
    setCurrentSquare(square);

    setIsDragging(true);
    setPosition({ x: 0, y: 0 });
  }

  function handleMouseMove(e) {
    const pieceArea = pieceRefs[currentSquare].current;
    const piecePos = {
      posX: pieceArea.offsetLeft + 24,
      posY: pieceArea.offsetTop + 24,
    }
    if (isDragging) {
      const newX = e.clientX - piecePos.posX;
      const newY = e.clientY - piecePos.posY;
      setPosition({ x: newX, y: newY });
    }
  }

  function handleMouseUp() {
    if (!isDragging) return;

    const squareArea = {};
    const squarePos = {};

    const pieceArea = pieceRefs[currentSquare].current;
    const piecePos = {
      posX: pieceArea.offsetLeft,
      posY: pieceArea.offsetTop,
    }

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
          position.y >= squarePos[square].posY - piecePos.posY - 24 &&
          position.y <= squarePos[square].posY - piecePos.posY + 24 &&
          position.x >= squarePos[square].posX - piecePos.posX - 24 &&
          position.x <= squarePos[square].posX - piecePos.posX + 24
        ) {
          setPosition({
            x: squarePos[square].posX - piecePos.posX,
            y: squarePos[square].posY - piecePos.posY
          });
          squarePieceDrop = [square, piece];
          positionFound = true;
        }
      });
    });

    if (!positionFound) {
      setPosition({ x: 0, y: 0 });
      squarePieceDrop = [null, 'empty'];
    }

    console.log('Position: ', position, draggingPiece, currentSquare, squarePieceDrop);
    setIsDragging(false);
  }

  return (
    <div className="container mx-auto mt-4 select-none">
      <div className="flex flex-wrap w-96 cursor-pointer select-none">
        {context.board2DArray.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
            const rank = 8 - rowIndex;
            const square = `${file}${rank}`;
            const isLightSquare = (colIndex + rowIndex) % 2 === 0;
            const isSelectSquare = currentSquare === square;

            return (
              <div
                key={square}
                ref={squareRefs[square]}
                className={`w-12 h-12 flex items-center justify-center cursor-pointer ${isSelectSquare
                  ? 'bg-green-200'
                  : isLightSquare
                    ? 'bg-amber-200'
                    : 'bg-amber-700'
                  }`}
                onMouseDown={(e) => handleMouseDown(e, square, piece)}
              >
                {currentSquare === square ?
                  (<div
                    ref={pieceRefs[square]}
                    className="card w-12 h-12 cursor-pointer"
                    style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <div className='h-full pointer-events-none'>
                      {currentSquare === square && piece !== 'empty' && <Piece piece={piece} />}
                    </div>
                  </div>) : (
                    <div
                      ref={pieceRefs[square]}
                      className="card w-12 h-12 cursor-pointer"
                    >
                      <div className='h-full pointer-events-none'>
                        {piece !== 'empty' && <Piece piece={piece} />}
                      </div>
                    </div>
                  )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Draggable;