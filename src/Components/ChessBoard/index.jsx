import { useState } from 'react';
import { FENToBoard2DArray, updateFENPosition } from '../../utils';
import Piece from '../Piece';

const ChessBoard = () => {
  const initialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const [fen, setFEN] = useState(initialFEN);

  const board2DArray = FENToBoard2DArray(fen);

  const handlePieceMove = (fromPosition, toPosition) => {
    // Implementa la lógica para mover las piezas y actualizar el estado del tablero en FEN
    const [fromFile, fromRank] = fromPosition;
    const [toFile, toRank] = toPosition;
    const piece =
      board2DArray[8 - fromRank][fromFile.charCodeAt(0) - 'a'.charCodeAt(0)];

    // Actualiza la posición de origen a 'empty'
    let updatedFEN = updateFENPosition(fen, fromFile, fromRank, '1');

    // Actualiza la posición de destino con la pieza movida
    updatedFEN = updateFENPosition(updatedFEN, toFile, toRank, piece);

    setFEN(updatedFEN);
  };

  return (
    <div className="flex flex-wrap w-96">
      {board2DArray.map((row, rowIndex) =>
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
              onClick={() => handlePieceMove(square)}
            >
              {piece !== 'empty' ? (
                <Piece piece={piece} onClick={() => handlePieceMove(square)} />
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
