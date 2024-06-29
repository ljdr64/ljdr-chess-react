import { useContext, useRef } from 'react';
import { ChessBoardContext } from '../../Context';
import { isBlackKingInCheck, isWhiteKingInCheck } from '../../KingInCheck';

const ChessNotation = () => {
  const context = useContext(ChessBoardContext);
  const notationRef = useRef(null);

  if (
    (isBlackKingInCheck(context.board2DArray) ||
      isWhiteKingInCheck(context.board2DArray)) &&
    !context.notation.endsWith('+')
  ) {
    context.setNotation(context.notation + '+');
  }

  if (notationRef.current) {
    notationRef.current.scrollTop = notationRef.current.scrollHeight;
  }

  return (
    <div
      ref={notationRef}
      className="w-full h-[83px] lg:w-60 lg:h-96 flex flex-col bg-white overflow-y-scroll"
    >
      {context.notation.split('.').map((line, index) => {
        const moves = line.split(' ');
        const moveNumber = index;
        const whiteMove = moves.length > 1 ? moves[1] : '';
        const blackMove = moves.length > 2 ? moves[2] : '';

        return (
          whiteMove &&
          moveNumber > 0 && (
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
