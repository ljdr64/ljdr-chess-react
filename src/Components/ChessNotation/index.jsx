import { useContext, useState } from 'react';
import { ChessBoardContext } from '../../Context';

const ChessNotation = () => {
  const context = useContext(ChessBoardContext);

  return (
    <div
      className="w-40 h-96 bg-white p-2 overflow-y-scroll"
    >
        <pre>{context.notation}</pre>
    </div>
  );
};

export default ChessNotation;
