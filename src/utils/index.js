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
export const board2DArrayToFEN = (board, currentTurn, fullmoveNumber, castlingAvailability, enPassantSquare) => {
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

  return `${fenRows.join('/')} ${fenTurn} ${castlingAvailability} ${enPassantSquare} 0 ${fullmoveNumber}`;
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

  let newBoard2DArray = board2DArray.map(row => [...row]);
  
  if (
    piece === 'P' &&
     fromRank === '5' &&
     toRank === '6' &&
     Math.abs(fromFile.charCodeAt(0) - toFile.charCodeAt(0)) === 1 &&
     newBoard2DArray[2][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] === 'empty'
    ) {
      newBoard2DArray[3][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] = 'empty';
  }

  if (
    piece === 'p' &&
     fromRank === '4' &&
     toRank === '3' &&
     Math.abs(fromFile.charCodeAt(0) - toFile.charCodeAt(0)) === 1 &&
     newBoard2DArray[5][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] === 'empty'
    ) {
      newBoard2DArray[4][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] = 'empty';
  }

  newBoard2DArray[8 - toRank][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] = piece;
  newBoard2DArray[8 - fromRank][fromFile.charCodeAt(0) - 'a'.charCodeAt(0)] =
    'empty';

  if (piece === 'K' && fromFile === 'e' && fromRank === '1' && toRank === '1') {
    if (toFile === 'g') {
      newBoard2DArray[7][5] = 'R';
      newBoard2DArray[7][7] = 'empty';
    }
    if (toFile === 'c') {
      newBoard2DArray[7][3] = 'R';
      newBoard2DArray[7][0] = 'empty';
    }
  }

  if (piece === 'k' && fromFile === 'e' && fromRank === '8' && toRank === '8') {
    if (toFile === 'g') {
      newBoard2DArray[0][5] = 'r';
      newBoard2DArray[0][7] = 'empty';
    }
    if (toFile === 'c') {
      newBoard2DArray[0][3] = 'r';
      newBoard2DArray[0][0] = 'empty';
    }
  }

  return [newBoard2DArray, piece];
};

// Promocion de peon en representación bidimensional del tablero
export const promotionPieceInBoard2DArray = (
  board2DArray,
  fromPosition,
  piecePromote
) => {
  const [fromFile, fromRank] = fromPosition;  
  let newBoard2DArray = board2DArray.map(row => [...row]);
  newBoard2DArray[8 - fromRank][fromFile.charCodeAt(0) - 'a'.charCodeAt(0)] = piecePromote

  return newBoard2DArray;
};
