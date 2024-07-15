import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ChessBoardContext } from '../../Context';
import { useSquareSize } from '../../Hooks/useSquareSize';
import Piece from '../Piece';
import PromotionPawn from '../PromotionPawn';
import { isMoveLegal } from '../../ChessMoves';
import { formatNotation } from '../../utils/formatNotation';
import { calculatePossibleMoves } from '../../utils/calculatePossibleMoves';
import { sameType } from '../../utils/sameType';
import { isBlackKingInCheck, isWhiteKingInCheck } from '../../KingInCheck';
import './styles.css';

const ChessBoard = () => {
  const context = useContext(ChessBoardContext);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [draggingPiece, setDraggingPiece] = useState('empty');
  const [currentSquare, setCurrentSquare] = useState(null);
  const [dragStartSquare, setDragStartSquare] = useState(null);
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const squareSize = useSquareSize();

  let squarePieceDrop = [null, 'empty'];

  const squareRefs = useMemo(() => {
    const refs = {};
    for (let rowIndex = 0; rowIndex < context.board2DArray.length; rowIndex++) {
      const row = context.board2DArray[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;
        refs[square] = React.createRef();
      }
    }
    return refs;
  }, [context.board2DArray]);

  const pieceRefs = useMemo(() => {
    const refs = {};
    for (let rowIndex = 0; rowIndex < context.board2DArray.length; rowIndex++) {
      const row = context.board2DArray[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;
        refs[square] = React.createRef();
      }
    }
    return refs;
  }, [context.board2DArray]);

  useEffect(() => {
    if (isDragging && !context.isClockZero) {
      document.addEventListener('mousemove', handleMouseMove, {
        passive: false,
      });
      document.addEventListener('touchmove', handleMove, { passive: false });
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMove);
    };
  }, [isDragging, context.isClockZero]);

  useEffect(() => {
    if (context.isClockZero) {
      setPosition({ x: 0, y: 0 });
      setDragStartSquare(null);
      setHighlightedSquare(null);
      setPossibleMoves([]);
    }
  }, [context.isClockZero]);

  function handleMouseClick(square) {
    if (draggingPiece === 'empty' || context.isClockZero) return;

    if (
      square !== currentSquare &&
      isMoveLegal(
        draggingPiece,
        square,
        currentSquare,
        context.board2DArray,
        context.fen
      )
    ) {
      if (
        (draggingPiece === 'P' && square[1] === '8') ||
        (draggingPiece === 'p' && square[1] === '1')
      ) {
        context.setPromotionModal(true);
        context.setPromotionNotation(
          formatNotation(
            draggingPiece,
            currentSquare,
            'empty',
            square,
            context.fullmoveNumber,
            context.board2DArray,
            context.fen
          )
        );
      } else {
        context.setCurrentTurn(
          context.currentTurn === 'white' ? 'black' : 'white'
        );
        context.setNotation(
          (prev) =>
            prev +
            formatNotation(
              draggingPiece,
              currentSquare,
              'empty',
              square,
              context.fullmoveNumber,
              context.board2DArray,
              context.fen
            )
        );
      }
      context.handlePieceMove(currentSquare, square);
      setDragStartSquare(null);
      setHighlightedSquare(null);
      setPossibleMoves([]);
    }
  }

  function handleMouseDown(e, square, piece) {
    if (e.cancelable) {
      e.preventDefault();
    }

    if (context.isClockZero) {
      return;
    }

    if (context.notation.endsWith('#')) {
      return;
    }

    if (possibleMoves.some((item) => item === square)) {
      if (
        (draggingPiece === 'P' && square[1] === '8') ||
        (draggingPiece === 'p' && square[1] === '1')
      ) {
        context.setPromotionModal(true);
        context.setPromotionNotation(
          formatNotation(
            draggingPiece,
            currentSquare,
            piece,
            square,
            context.fullmoveNumber,
            context.board2DArray,
            context.fen
          )
        );
      } else {
        context.setCurrentTurn(
          context.currentTurn === 'white' ? 'black' : 'white'
        );
        context.setNotation(
          (prev) =>
            prev +
            formatNotation(
              draggingPiece,
              currentSquare,
              piece,
              square,
              context.fullmoveNumber,
              context.board2DArray,
              context.fen
            )
        );
      }
      context.handlePieceMove(currentSquare, square);
      setDragStartSquare(null);
      setHighlightedSquare(null);
      setPossibleMoves([]);
      return;
    } else if (
      piece === 'empty' ||
      (context.currentTurn === 'white' && piece === piece.toLowerCase()) ||
      (context.currentTurn === 'black' && piece === piece.toUpperCase())
    ) {
      setDraggingPiece('empty');
      setDragStartSquare(null);
      setHighlightedSquare(null);
      setPossibleMoves([]);
      return;
    }

    if (
      (piece === 'P' && square[1] === '8') ||
      (piece === 'p' && square[1] === '1')
    ) {
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      return;
    }

    setDragStartSquare(square);
    const moves = calculatePossibleMoves(
      piece,
      square,
      context.board2DArray,
      context.fen
    );
    setPossibleMoves(moves);

    const pieceMove = document.getElementById(square);
    if (pieceMove) {
      const offsetX =
        e.clientX - pieceMove.getBoundingClientRect().left - squareSize / 2;
      const offsetY =
        e.clientY - pieceMove.getBoundingClientRect().top - squareSize / 2;
      setPosition({ x: offsetX, y: offsetY });
      setIsDragging(true);
    }
    setDraggingPiece(piece);
    setCurrentSquare(square);
    setHighlightedSquare(null);
  }

  function handleMouseMove(e) {
    const pieceArea = pieceRefs[currentSquare].current;
    const piecePos = {
      posX: pieceArea.offsetLeft + squareSize / 2,
      posY: pieceArea.offsetTop + squareSize / 2,
    };

    const moves = calculatePossibleMoves(
      draggingPiece,
      currentSquare,
      context.board2DArray,
      context.fen
    );
    moves.push(currentSquare);

    const squareArea = {};
    const squarePos = {};

    for (const item of moves) {
      squareArea[item] = squareRefs[item].current;
      squarePos[item] = {
        posX: squareArea[item].offsetLeft,
        posY: squareArea[item].offsetTop,
      };
      if (
        e.clientX - squarePos[item].posX + window.scrollX <= squareSize - 1 &&
        e.clientY - squarePos[item].posY + window.scrollY <= squareSize - 1 &&
        e.clientX - squarePos[item].posX + window.scrollX >= 0 &&
        e.clientY - squarePos[item].posY + window.scrollY >= 0
      ) {
        setHighlightedSquare(item);
        break;
      } else {
        setHighlightedSquare(null);
      }
    }

    if (isDragging) {
      let newX = e.clientX - piecePos.posX + window.scrollX;
      let newY = e.clientY - piecePos.posY + window.scrollY;
      setPosition({ x: newX, y: newY });
    }
  }

  function handleMouseUp() {
    if (context.isClockZero) {
      return;
    }

    if (!isDragging) return;

    const squareArea = {};
    const squarePos = {};

    const pieceArea = pieceRefs[currentSquare].current;
    const piecePos = {
      posX: pieceArea.offsetLeft,
      posY: pieceArea.offsetTop,
    };

    context.board2DArray.forEach((row, rowIndex) =>
      row.forEach((piece, colIndex) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;
        squareArea[square] = squareRefs[square].current;
        squarePos[square] = {
          posX: squareArea[square].offsetLeft,
          posY: squareArea[square].offsetTop,
        };
      })
    );

    let positionFound = false;
    context.board2DArray.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;

        if (
          position.y >=
            squarePos[square].posY - piecePos.posY - squareSize / 2 &&
          position.y <=
            squarePos[square].posY - piecePos.posY + squareSize / 2 - 1 &&
          position.x >=
            squarePos[square].posX - piecePos.posX - squareSize / 2 &&
          position.x <=
            squarePos[square].posX - piecePos.posX + squareSize / 2 - 1
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
              context.fen
            )
          ) {
            if (
              (draggingPiece === 'P' && squarePieceDrop[0][1] === '8') ||
              (draggingPiece === 'p' && squarePieceDrop[0][1] === '1')
            ) {
              context.setPromotionModal(true);
              context.setPromotionNotation(
                formatNotation(
                  draggingPiece,
                  currentSquare,
                  piece,
                  squarePieceDrop[0],
                  context.fullmoveNumber,
                  context.board2DArray,
                  context.fen
                )
              );
            } else {
              context.setCurrentTurn(
                context.currentTurn === 'white' ? 'black' : 'white'
              );
              context.setNotation(
                (prev) =>
                  prev +
                  formatNotation(
                    draggingPiece,
                    currentSquare,
                    piece,
                    squarePieceDrop[0],
                    context.fullmoveNumber,
                    context.board2DArray,
                    context.fen
                  )
              );
            }
            context.handlePieceMove(currentSquare, squarePieceDrop[0]);
            setPosition({
              x: squarePos[square].posX - piecePos.posX,
              y: squarePos[square].posY - piecePos.posY,
            });
            setDragStartSquare(null);
            setHighlightedSquare(null);
            setPossibleMoves([]);
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

    setIsDragging(false);
  }

  const handleStart = (e, square, piece) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const event = e.type === 'mousedown' ? e : e.touches[0];
    handleMouseDown(event, square, piece);
  };

  const handleMove = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const event = e.type === 'mousedown' ? e : e.touches[0];
    handleMouseMove(event);
  };

  const handleEnd = () => {
    handleMouseUp();
  };

  const getSquareClass = (
    isLightSquare,
    isHighlighted,
    isDragStartSquare,
    isPossibleMove,
    isPossibleTake,
    isWhiteInCheck,
    isBlackInCheck,
    isPromotedWhitePawn,
    isPromotedBlackPawn
  ) => {
    if (isPromotedWhitePawn || isPromotedBlackPawn) {
      return 'bg-blue-500';
    } else if ((isWhiteInCheck || isBlackInCheck) && isLightSquare) {
      return 'light-square bg-circle-check';
    } else if ((isWhiteInCheck || isBlackInCheck) && !isLightSquare) {
      return 'dark-square bg-circle-check';
    } else if (isHighlighted || isDragStartSquare) {
      return 'bg-green-700';
    } else if (isPossibleMove && isLightSquare && !isPossibleTake) {
      return 'light-square bg-circle-in-center hover:bg-green-700';
    } else if (isPossibleMove && !isLightSquare && !isPossibleTake) {
      return 'dark-square bg-circle-in-center hover:bg-green-700';
    } else if (isPossibleTake && isLightSquare) {
      return 'light-square bg-circle-take-piece hover:bg-green-700';
    } else if (isPossibleTake && !isLightSquare) {
      return 'dark-square bg-circle-take-piece hover:bg-green-700';
    } else if (isLightSquare) {
      return 'light-square';
    } else {
      return 'dark-square';
    }
  };

  return (
    <div className="board-container mx-auto select-none">
      {context.promotionModal && (
        <div className="flex absolute dim-board bg-gray-500 opacity-50 z-10"></div>
      )}
      <div className="flex flex-wrap dim-board cursor-pointer select-none">
        {context.board2DArray.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
            const rank = 8 - rowIndex;
            const square = `${file}${rank}`;
            const isLightSquare = (colIndex + rowIndex) % 2 === 0;
            const isHighlighted = highlightedSquare === square;
            const isPossibleMove = possibleMoves.some(
              (item) => item === square
            );
            const isPossibleTake = isPossibleMove && piece !== 'empty';
            const isWhiteInCheck =
              piece === 'K' &&
              isWhiteKingInCheck(context.board2DArray) &&
              !context.promotionModal;
            const isBlackInCheck =
              piece === 'k' &&
              isBlackKingInCheck(context.board2DArray) &&
              !context.promotionModal;
            const isPromotedWhitePawn = piece === 'P' && rank === 8;
            const isPromotedBlackPawn = piece === 'p' && rank === 1;
            const isDragStartSquare = dragStartSquare === square;

            const squareClass = getSquareClass(
              isLightSquare,
              isHighlighted,
              isDragStartSquare,
              isPossibleMove,
              isPossibleTake,
              isWhiteInCheck,
              isBlackInCheck,
              isPromotedWhitePawn,
              isPromotedBlackPawn
            );

            return (
              <div
                key={square}
                ref={squareRefs[square]}
                className={`dim-square flex items-center justify-center cursor-pointer ${squareClass}`}
                onMouseDown={(e) => handleMouseDown(e, square, piece)}
                onTouchStart={(e) => handleStart(e, square, piece)}
                onClick={() => handleMouseClick(square)}
              >
                {currentSquare === square ? (
                  <>
                    {isPromotedWhitePawn && (
                      <div className="shadow-lg h-auto promote-white z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    {isPromotedBlackPawn && (
                      <div className="shadow-lg h-auto promote-black z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    <div
                      ref={pieceRefs[square]}
                      className="card dim-square cursor-pointer"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                      }}
                      onMouseUp={handleMouseUp}
                      onTouchEnd={handleEnd}
                    >
                      <div id={square} className="h-full pointer-events-none">
                        {piece !== 'empty' && <Piece piece={piece} />}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {isPromotedWhitePawn && (
                      <div className="shadow-lg h-auto promote-white z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    {isPromotedBlackPawn && (
                      <div className="shadow-lg h-auto promote-black z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    <div
                      ref={pieceRefs[square]}
                      className="card dim-square cursor-pointer"
                    >
                      <div id={square} className="h-full pointer-events-none">
                        {piece !== 'empty' && <Piece piece={piece} />}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
