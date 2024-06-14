import { useContext, useState } from 'react';
import { ChessBoardContext } from '../../Context';
import ChessSquare from '../ChessSquare';

const ChessBoard = () => {
  const context = useContext(ChessBoardContext);
  const [fromPosition, setFromPosition] = useState(null);
  const [fromPiece, setFromPiece] = useState('empty');
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [draggedPiece, setDraggedPiece] = useState('empty');

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
  };

  const handleDragStart = (square, piece) => {
    setDraggedFrom(square);
    setDraggedPiece(piece);
  };

  const handleDrop = (square) => {
    if (draggedFrom !== null && draggedPiece !== 'empty') {
      context.handlePieceMove(draggedFrom, square);
      setDraggedFrom(null);
      setDraggedPiece('empty');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-wrap w-96">
      {context.board2DArray.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
          const rank = 8 - rowIndex;
          const square = `${file}${rank}`;
          const isLightSquare = (colIndex + rowIndex) % 2 === 0;

          return (
            <ChessSquare
              key={square}
              square={square}
              piece={piece}
              isLightSquare={isLightSquare}
              onClick={handleSquareClick}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
