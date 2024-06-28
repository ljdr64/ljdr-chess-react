import React, { useContext, useEffect, useMemo, useState } from 'react';
import Piece from '../Piece';
import { ChessBoardContext } from '../../Context';
import { isMoveLegal } from '../../ChessMoves';
import PromotionPawn from '../PromotionPawn';

const ChessBoard = () => {
  const context = useContext(ChessBoardContext);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [draggingPiece, setDraggingPiece] = useState('empty');
  const [currentSquare, setCurrentSquare] = useState(null);
  const [dragStartSquare, setDragStartSquare] = useState(null);
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

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
      if (square === 'g1') {
        newNotation = ` ${context.fullmoveNumber}. 0-0`;
      }
      if (square === 'c1') {
        newNotation = ` ${context.fullmoveNumber}. 0-0-0`;
      }
    }

    if (fromPiece === 'k' && fromPosition === 'e8') {
      if (square === 'g8') {
        newNotation = ' 0-0\n';
      }
      if (square === 'c8') {
        newNotation = ' 0-0-0\n';
      }
    }

    context.setNotation((prevNotation) => prevNotation + newNotation);
  };

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging]);

  function handleMouseClick(square) {
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
      context.handlePieceMove(currentSquare, square);
      context.setCurrentTurn(
        context.currentTurn === 'white' ? 'black' : 'white'
      );
      setDragStartSquare(null);
      setHighlightedSquare(null);
      setPossibleMoves([]);
    }
  }

  function handleMouseDown(e, square, piece) {
    if (e.cancelable) {
      e.preventDefault();
    }

    if (piece === 'empty') return;

    if (possibleMoves.some((item) => item === square)) {
      context.handlePieceMove(currentSquare, square);
      context.setCurrentTurn(
        context.currentTurn === 'white' ? 'black' : 'white'
      );
      setDragStartSquare(null);
      setHighlightedSquare(null);
      setPossibleMoves([]);
      return;
    }

    console.log('Promote: ', piece, currentSquare, square);
    if (
      (piece === 'P' && square[1] === '8') ||
      (piece === 'p' && square[1] === '1')
    ) {
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      return;
    }

    setDragStartSquare(square);
    const moves = calculatePossibleMoves(piece, square, context.board2DArray);
    setPossibleMoves(moves);

    const pieceMove = document.getElementById(square);
    if (pieceMove) {
      const offsetX = e.clientX - pieceMove.getBoundingClientRect().left - 24;
      const offsetY = e.clientY - pieceMove.getBoundingClientRect().top - 24;
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
      posX: pieceArea.offsetLeft + 24,
      posY: pieceArea.offsetTop + 24,
    };

    const moves = calculatePossibleMoves(
      draggingPiece,
      currentSquare,
      context.board2DArray
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
        e.clientX - squarePos[item].posX + window.scrollX <= 47 &&
        e.clientY - squarePos[item].posY + window.scrollY <= 47 &&
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
              context.fen
            )
          ) {
            console.log(
              `${draggingPiece} ${currentSquare}-${squarePieceDrop[0]} ${context.currentTurn}`
            );
            formatNotation(
              draggingPiece,
              currentSquare,
              piece,
              squarePieceDrop[0]
            );
            context.handlePieceMove(currentSquare, squarePieceDrop[0]);
            context.setCurrentTurn(
              context.currentTurn === 'white' ? 'black' : 'white'
            );
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

    console.log(
      'Position: ',
      position,
      draggingPiece,
      currentSquare,
      squarePieceDrop
    );
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
    isWhiteInCheck,
    isBlackInCheck,
    isPromotedWhitePawn,
    isPromotedBlackPawn
  ) => {
    if (isPromotedWhitePawn || isPromotedBlackPawn) {
      return 'bg-blue-500';
    } else if ((isWhiteInCheck || isBlackInCheck) && isLightSquare) {
      return 'bg-red-400';
    } else if ((isWhiteInCheck || isBlackInCheck) && !isLightSquare) {
      return 'bg-red-500';
    } else if (isHighlighted || isDragStartSquare) {
      return 'bg-green-300';
    } else if (isPossibleMove && isLightSquare) {
      return 'bg-green-600 hover:bg-green-300';
    } else if (isPossibleMove && !isLightSquare) {
      return 'bg-green-700 hover:bg-green-300';
    } else if (isLightSquare) {
      return 'bg-amber-200';
    } else {
      return 'bg-amber-700';
    }
  };

  return (
    <div className="board-container mx-auto select-none">
      <div className="flex flex-wrap w-96 cursor-pointer select-none">
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
            const isWhiteInCheck =
              piece === 'K' && context.isWhiteKingInCheck(context.board2DArray);
            const isBlackInCheck =
              piece === 'k' && context.isBlackKingInCheck(context.board2DArray);
            const isPromotedWhitePawn = piece === 'P' && rank === 8;
            const isPromotedBlackPawn = piece === 'p' && rank === 1;
            const isDragStartSquare = dragStartSquare === square;

            const squareClass = getSquareClass(
              isLightSquare,
              isHighlighted,
              isDragStartSquare,
              isPossibleMove,
              isWhiteInCheck,
              isBlackInCheck,
              isPromotedWhitePawn,
              isPromotedBlackPawn
            );

            return (
              <div
                key={square}
                ref={squareRefs[square]}
                className={`w-12 h-12 flex items-center justify-center cursor-pointer ${squareClass}`}
                onMouseDown={(e) => handleMouseDown(e, square, piece)}
                onTouchStart={(e) => handleStart(e, square, piece)}
                onClick={() => handleMouseClick(square)}
              >
                {currentSquare === square ? (
                  <>
                    {isPromotedWhitePawn && piece === 'P' && (
                      <div className="shadow-lg h-auto mt-[144px] z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    {isPromotedBlackPawn && piece === 'p' && (
                      <div className="shadow-lg h-auto mb-[144px] z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    <div
                      ref={pieceRefs[square]}
                      className="card w-12 h-12 cursor-pointer"
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
                    {isPromotedWhitePawn && piece === 'P' && (
                      <div className="shadow-lg h-auto mt-[144px] z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    {isPromotedBlackPawn && piece === 'p' && (
                      <div className="shadow-lg h-auto mb-[144px] z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    <div
                      ref={pieceRefs[square]}
                      className="card w-12 h-12 cursor-pointer"
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
