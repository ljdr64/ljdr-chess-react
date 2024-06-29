import { isMoveLegal } from '../../ChessMoves';

/**
 * Search for a piece in a specific column in a given direction.
 *
 * @param {string} fromPiece - The piece that is moving (e.g., 'R' for rook).
 * @param {string} file - The target column (in algebraic notation, e.g., 'e').
 * @param {number} rank - The target row (in numeric notation, e.g., 5).
 * @param {Array} board - A 2D array representing the current state of the chessboard.
 * @param {number} direction - The direction of the search (1 for up, -1 for down).
 * @param {function} isMoveLegal - Function to check if a move is legal.
 * @param {string} square - The target square to which the piece is moving (in algebraic notation, e.g., 'e5').
 * @param {string} fen - The current FEN notation representing the state of the game.
 * @returns {number|null} - The row (rank) where the piece that can move is found, or null if none is found.
 */
function findPieceInColumn(
  fromPiece,
  file,
  rank,
  board,
  direction,
  isMoveLegal,
  square,
  fen
) {
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  for (let r = rank + direction; r >= 1 && r <= 8; r += direction) {
    const targetSquare = file + r;
    if (
      board[8 - r][fileIndex] === fromPiece &&
      isMoveLegal(fromPiece, square, targetSquare, board, fen)
    ) {
      return r;
    }
    if (board[8 - r][fileIndex] !== 'empty') {
      break;
    }
  }
  return null;
}

/**
 * Search for a piece in a specific row in a given direction.
 *
 * @param {string} fromPiece - The piece that is moving (e.g., 'R' for rook).
 * @param {string} file - The starting column (in algebraic notation, e.g., 'e').
 * @param {number} rank - The target row (in numeric notation, e.g., 5).
 * @param {Array} board - A 2D array representing the current state of the chessboard.
 * @param {number} direction - The direction of the search (1 for right, -1 for left).
 * @param {function} isMoveLegal - Function to check if a move is legal.
 * @param {string} square - The target square to which the piece is moving (in algebraic notation, e.g., 'e5').
 * @param {string} fen - The current FEN notation representing the state of the game.
 * @returns {string|null} - The column (file) where the piece that can move is found, or null if none is found.
 */
function findPieceInRow(
  fromPiece,
  file,
  rank,
  board,
  direction,
  isMoveLegal,
  square,
  fen
) {
  const rankIndex = 8 - rank;
  for (
    let f = file.charCodeAt(0) + direction;
    f >= 'a'.charCodeAt(0) && f <= 'h'.charCodeAt(0);
    f += direction
  ) {
    const targetSquare = String.fromCharCode(f) + rank;
    if (
      board[rankIndex][f - 'a'.charCodeAt(0)] === fromPiece &&
      isMoveLegal(fromPiece, square, targetSquare, board, fen)
    ) {
      return String.fromCharCode(f);
    }
    if (board[rankIndex][f - 'a'.charCodeAt(0)] !== 'empty') {
      break;
    }
  }
  return null;
}

/**
 * Search for a piece in a diagonal in a given direction.
 *
 * @param {string} fromPiece - The piece that is moving (e.g., 'B' for bishop).
 * @param {string} file - The starting column (in algebraic notation, e.g., 'e').
 * @param {number} rank - The starting row (in numeric notation, e.g., 3).
 * @param {Array} board - A 2D array representing the current state of the chessboard.
 * @param {number} fileDirection - The direction in the column (1 for right, -1 for left).
 * @param {number} rankDirection - The direction in the row (1 for up, -1 for down).
 * @param {function} isMoveLegal - Function to check if a move is legal.
 * @param {string} square - The target square to which the piece is moving (in algebraic notation, e.g., 'e5').
 * @param {string} fen - The current FEN notation representing the state of the game.
 * @returns {string|null} - The column where the piece that can move is found, or null if none is found.
 */
