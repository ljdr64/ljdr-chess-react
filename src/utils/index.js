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
export const board2DArrayToFEN = (board) => {
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
  return `${fenRows.join('/')} w KQkq - 0 1`;
};

// Actualizar una posición en FEN
export const updateFENPosition = (fen, file, rank, newPiece) => {
  const [position, turn, castling, enPassant, halfMove, fullMove] =
    fen.split(' ');
  const rows = position.split('/');

  const rowIndex = 8 - rank;
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);

  let targetRow = rows[rowIndex];
  let colCounter = 0;
  let newRow = '';

  for (let char of targetRow) {
    if (!isNaN(char)) {
      const emptyCells = parseInt(char);
      if (colCounter + emptyCells > fileIndex) {
        const before = fileIndex - colCounter;
        const after = emptyCells - before - 1;
        if (before > 0) newRow += before;
        newRow += newPiece;
        if (after > 0) newRow += after;
      } else {
        newRow += char;
      }
      colCounter += emptyCells;
    } else {
      if (colCounter === fileIndex) {
        newRow += newPiece;
      } else {
        newRow += char;
      }
      colCounter++;
    }
  }

  rows[rowIndex] = newRow;
  return `${rows.join(
    '/'
  )} ${turn} ${castling} ${enPassant} ${halfMove} ${fullMove}`;
};
