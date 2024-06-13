import { useState } from 'react';

const ChessBoard = () => {
  const initialBoardState = [
    ['a1', 'R'],
    ['b1', 'N'],
    ['c1', 'B'],
    ['d1', 'Q'],
    ['e1', 'K'],
    ['f1', 'B'],
    ['g1', 'N'],
    ['h1', 'R'], // Fila 1 (blancas)
    ['a2', 'P'],
    ['b2', 'P'],
    ['c2', 'P'],
    ['d2', 'P'],
    ['e2', 'P'],
    ['f2', 'P'],
    ['g2', 'P'],
    ['h2', 'P'], // Fila 2 (blancas)
    ['a3', 'empty'],
    ['b3', 'empty'],
    ['c3', 'empty'],
    ['d3', 'empty'],
    ['e3', 'empty'],
    ['f3', 'empty'],
    ['g3', 'empty'],
    ['h3', 'empty'], // Filas 3-6 (vacías)
    ['a4', 'empty'],
    ['b4', 'empty'],
    ['c4', 'empty'],
    ['d4', 'empty'],
    ['e4', 'empty'],
    ['f4', 'empty'],
    ['g4', 'empty'],
    ['h4', 'empty'],
    ['a5', 'empty'],
    ['b5', 'empty'],
    ['c5', 'empty'],
    ['d5', 'empty'],
    ['e5', 'empty'],
    ['f5', 'empty'],
    ['g5', 'empty'],
    ['h5', 'empty'],
    ['a6', 'empty'],
    ['b6', 'empty'],
    ['c6', 'empty'],
    ['d6', 'empty'],
    ['e6', 'empty'],
    ['f6', 'empty'],
    ['g6', 'empty'],
    ['h6', 'empty'],
    ['a7', 'p'],
    ['b7', 'p'],
    ['c7', 'p'],
    ['d7', 'p'],
    ['e7', 'p'],
    ['f7', 'p'],
    ['g7', 'p'],
    ['h7', 'p'], // Fila 7 (negras)
    ['a8', 'r'],
    ['b8', 'n'],
    ['c8', 'b'],
    ['d8', 'q'],
    ['e8', 'k'],
    ['f8', 'b'],
    ['g8', 'n'],
    ['h8', 'r'], // Fila 8 (negras)
  ];
  const [boardState, setBoardState] = useState(initialBoardState);

  const handlePieceMove = (fromPosition, toPosition) => {
    // Implementa la lógica para mover las piezas y actualizar boardState
  };

  return (
    <div className="flex flex-wrap w-96">
      {boardState.map(([square, piece]) => {
        const [col, row] = square.split('');
        const isLightSquare = (col.charCodeAt(0) + parseInt(row)) % 2 === 0;

        return (
          <div
            key={square}
            className={`w-12 h-12 flex items-center justify-center border border-amber-100 ${
              isLightSquare ? 'bg-amber-300' : 'bg-amber-800'
            }`}
            onClick={() => handlePieceMove({ square })}
          ></div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
