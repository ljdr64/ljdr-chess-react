import { useContext, useState } from 'react';
import { ChessBoardContext } from '../../Context';

const ChessNotation = () => {
  const context = useContext(ChessBoardContext);

  return (
    <div className="w-60 h-96 flex flex-col bg-white overflow-y-scroll">
      {context.notation.split('\n').map((line, index) => {
        const moves = line.split(' ');
        const moveNumber = index + 1;
        const whiteMove = moves.length > 1 ? moves[2] : '';
        const blackMove = moves.length > 2 ? moves[3] : '';
        console.log(moves);

        return (
          whiteMove && (
            <div
              key={index}
              className="flex justify-between border-t border-x border-gray-600 shadow-lg p-2 last:border-b"
            >
              <pre className="w-10">{moveNumber}</pre>
              <pre className="w-20">{whiteMove}</pre>
              <pre className="w-20">{blackMove}</pre>
            </div>
          )
        );
      })}
    </div>
  );
};

export default ChessNotation;
