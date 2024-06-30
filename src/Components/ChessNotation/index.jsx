import { useContext, useEffect, useRef, useState } from 'react';
import { ChessBoardContext } from '../../Context';
import { isBlackKingInCheck, isWhiteKingInCheck } from '../../KingInCheck';
import { calculatePossibleMoves } from '../../utils/calculatePossibleMoves';

const ChessNotation = () => {
  const context = useContext(ChessBoardContext);
  const notationRef = useRef(null);
  const [possiblesMoves, setPossiblesMoves] = useState({
    white: [],
    black: [],
  });

  useEffect(() => {
    const updatedPossiblesMoves = { white: [], black: [] };

    context.board2DArray.forEach((row, rowIndex) => {
      row.forEach((targetPiece, colIndex) => {
        if (targetPiece !== 'empty') {
          const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
          const rank = 8 - rowIndex;
          const square = `${file}${rank}`;
          if (targetPiece === targetPiece.toUpperCase()) {
            updatedPossiblesMoves.white.push(
              ...calculatePossibleMoves(
                targetPiece,
                square,
                context.board2DArray,
                context.fen
              )
            );
          }
          if (targetPiece === targetPiece.toLowerCase()) {
            updatedPossiblesMoves.black.push(
              ...calculatePossibleMoves(
                targetPiece,
                square,
                context.board2DArray,
                context.fen
              )
            );
          }
        }
      });
    });

    setPossiblesMoves(updatedPossiblesMoves);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.board2DArray, context.fen]);

  useEffect(() => {
    const updateNotation = () => {
      const isBlackKingCheck = isBlackKingInCheck(context.board2DArray);
      const isWhiteKingCheck = isWhiteKingInCheck(context.board2DArray);

      const isBlackCheckmate =
        isBlackKingCheck && possiblesMoves.black.length === 0;
      const isWhiteCheckmate =
        isWhiteKingCheck && possiblesMoves.white.length === 0;

      let newNotation = context.notation;

      if (
        (isBlackKingCheck || isWhiteKingCheck) &&
        !context.notation.endsWith('+') &&
        !context.notation.endsWith('#')
      ) {
        newNotation += '+';
      }
      if (
        (isBlackCheckmate || isWhiteCheckmate) &&
        context.notation.endsWith('+') &&
        !context.notation.endsWith('#')
      ) {
        newNotation = newNotation.slice(0, -1) + '#';
      }

      context.setNotation(newNotation);
    };

    if (notationRef.current) {
      notationRef.current.scrollTop = notationRef.current.scrollHeight;
    }

    updateNotation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.board2DArray, context.notation, possiblesMoves]);

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
