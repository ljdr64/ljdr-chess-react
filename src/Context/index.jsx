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
  const [fullmoveNumber, setFullmoveNumber] = useState(1);

  const board2DArray = FENToBoard2DArray(fen);

  const handlePieceMove = (fromPosition, toPosition) => {
    const [newBoard2DArray, piece] = updateBoard2DArrayPosition(
      board2DArray,
      fromPosition,
      toPosition
    );
    const newFEN = board2DArrayToFEN(
      newBoard2DArray,
      currentTurn,
      fullmoveNumber
    );

    if (currentTurn === 'white') {
      setFullmoveNumber(fullmoveNumber + 1);
    }

    if (validateFEN(newFEN)) {
      setFEN(newFEN);
    } else {
      console.error('invalid FEN: ', newFEN);
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