function findPieceInDiagonal(
  fromPiece,
  file,
  rank,
  board,
  fileDirection,
  rankDirection,
  isMoveLegal,
  square,
  fen
) {
  for (
    let [r, f] = [rank + rankDirection, file.charCodeAt(0) + fileDirection];
    f >= 'a'.charCodeAt(0) && f <= 'h'.charCodeAt(0) && r >= 1 && r <= 8;
    [r, f] = [r + rankDirection, f + fileDirection]
  ) {
    const targetSquare = String.fromCharCode(f) + r;
    if (
      board[8 - r][f - 'a'.charCodeAt(0)] === fromPiece &&
      isMoveLegal(fromPiece, square, targetSquare, board, fen)
    ) {
      return String.fromCharCode(f);
    }
    if (board[8 - r][f - 'a'.charCodeAt(0)] !== 'empty') {
      break;
    }
  }
  return null;
}

/**
 * Check if there are conflicting rooks that can move to the same square.
 *
 * @param {string} fromPiece - The piece that is moving (should be 'R' for rook).
 * @param {string} square - The target square to which the rook is moving (in algebraic notation, e.g., 'e5').
 * @param {string} fromPosition - The initial position of the rook (in algebraic notation, e.g., 'a5').
 * @param {Array} board - A 2D array representing the current state of the chessboard with pieces and 'empty' squares.
 * @param {string} fen - The current FEN notation representing the state of the game.
 * @returns {string} - The notation indicating if there are conflicting rooks.
 */
export const checkBishopConflicts = (
  fromPiece,
  square,
  fromPosition,
  board,
  fen
) => {
  const file = square[0];
  const rank = parseInt(square[1], 10);

  let notation = '';

  const directions = [
    [1, 1], // rankUpFileUp
    [1, -1], // rankDownFileUp
    [-1, 1], // rankUpFileDown
    [-1, -1], // rankDownFileDown
  ];

  for (const [rankDir, fileDir] of directions) {
    if (
      !(
        Math.sign(fromPosition[0].charCodeAt(0) - file.charCodeAt(0)) ===
          fileDir && Math.sign(parseInt(fromPosition[1], 10) - rank) === rankDir
      )
    ) {
      const conflict = findPieceInDiagonal(
        fromPiece,
        file,
        rank,
        board,
        fileDir,
        rankDir,
        isMoveLegal,
        square,
        fen
      );
      if (conflict) {
        notation = fromPosition[0];
        break;
      }
    }
  }

  if (
    (parseInt(fromPosition[1], 10) < rank &&
      2 * rank - parseInt(fromPosition[1], 10) <= 8) ||
    (parseInt(fromPosition[1], 10) > rank &&
      2 * rank - parseInt(fromPosition[1], 10) >= 1)
  ) {
    const possibleBishopRank = 8 - (2 * rank - parseInt(fromPosition[1], 10));
    if (
      board[possibleBishopRank][
        fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0)
      ] === fromPiece
    ) {
      if (
        (fromPosition[0].charCodeAt(0) < file.charCodeAt(0) &&
          2 * file.charCodeAt(0) - fromPosition[0].charCodeAt(0) <=
            'h'.charCodeAt(0)) ||
        (fromPosition[0].charCodeAt(0) > file.charCodeAt(0) &&
          2 * file.charCodeAt(0) - fromPosition[0].charCodeAt(0) >=
            'a'.charCodeAt(0))
      ) {
        const possibleBishopFile =
          2 * file.charCodeAt(0) -
          fromPosition[0].charCodeAt(0) -
          'a'.charCodeAt(0);
        if (board[8 - fromPosition[1]][possibleBishopFile] === fromPiece) {
          notation = fromPosition;
          return notation;
        }
      }
      notation = fromPosition[1];
      return notation;
    }
  }

  return notation;
};

