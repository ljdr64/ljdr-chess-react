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

  const updateCastlingAvailability = (currentFEN, fromPosition) => {
    const fenParts = currentFEN.split(' ');
    let newCastlingAvailability = fenParts[2];

    if (fromPosition === 'a8') {
        newCastlingAvailability = newCastlingAvailability.replace('q', '');
    } else if (fromPosition === 'h8') {
        newCastlingAvailability = newCastlingAvailability.replace('k', '');
    } else if (fromPosition === 'a1') {
        newCastlingAvailability = newCastlingAvailability.replace('Q', '');
    } else if (fromPosition === 'h1') {
        newCastlingAvailability = newCastlingAvailability.replace('K', '');
    } else if (fromPosition === 'e1') {
        newCastlingAvailability = newCastlingAvailability.replace('K', '');
        newCastlingAvailability = newCastlingAvailability.replace('Q', '');
    } else if (fromPosition === 'e8') {
        newCastlingAvailability = newCastlingAvailability.replace('k', '');
        newCastlingAvailability = newCastlingAvailability.replace('q', '');
    }

    if (newCastlingAvailability === '') {
      newCastlingAvailability = '-'
    } 
        
    return newCastlingAvailability;
};

  const handlePieceMove = (fromPosition, toPosition) => {
    const [newBoard2DArray, piece] = updateBoard2DArrayPosition(
      board2DArray,
      fromPosition,
      toPosition
    );
    const newFEN = board2DArrayToFEN(
      newBoard2DArray,
      currentTurn,
      fullmoveNumber,
      updateCastlingAvailability(fen, fromPosition),
    );
    
    if (currentTurn === 'white') {
      setFullmoveNumber(fullmoveNumber + 1);
    }

    if (validateFEN(newFEN)) {
      setFEN(newFEN);
    } else {
      console.error('invalid FEN: ', newFEN);
    }
    console.log(newFEN);
  };

  return (
    <ChessBoardContext.Provider
      value={{
        fen,
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
