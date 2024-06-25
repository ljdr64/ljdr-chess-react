import React, { useContext, useRef, useState } from 'react';
import Piece from '../Piece';
import { ChessBoardContext } from '../../Context';
import { isMoveLegal } from '../../ChessMoves';

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

  const sameType = (string1, string2) => {
    return (
      string1 !== 'empty' &&
      string2 !== 'empty' &&
      (/[a-z]/.test(string1) === /[a-z]/.test(string2) ||
        /[A-Z]/.test(string1) === /[A-Z]/.test(string2))
    );
  };

  const validateTurn = (piece) => {
    return (
      piece !== 'empty' &&
      ((context.currentTurn === 'white' && piece === piece.toUpperCase()) ||
        (context.currentTurn === 'black' && piece === piece.toLowerCase()))
    );
  };

  const getPieceAtSquare = (square) => {
    const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - square[1];
    const piece = context.board2DArray[rank][file];
    return piece;
  };

  const calculatePossibleMoves = (piece, fromSquare, board) => {
    const possibleMoves = [];
    board.forEach((row, rowIndex) => {
      row.forEach((targetPiece, colIndex) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;
        if (
          !sameType(piece, targetPiece) &&
          isMoveLegal(piece, square, fromSquare, board, context.fen)
        ) {
          possibleMoves.push(square);
        }
      });
    });

    return possibleMoves;
  };

  const formatNotation = (fromPiece, fromPosition, piece, square) => {
    let newNotation = '';

    if (piece === 'empty') {
      if (fromPiece === fromPiece.toLowerCase() && !(fromPiece === 'p')) {
        newNotation = ` ${fromPiece.toUpperCase()}${square}\n`;
      } else if (fromPiece === 'P' && fromPosition[0] === square[0]) {
        newNotation = ` ${context.fullmoveNumber}. ${square}`;
      } else if (fromPiece === 'P' && fromPosition[0] !== square[0]) {
        newNotation = ` ${context.fullmoveNumber}. ${fromPosition[0]}x${square}`;
      } else if (fromPiece === 'p' && fromPosition[0] === square[0]) {
        newNotation = ` ${square}\n`;
      } else if (fromPiece === 'p' && fromPosition[0] !== square[0]) {
        newNotation = ` ${fromPosition[0]}x${square}\n`;
      } else {
        newNotation = ` ${context.fullmoveNumber}. ${fromPiece}${square}`;
      }
    } else {
      if (fromPiece === fromPiece.toLowerCase() && !(fromPiece === 'p')) {
        newNotation = ` ${fromPiece.toUpperCase()}x${square}\n`;
      } else if (fromPiece === 'P') {
        newNotation = ` ${context.fullmoveNumber}. ${fromPosition[0]}x${square}`;
      } else if (fromPiece === 'p') {
        newNotation = ` ${fromPosition[0]}x${square}\n`;
      } else {
        newNotation = ` ${context.fullmoveNumber}. ${fromPiece}x${square}`;
      }
    }

    if (fromPiece === 'K' && fromPosition === 'e1') {
      if (square === 'g1') { newNotation = ` ${context.fullmoveNumber}. 0-0` }
      if (square === 'c1') { newNotation = ` ${context.fullmoveNumber}. 0-0-0` }
    }

    if (fromPiece === 'k' && fromPosition === 'e8') {
      if (square === 'g8') { newNotation = ' 0-0\n' }
      if (square === 'c8') { newNotation = ' 0-0-0\n' }
    }

    context.setNotation(prevNotation => prevNotation + newNotation);
  };

  function handleMouseDown(e, square, piece) {
    if (piece === 'empty') return;

    const pieceMove = document.getElementById(square);
    if (pieceMove) {
      const offsetX = e.clientX - pieceMove.getBoundingClientRect().left - 24;
      const offsetY = e.clientY - pieceMove.getBoundingClientRect().top - 24;
      setPosition({ x: offsetX, y: offsetY });
      setIsDragging(true);
    }

    setDraggingPiece(piece);
    setCurrentSquare(square);
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
          squarePieceDrop = [square, piece];
          positionFound = true;
          if (
            !sameType(draggingPiece, squarePieceDrop[1]) &&
            isMoveLegal(
              draggingPiece,
              squarePieceDrop[0],
              currentSquare,
              context.board2DArray,
              context.fen)) {
            console.log(
              `${draggingPiece} ${currentSquare}-${squarePieceDrop[0]} ${context.currentTurn}`
            );
            formatNotation(draggingPiece, currentSquare, piece, squarePieceDrop[0])
            context.handlePieceMove(currentSquare, squarePieceDrop[0]);
            context.setCurrentTurn(
              context.currentTurn === 'white' ? 'black' : 'white'
            );
            setPosition({
              x: squarePos[square].posX - piecePos.posX,
              y: squarePos[square].posY - piecePos.posY
            });
          } else {
            setPosition({ x: 0, y: 0 });
            squarePieceDrop = [null, 'empty'];
          }
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
                    <div
                      id={square}
                      className='h-full pointer-events-none'>
                      {currentSquare === square && piece !== 'empty' && <Piece piece={piece} />}
                    </div>
                  </div>) : (
                    <div
                      ref={pieceRefs[square]}
                      className="card w-12 h-12 cursor-pointer"
                    >
                      <div
                        id={square}
                        className='h-full pointer-events-none'>
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