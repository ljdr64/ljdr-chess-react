import { createContext, useState } from 'react';
import { FENToBoard2DArray, updateFENPosition } from '../utils';

export const ChessBoardContext = createContext();

export const ChessBoardProvider = ({ children }) => {
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
    <ChessBoardContext.Provider value={{ board2DArray, handlePieceMove }}>
      {children}
    </ChessBoardContext.Provider>
  );
};
