import { useContext, useState } from 'react';
import { ChessBoardContext } from '../../Context';
import ChessSquare from '../ChessSquare';

const ChessBoard = () => {
  const context = useContext(ChessBoardContext);
  const [fromPosition, setFromPosition] = useState(null);
  const [fromPiece, setFromPiece] = useState('empty');

  const handleSquareClick = (square, piece) => {
    console.log(fromPosition, square, fromPiece, piece);
    if (fromPosition === null) {
      setFromPosition(square);
    } else {
      if (fromPiece !== 'empty' && fromPosition !== square)
        context.handlePieceMove(fromPosition, square);
      setFromPosition(null);
    }
    setFromPiece(piece);
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
            />
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
