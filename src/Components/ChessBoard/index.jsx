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

  const sameType = (string1, string2) => {
    return (
      string1 !== 'empty' &&
      string2 !== 'empty' &&
      (/[a-z]/.test(string1) === /[a-z]/.test(string2) ||
        /[A-Z]/.test(string1) === /[A-Z]/.test(string2))
    );
  };

  const getPieceAtSquare = (square) => {
    const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - square[1];
    const piece = context.board2DArray[rank][file];
    return piece;
  };

  const handleSquareClick = (square, piece) => {
    if (piece !== 'empty') {
      setHighlightedSquare(square);
    }
    if (fromPiece !== 'empty' || piece !== 'empty') {
      if (fromPosition === null) {
        console.log(`${piece} ${fromPosition}-${square}`, fromPiece);
        setFromPosition(square);
      } else {
        if (fromPiece !== 'empty' && fromPosition !== square) {
          if (
            !sameType(fromPiece, piece) &&
            isMoveLegal(fromPiece, square, fromPosition, context.board2DArray)
          ) {
            console.log(`${fromPiece} ${fromPosition}-${square}`);
            context.handlePieceMove(fromPosition, square);
          }
        }
        setFromPiece('empty');
        setFromPosition(null);
        setHighlightedSquare(null);
      }
      setFromPiece(piece);
    }
  };

  const handleDragStart = (square, piece) => {
    if (piece !== 'empty') {
      setDraggedPiece(piece);
      setDraggedFrom(square);
      setHighlightedSquare(square);
    }
  };

  const handleDragOver = (event, square) => {
    const piece = getPieceAtSquare(square);
    event.preventDefault();
    if (highlightedSquare !== square && !sameType(draggedPiece, piece)) {
      setHighlightedSquare(square);
    }
  };

  const handleDrop = (square) => {
    const piece = getPieceAtSquare(square);
    if (draggedFrom !== square && !sameType(draggedPiece, piece)) {
      console.log(`${draggedPiece} ${draggedFrom}-${square}`);
      context.handlePieceMove(draggedFrom, square);
    }
    setDraggedPiece('empty');
    setDraggedFrom(null);
    setHighlightedSquare(null);
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

          return (
            <ChessSquare
              key={square}
              square={square}
              piece={piece}
              isLightSquare={isLightSquare}
              isHighlighted={isHighlighted}
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
