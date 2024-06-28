import { useContext, useEffect, useRef } from 'react';
import { ChessBoardContext } from '../../Context';
import Layout from '../../Components/Layout';
import ChessBoard from '../../Components/ChessBoard';
import ChessNotation from '../../Components/ChessNotation';

function ChessGame() {
  const context = useContext(ChessBoardContext);
  const notationRef = useRef(null);
  const cleanedNotation = context.notation.replace(/\n/g, '').trim();

  useEffect(() => {
    if (notationRef.current) {
      notationRef.current.scrollTop = notationRef.current.scrollHeight;
    }
  }, [context.notation]);

  return (
    <Layout>
      <h1 className="font-bold text-[40px] mb-4 lg:mb-10">ChessGame</h1>
      <div className="justify-center mb-10">
        <div className="flex lg:flex-row flex-col w-[448px] lg:w-full">
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <ChessBoard />
          </div>
          <div className="hidden lg:block bg-gray-200 p-8 rounded-lg shadow-lg">
            <ChessNotation />
          </div>
        </div>
        <div className="lg:block bg-gray-200 w-[448px] lg:w-full max-w-[752px] p-8 rounded-lg shadow-lg">
          <pre className="text-wrap border border-gray-600 shadow-lg text-sm bg-white p-2 overflow-auto">
            {context.fen}
          </pre>
          <pre
            ref={notationRef}
            className="text-wrap h-[58px] border-b border-x border-gray-600 shadow-lg text-sm bg-white p-2 overflow-y-scroll"
          >
            {cleanedNotation ? cleanedNotation : ' '}
          </pre>
        </div>
      </div>
    </Layout>
  );
}

export default ChessGame;
