export function getQueenMoves(fromPiece, square, fromPosition, board) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (
    Math.abs(rank - fromRank) === Math.abs(file - fromFile) ||
    rank === fromRank ||
    file === fromFile
  ) {
    legalMoves = true;
  }
  return legalMoves;
}