/**
 * Formats the notation of a chess move.
 *
 * @param {string} fromPiece - Piece moving from.
 * @param {string} fromPosition - Initial position of the piece (algebraic notation).
 * @param {string} piece - Piece moving to (or 'empty' if it's an empty move).
 * @param {string} square - Square to which the piece is moving (algebraic notation).
 * @param {number} fullmoveNumber - Fullmove number.
 * @returns {string} - Formatted string of chess move notation.
 */
export const formatNotation = (
  fromPiece,
  fromPosition,
  piece,
  square,
  fullmoveNumber
) => {
  let newNotation = '';

  if (piece === 'empty') {
    if (fromPiece === fromPiece.toLowerCase() && !(fromPiece === 'p')) {
      newNotation = ` ${fromPiece.toUpperCase()}${square}\n`;
    } else if (fromPiece === 'P' && fromPosition[0] === square[0]) {
      newNotation = ` ${fullmoveNumber}. ${square}`;
    } else if (fromPiece === 'P' && fromPosition[0] !== square[0]) {
      newNotation = ` ${fullmoveNumber}. ${fromPosition[0]}x${square}`;
    } else if (fromPiece === 'p' && fromPosition[0] === square[0]) {
      newNotation = ` ${square}\n`;
    } else if (fromPiece === 'p' && fromPosition[0] !== square[0]) {
      newNotation = ` ${fromPosition[0]}x${square}\n`;
    } else {
      newNotation = ` ${fullmoveNumber}. ${fromPiece}${square}`;
    }
  } else {
    if (fromPiece === fromPiece.toLowerCase() && !(fromPiece === 'p')) {
      newNotation = ` ${fromPiece.toUpperCase()}x${square}\n`;
    } else if (fromPiece === 'P') {
      newNotation = ` ${fullmoveNumber}. ${fromPosition[0]}x${square}`;
    } else if (fromPiece === 'p') {
      newNotation = ` ${fromPosition[0]}x${square}\n`;
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
