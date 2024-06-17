export function getPawnMoves(fromPiece, square, fromPosition, board) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (file === fromFile && Math.abs(rank - fromRank) === 1) {
    legalMoves = true;
  }
  return legalMoves;
}
