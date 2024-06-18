export function getKingMoves(fromPiece, square, fromPosition, board) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (Math.abs(rank - fromRank) <= 1 && Math.abs(file - fromFile) <= 1) {
    legalMoves = true;
  }

  // White: 0-0, 0-0-0
  if (fromPiece === 'K') {
    if (board[rank][file] === 'empty') {
      if (fromRank === 7 && rank === 7 && fromFile === 4) {
        if (
          (file === 6 &&
            board[rank][file - 1] === 'empty' &&
            board[rank][file + 1] === 'R') ||
          (file === 2 &&
            board[rank][file + 1] === 'empty' &&
            board[rank][file - 1] === 'empty' &&
            board[rank][file - 2] === 'R')
        ) {
          legalMoves = true;
        }
      }
    }
  }

  // Black: 0-0, 0-0-0
  if (fromPiece === 'k') {
    if (board[rank][file] === 'empty') {
      if (fromRank === 0 && rank === 0 && fromFile === 4) {
        if (
          (file === 6 &&
            board[rank][file - 1] === 'empty' &&
            board[rank][file + 1] === 'r') ||
          (file === 2 &&
            board[rank][file + 1] === 'empty' &&
            board[rank][file - 1] === 'empty' &&
            board[rank][file - 2] === 'r')
        ) {
          legalMoves = true;
        }
      }
    }
  }

  return legalMoves;
}
