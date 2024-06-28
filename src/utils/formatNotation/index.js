import { isMoveLegal } from '../../ChessMoves';

/**
 * Check if there are conflicting knights that can move to the same square.
 *
 * @param {string} fromPiece - The piece that is moving (should be 'N' for knight).
 * @param {string} square - The target square to which the knight is moving (in algebraic notation, e.g., 'e5').
 * @param {string} fromPosition - The initial position of the knight (in algebraic notation, e.g., 'g1').
 * @param {Array} board - A 2D array representing the current state of the chessboard with pieces and 'empty' squares.
 * @param {string} fen - The current FEN notation representing the state of the game.
 * @returns {string} - The notation indicating if there are conflicting knights.
 */
export const checkKnightConflicts = (
  fromPiece,
  square,
  fromPosition,
  board,
  fen
) => {
  const file = square[0];
  const rank = parseInt(square[1], 10);

  const knightMoves = [
    { file: 2, rank: 1 },
    { file: 2, rank: -1 },
    { file: -2, rank: 1 },
    { file: -2, rank: -1 },
    { file: 1, rank: 2 },
    { file: 1, rank: -2 },
    { file: -1, rank: 2 },
    { file: -1, rank: -2 },
  ];
  const knightsOnBoard = [];

  let notation = '';

  for (const move of knightMoves) {
    const targetFile = String.fromCharCode(file.charCodeAt(0) + move.file);
    const targetRank = rank + move.rank;
    if (
      targetFile + targetRank !== fromPosition &&
      targetRank >= 1 &&
      targetRank <= 8 &&
      targetFile >= 'a' &&
      targetFile <= 'h'
    ) {
      const targetPiece =
        board[8 - targetRank][targetFile.charCodeAt(0) - 'a'.charCodeAt(0)];
      if (
        targetPiece === fromPiece &&
        isMoveLegal(fromPiece, square, targetFile + targetRank, board, fen)
      ) {
        knightsOnBoard.push(targetFile + targetRank);
      }
    }
  }

  if (knightsOnBoard.some((item) => item[0] === fromPosition[0])) {
    notation = notation + fromPosition[1];
  }
  if (
    knightsOnBoard.some((item) => item[1] === fromPosition[1]) &&
    notation !== ''
  ) {
    notation = fromPosition[0] + notation;
    return [knightsOnBoard, notation];
  }
  if (knightsOnBoard.length > 0 && notation === '') {
    notation = fromPosition[0] + notation;
  }

  return notation;
};

/**
 * Formats the notation of a chess move.
 *
 * @param {string} fromPiece - The piece that is moving (e.g., 'N' for knight, 'P' for pawn).
 * @param {string} fromPosition - The initial position of the piece (in algebraic notation, e.g., 'g1').
 * @param {string} piece - The piece present on the target square (or 'empty' if the square is empty).
 * @param {string} square - The target square to which the piece is moving (in algebraic notation, e.g., 'e5').
 * @param {number} fullmoveNumber - The fullmove number (used in notation, e.g., '1. e4 e5' where '1' is the fullmove number).
 * @param {Array} board - A 2D array representing the current state of the chessboard with pieces and 'empty' squares.
 * @param {string} fen - The current FEN notation representing the state of the game.
 * @returns {string} - The formatted string of chess move notation.
 */
export const formatNotation = (
  fromPiece,
  fromPosition,
  piece,
  square,
  fullmoveNumber,
  board,
  fen
) => {
  let newNotation = '';

  if (fromPiece === 'n') {
    console.log(
      ` ${fromPiece.toUpperCase()}${checkKnightConflicts(
        fromPiece,
        square,
        fromPosition,
        board,
        fen
      )}${square}`
    );
  }

  if (piece === 'empty') {
    if (fromPiece === fromPiece.toLowerCase() && !(fromPiece === 'p')) {
      if (fromPiece === 'n') {
        newNotation = ` ${fromPiece.toUpperCase()}${checkKnightConflicts(
          fromPiece,
          square,
          fromPosition,
          board,
          fen
        )}${square}\n`;
      } else {
        newNotation = ` ${fromPiece.toUpperCase()}${square}\n`;
      }
    } else if (fromPiece === 'P' && fromPosition[0] === square[0]) {
      newNotation = ` ${fullmoveNumber}. ${square}`;
    } else if (fromPiece === 'P' && fromPosition[0] !== square[0]) {
      newNotation = ` ${fullmoveNumber}. ${fromPosition[0]}x${square}`;
    } else if (fromPiece === 'p' && fromPosition[0] === square[0]) {
      newNotation = ` ${square}\n`;
    } else if (fromPiece === 'p' && fromPosition[0] !== square[0]) {
      newNotation = ` ${fromPosition[0]}x${square}\n`;
    } else if (fromPiece === 'N') {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}${checkKnightConflicts(
        fromPiece,
        square,
        fromPosition,
        board,
        fen
      )}${square}`;
    } else {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}${square}`;
    }
  } else {
    if (fromPiece === fromPiece.toLowerCase() && !(fromPiece === 'p')) {
      if (fromPiece === 'n') {
        newNotation = ` ${fromPiece.toUpperCase()}${checkKnightConflicts(
          fromPiece,
          square,
          fromPosition,
          board,
          fen
        )}x${square}\n`;
      } else {
        newNotation = ` ${fromPiece.toUpperCase()}x${square}\n`;
      }
    } else if (fromPiece === 'P') {
      newNotation = ` ${fullmoveNumber}. ${fromPosition[0]}x${square}`;
    } else if (fromPiece === 'p') {
      newNotation = ` ${fromPosition[0]}x${square}\n`;
    } else if (fromPiece === 'N') {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}${checkKnightConflicts(
        fromPiece,
        square,
        fromPosition,
        board,
        fen
      )}x${square}`;
    } else {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}x${square}`;
    }
  }

  if (fromPiece === 'K' && fromPosition === 'e1') {
    if (square === 'g1') {
      newNotation = ` ${fullmoveNumber}. 0-0`;
    }
    if (square === 'c1') {
      newNotation = ` ${fullmoveNumber}. 0-0-0`;
    }
  }

  if (fromPiece === 'k' && fromPosition === 'e8') {
    if (square === 'g8') {
      newNotation = ' 0-0\n';
    }
    if (square === 'c8') {
      newNotation = ' 0-0-0\n';
    }
  }

  return newNotation;
};