/**
 * Check if there are conflicting rooks that can move to the same square.
 *
 * @param {string} fromPiece - The piece that is moving (should be 'R' for rook).
 * @param {string} square - The target square to which the rook is moving (in algebraic notation, e.g., 'e5').
 * @param {string} fromPosition - The initial position of the rook (in algebraic notation, e.g., 'a5').
 * @param {Array} board - A 2D array representing the current state of the chessboard with pieces and 'empty' squares.
 * @param {string} fen - The current FEN notation representing the state of the game.
 * @returns {string} - The notation indicating if there are conflicting rooks.
 */
export const checkRookConflicts = (
  fromPiece,
  square,
  fromPosition,
  board,
  fen
) => {
  const file = square[0];
  const rank = parseInt(square[1], 10);

  let notation = '';

  if (
    fromPosition[0].charCodeAt(0) !== file.charCodeAt(0) ||
    fromPosition[1] < rank.toString()
  ) {
    const rankUp = findPieceInColumn(
      fromPiece,
      file,
      rank,
      board,
      1,
      isMoveLegal,
      square,
      fen
    );
    if (rankUp) {
      if (fromPosition[0].charCodeAt(0) !== file.charCodeAt(0)) {
        notation = fromPosition[0];
        return notation;
      }
      if (fromPosition[1] < rank.toString()) {
        notation = fromPosition[1];
        return notation;
      }
    }
  }
  if (
    fromPosition[0].charCodeAt(0) !== file.charCodeAt(0) ||
    fromPosition[1] > rank.toString()
  ) {
    const rankDown = findPieceInColumn(
      fromPiece,
      file,
      rank,
      board,
      -1,
      isMoveLegal,
      square,
      fen
    );
    if (rankDown) {
      if (fromPosition[0].charCodeAt(0) !== file.charCodeAt(0)) {
        notation = fromPosition[0];
        return notation;
      }
      if (fromPosition[1] > rank.toString()) {
        notation = fromPosition[1];
        return notation;
      }
    }
  }
  if (
    fromPosition[0].charCodeAt(0) < file.charCodeAt(0) ||
    fromPosition[1] !== rank.toString()
  ) {
    const fileRight = findPieceInRow(
      fromPiece,
      file,
      rank,
      board,
      1,
      isMoveLegal,
      square,
      fen
    );
    if (fileRight) {
      notation = fromPosition[0];
      return notation;
    }
  }
  if (
    fromPosition[0].charCodeAt(0) > file.charCodeAt(0) ||
    fromPosition[1] !== rank.toString()
  ) {
    const fileLeft = findPieceInRow(
      fromPiece,
      file,
      rank,
      board,
      -1,
      isMoveLegal,
      square,
      fen
    );
    if (fileLeft) {
      notation = fromPosition[0];
      return notation;
    }
  }

  return notation;
};

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
      }
      if (fromPiece === 'r') {
        newNotation = ` ${fromPiece.toUpperCase()}${checkRookConflicts(
          fromPiece,
          square,
          fromPosition,
          board,
          fen
        )}${square}\n`;
      }
      if (fromPiece === 'b') {
        newNotation = ` ${fromPiece.toUpperCase()}${checkBishopConflicts(
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
    } else if (fromPiece === 'R') {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}${checkRookConflicts(
        fromPiece,
        square,
        fromPosition,
        board,
        fen
      )}${square}`;
    } else if (fromPiece === 'B') {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}${checkBishopConflicts(
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
      }
      if (fromPiece === 'r') {
        newNotation = ` ${fromPiece.toUpperCase()}${checkRookConflicts(
          fromPiece,
          square,
          fromPosition,
          board,
          fen
        )}x${square}\n`;
      }
      if (fromPiece === 'b') {
        newNotation = ` ${fromPiece.toUpperCase()}${checkBishopConflicts(
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
    } else if (fromPiece === 'R') {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}${checkRookConflicts(
        fromPiece,
        square,
        fromPosition,
        board,
        fen
      )}x${square}`;
    } else if (fromPiece === 'B') {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}${checkBishopConflicts(
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
