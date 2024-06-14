import { useContext } from 'react';
import { ChessBoardContext } from '../../Context';
import Piece from '../Piece';

const ChessBoard = () => {
  const context = useContext(ChessBoardContext);

  return (
    <div className="flex flex-wrap w-96">
      {context.board2DArray.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
          const rank = 8 - rowIndex;
          const square = `${file}${rank}`;
          const isLightSquare = (colIndex + rowIndex) % 2 === 0;

          return (
            <div
              key={square}
              className={`w-12 h-12 flex items-center justify-center ${
                isLightSquare ? 'bg-amber-200' : 'bg-amber-700'
              }`}
              onClick={() => context.handlePieceMove(square)}
            >
              {piece !== 'empty' ? (
                <Piece
                  piece={piece}
                  onClick={() => context.handlePieceMove(square)}
                />
              ) : (
                ''
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
