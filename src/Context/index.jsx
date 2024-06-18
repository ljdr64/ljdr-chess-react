import { createContext, useState } from 'react';
import {
  FENToBoard2DArray,
  board2DArrayToFEN,
  updateBoard2DArrayPosition,
} from '../utils';
import { validateFEN } from '../utils/validateFen';

export const ChessBoardContext = createContext();

export const ChessBoardProvider = ({ children }) => {
  const initialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const [fen, setFEN] = useState(initialFEN);
  const [currentTurn, setCurrentTurn] = useState('white');

  const board2DArray = FENToBoard2DArray(fen);

  const handlePieceMove = (fromPosition, toPosition) => {
    // Implementa la lógica para mover las piezas y actualizar el estado del tablero en FEN
    const [newBoard2DArray, piece] = updateBoard2DArrayPosition(
      board2DArray,
      fromPosition,
      toPosition
    );

    if (validateFEN(board2DArrayToFEN(newBoard2DArray, currentTurn))) {
      setFEN(board2DArrayToFEN(newBoard2DArray, currentTurn));
    } else {
      setFEN(board2DArrayToFEN(board2DArray, currentTurn));
    }
  };

  return (
    <ChessBoardContext.Provider
      value={{
        board2DArray,
        handlePieceMove,
        setCurrentTurn,
        currentTurn,
      }}
    >
      {children}
    </ChessBoardContext.Provider>
  );
};
