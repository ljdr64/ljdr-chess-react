// Convertir FEN a representación bidimensional del tablero
export const FENToBoard2DArray = (fen) => {
  const [position] = fen.split(' ');
  const rows = position.split('/');
  const board = Array.from({ length: 8 }, () => Array(8).fill('empty'));

  rows.forEach((row, rowIndex) => {
    let fileIndex = 0;
    for (const char of row) {
      if (!isNaN(char)) {
        fileIndex += parseInt(char);
      } else {
        board[rowIndex][fileIndex] = char;
        fileIndex++;
      }
    }
  });

  return board;
};

// Convertir representación bidimensional del tablero a FEN
export const board2DArrayToFEN = (board, currentTurn) => {
  const fenRows = board.map((row) => {
    let emptyCount = 0;
    return (
      row
        .map((cell) => {
          if (cell === 'empty') {
            emptyCount++;
            return '';
          } else {
            const result = (emptyCount > 0 ? emptyCount : '') + cell;
            emptyCount = 0;
            return result;
          }
        })
        .join('') + (emptyCount > 0 ? emptyCount : '')
    );
  });

  const fenTurn = currentTurn === 'white' ? 'b' : 'w';

  return `${fenRows.join('/')} ${fenTurn} KQkq - 0 1`;
};

// Actualizar una posición en representación bidimensional del tablero
export const updateBoard2DArrayPosition = (
  board2DArray,
  fromPosition,
  toPosition
) => {
  const [fromFile, fromRank] = fromPosition;
  const [toFile, toRank] = toPosition;
  const piece =
    board2DArray[8 - fromRank][fromFile.charCodeAt(0) - 'a'.charCodeAt(0)];

  let newBoard2DArray = [...board2DArray];
  newBoard2DArray[8 - toRank][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] = piece;
  newBoard2DArray[8 - fromRank][fromFile.charCodeAt(0) - 'a'.charCodeAt(0)] =
    'empty';

  return [newBoard2DArray, piece];
};
