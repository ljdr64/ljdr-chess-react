import { useContext, useState } from 'react';
import { ChessBoardContext } from '../../Context';
import ChessSquare from '../ChessSquare';

const ChessBoard = () => {
  const context = useContext(ChessBoardContext);
  const [fromPosition, setFromPosition] = useState(null);
  const [fromPiece, setFromPiece] = useState('empty');
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [highlightedSquare, setHighlightedSquare] = useState(null);

  const sameType = (string1, string2) => {
    return (
      string1 !== 'empty' &&
      string2 !== 'empty' &&
      (/[a-z]/.test(string1) === /[a-z]/.test(string2) ||
        /[A-Z]/.test(string1) === /[A-Z]/.test(string2))
    );
  };

  const handleSquareClick = (square, piece) => {
    console.log(fromPosition, square, fromPiece, piece);
    if (fromPiece !== 'empty' || piece !== 'empty') {
      if (fromPosition === null) {
        setFromPosition(square);
      } else {
        if (fromPiece !== 'empty' && fromPosition !== square) {
          if (!sameType(fromPiece, piece)) {
            context.handlePieceMove(fromPosition, square);
          }
        }
        setFromPosition(null);
      }
      setFromPiece(piece);
    }
  };

  const handleDragStart = (square, piece) => {
    if (piece !== 'empty') {
      setDraggedFrom(square);
      setHighlightedSquare(square);
    }
  };

  const handleDragOver = (event, square) => {
    event.preventDefault();
    if (highlightedSquare !== square) {
      setHighlightedSquare(square);
    }
  };

  const handleDrop = (square) => {
    context.handlePieceMove(draggedFrom, square);
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
