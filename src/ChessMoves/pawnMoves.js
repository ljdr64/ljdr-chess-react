export function getPawnMoves(fromPiece, square, fromPosition, board) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (fromPiece === 'P') {
    if (board[rank][file] === 'empty') {
      if (
        file === fromFile &&
        (fromRank - rank === 1 || (fromRank === 6 && fromRank - rank === 2))
      ) {
        legalMoves = true;
      }
    } else if (Math.abs(file - fromFile) === 1 && fromRank - rank === 1) {
      legalMoves = true;
    }
  }

  if (fromPiece === 'p') {
    if (board[rank][file] === 'empty') {
      if (
        file === fromFile &&
        (rank - fromRank === 1 || (fromRank === 1 && rank - fromRank === 2))
      ) {
        legalMoves = true;
      }
    } else if (Math.abs(file - fromFile) === 1 && rank - fromRank === 1) {
      legalMoves = true;
    }
  }

  return legalMoves;
}
