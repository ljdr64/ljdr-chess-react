import { getRookMoves } from './rookMoves';
import { getBishopMoves } from './bishopMoves';
import { getKnightMoves } from './knightMoves';
import { getQueenMoves } from './queenMoves';
import { getKingMoves } from './kingMoves';
import { getPawnMoves } from './pawnMoves';

/**
 * Function to check if a move is legal for a piece at a given position.
 * @param {string} fromPiece - The piece type ('r', 'b', 'n', 'q', 'k', 'p' for rook, bishop, knight, queen, king, pawn respectively).
 * @param {array} square - The target square [row, column].
 * @param {array} fromPosition - The piece's current position [row, column].
 * @param {array} board - The board represented as a 2D array of characters.
 * @param {string} fen - The current FEN notation of the board.
 * @returns {boolean} - true if the move is legal, false otherwise.
 */
export function isMoveLegal(fromPiece, square, fromPosition, board, fen) {
  switch (fromPiece.toLowerCase()) {
    case 'r':
      return getRookMoves(fromPiece, square, fromPosition, board);
    case 'b':
      return getBishopMoves(fromPiece, square, fromPosition, board);
    case 'n':
      return getKnightMoves(fromPiece, square, fromPosition, board);
    case 'q':
      return getQueenMoves(fromPiece, square, fromPosition, board);
    case 'k':
      return getKingMoves(fromPiece, square, fromPosition, board, fen);
    case 'p':
      return getPawnMoves(fromPiece, square, fromPosition, board, fen);
    default:
      console.warn(`No move function found for piece '${fromPiece}'.`);
      return false;
  }
}
