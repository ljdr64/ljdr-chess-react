import { createContext, useState } from 'react';
import {
  FENToBoard2DArray,
  board2DArrayToFEN,
  updateBoard2DArrayPosition,
  promotionPieceInBoard2DArray,
} from '../utils';
import { validateFEN } from '../utils/validateFen';

export const ChessBoardContext = createContext();

export const ChessBoardProvider = ({ children }) => {
  const initialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const [fen, setFEN] = useState(initialFEN);
  const [lastFEN, setLastFEN] = useState('');
  const [currentTurn, setCurrentTurn] = useState('white');
  const [fullmoveNumber, setFullmoveNumber] = useState(1);
  const [halfmoveNumber, setHalfmoveNumber] = useState(0);
  const [onPromote, setOnPromote] = useState(null);
  const [notation, setNotation] = useState('');
  const [promotionModal, setPromotionModal] = useState(false);
  const [promotionNotation, setPromotionNotation] = useState('');
  const [isClockZero, setIsClockZero] = useState(false);

  const board2DArray = FENToBoard2DArray(fen);

  const handlePromote = (piece, square) => {
    setOnPromote(piece);
    const newFEN = board2DArrayToFEN(
      promotionPieceInBoard2DArray(board2DArray, square, piece),
      currentTurn,
      fullmoveNumber,
      0,
      updateCastlingAvailability(fen, square),
      '-'
    );

    if (validateFEN(newFEN)) {
      setLastFEN(fen);
      setFEN(newFEN);
    } else {
      console.error('invalid FEN: ', newFEN);
    }
  };

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
      newCastlingAvailability = '-';
    }

    return newCastlingAvailability;
  };

  const getEnPassantSquare = (piece, fromPosition, toPosition) => {
    if (piece === 'P') {
      if (fromPosition[1] === '2' && toPosition[1] === '4') {
        const enPassantSquare = toPosition[0] + '3';
        return enPassantSquare;
      }
    }
    if (piece === 'p') {
      if (fromPosition[1] === '7' && toPosition[1] === '5') {
        const enPassantSquare = toPosition[0] + '6';
        return enPassantSquare;
      }
    }
    return '-';
  };

  const handlePieceMove = (fromPosition, toPosition) => {
    const [newBoard2DArray, piece] = updateBoard2DArrayPosition(
      board2DArray,
      fromPosition,
      toPosition
    );

    let updatedFullmoveNumber = fullmoveNumber;

    if (currentTurn === 'black') {
      updatedFullmoveNumber++;
    }

    setFullmoveNumber(updatedFullmoveNumber);

    const toFile = toPosition[0];
    const toRank = parseInt(toPosition[1], 10);

    const isPawnMove = piece.toLowerCase() === 'p';
    const isCapture =
      board2DArray[8 - toRank][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] !==
      'empty';

    let updatedHalfmoveNumber = halfmoveNumber;

    if (isPawnMove || isCapture) {
      updatedHalfmoveNumber = 0;
    } else {
      updatedHalfmoveNumber++;
    }

    setHalfmoveNumber(updatedHalfmoveNumber);

    const newFEN = board2DArrayToFEN(
      newBoard2DArray,
      currentTurn,
      updatedFullmoveNumber,
      updatedHalfmoveNumber,
      updateCastlingAvailability(fen, fromPosition),
      getEnPassantSquare(piece, fromPosition, toPosition)
    );

    if (validateFEN(newFEN)) {
      setLastFEN(fen);
      setFEN(newFEN);
    } else {
      console.error('invalid FEN: ', newFEN);
    }
  };

  return (
    <ChessBoardContext.Provider
      value={{
        setFEN,
        fen,
        board2DArray,
        handlePieceMove,
        setCurrentTurn,
        currentTurn,
        handlePromote,
        setOnPromote,
        onPromote,
        fullmoveNumber,
        setHalfmoveNumber,
        halfmoveNumber,
        setNotation,
        notation,
        setPromotionModal,
        promotionModal,
        setPromotionNotation,
        promotionNotation,
        setLastFEN,
        lastFEN,
        setIsClockZero,
        isClockZero,
      }}
    >
      {children}
    </ChessBoardContext.Provider>
  );
};
