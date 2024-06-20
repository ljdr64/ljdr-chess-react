import { useContext, useState } from 'react';
import { ChessBoardContext } from '../../Context';
import ChessSquare from '../ChessSquare';
import { isMoveLegal } from '../../ChessMoves';

const ChessBoard = () => {
  const context = useContext(ChessBoardContext);
  const [fromPosition, setFromPosition] = useState(null);
  const [fromPiece, setFromPiece] = useState('empty');
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [draggedPiece, setDraggedPiece] = useState('empty');
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const [dragStartSquare, setDragStartSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

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

  const handleSquareClick = (square, piece) => {
    if (piece !== 'empty') {
      setHighlightedSquare(square);
    }
    if (fromPiece !== 'empty' || piece !== 'empty') {
      if (fromPosition === null) {
        setFromPosition(square);
        const moves = calculatePossibleMoves(
          piece,
          square,
          context.board2DArray
        );
        setPossibleMoves(moves);
      } else {
        if (fromPiece !== 'empty' && fromPosition !== square) {
          if (
            !sameType(fromPiece, piece) &&
            isMoveLegal(
              fromPiece,
              square,
              fromPosition,
              context.board2DArray,
              context.fen
            ) &&
            validateTurn(fromPiece)
          ) {
            console.log(
              `${fromPiece} ${fromPosition}-${square} ${context.currentTurn}`
            );
            context.handlePieceMove(fromPosition, square);
            context.setCurrentTurn(
              context.currentTurn === 'white' ? 'black' : 'white'
            );
          }
        }
        setFromPiece('empty');
        setFromPosition(null);
        setHighlightedSquare(null);
        setPossibleMoves([]);
      }
      setFromPiece(piece);
    }
  };

  const handleDragStart = (square, piece) => {
    if (piece !== 'empty') {
      setDraggedPiece(piece);
      setDraggedFrom(square);
      setHighlightedSquare(square);
      setDragStartSquare(square);
      const moves = calculatePossibleMoves(piece, square, context.board2DArray);
      setPossibleMoves(moves);
    }
  };

  const handleDragOver = (event, square) => {
    const piece = getPieceAtSquare(square);
    event.preventDefault();
    if (
      highlightedSquare !== square &&
      !sameType(draggedPiece, piece) &&
      isMoveLegal(draggedPiece, square, draggedFrom, context.board2DArray, context.fen)
    ) {
      setHighlightedSquare(square);
    }
  };

  const handleDrop = (square) => {
    const piece = getPieceAtSquare(square);
    if (
      draggedFrom !== square &&
      !sameType(draggedPiece, piece) &&
      isMoveLegal(draggedPiece, square, draggedFrom, context.board2DArray, context.fen) &&
      validateTurn(draggedPiece)
    ) {
      console.log(
        `${draggedPiece} ${draggedFrom}-${square} ${context.currentTurn}`
      );
      context.handlePieceMove(draggedFrom, square);
      context.setCurrentTurn(
        context.currentTurn === 'white' ? 'black' : 'white'
      );
    }
    setDraggedPiece('empty');
    setDraggedFrom(null);
    setHighlightedSquare(null);
    setDragStartSquare(null);
    setPossibleMoves([]);
  };

  const handleDragLeave = () => {
    setHighlightedSquare(null);
  };

  return (
    <div
      className="flex flex-wrap w-96 cursor-pointer select-none"
      onDragLeave={handleDragLeave}
    >
      {context.board2DArray.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
          const rank = 8 - rowIndex;
          const square = `${file}${rank}`;
          const isLightSquare = (colIndex + rowIndex) % 2 === 0;
          const isHighlighted = highlightedSquare === square;
          const isDragStartSquare = dragStartSquare === square;
          const isPossibleMove = possibleMoves.some((item) => item === square);
          const isWhiteInCheck = (piece === 'K' && context.isWhiteKingInCheck(context.board2DArray))
          const isBlackInCheck = (piece === 'k' && context.isBlackKingInCheck(context.board2DArray))

          return (
            <ChessSquare
              key={square}
              square={square}
              piece={piece}
              isLightSquare={isLightSquare}
              isHighlighted={isHighlighted}
              isPossibleMove={isPossibleMove}
              isDragStartSquare={isDragStartSquare}
              isWhiteInCheck={isWhiteInCheck}
              isBlackInCheck={isBlackInCheck}
              onClick={handleSquareClick}
              onDragStart={handleDragStart}
              onDragOver={(e) => handleDragOver(e, square)}
              onDrop={handleDrop}
            />
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
