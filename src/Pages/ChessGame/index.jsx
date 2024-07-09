import { useContext, useEffect, useRef } from 'react';
import { ChessBoardContext } from '../../Context';
import Layout from '../../Components/Layout';
import ChessBoard from '../../Components/ChessBoard';
import ChessNotation from '../../Components/ChessNotation';
import '../../Components/ChessBoard/styles.css';
import ChessClock from '../../Components/ChessClock';

function ChessGame() {
  const context = useContext(ChessBoardContext);
  const notationRef = useRef(null);
  const cleanedNotation = context.notation.replace(/\n/g, '').trim();

  useEffect(() => {
    if (notationRef.current) {
      notationRef.current.scrollTop = notationRef.current.scrollHeight;
    }
  }, [context.notation]);

  const initialTime = 1 * 60 * 1000;

  return (
    <Layout>
      <h1 className="font-bold text-[40px] mb-2">ChessGame</h1>
      <div className="justify-center mb-10">
        <div className="flex lg:flex-row flex-col w-[var(--dim-board-padding)] lg:w-full">
          <div className="bg-gray-200 px-[var(--dim-padding)] rounded-lg shadow-lg">
            <div className="flex justify-between items-center select-none">
              <div className="font-semibold">player02</div>
              <ChessClock initialTime={initialTime} turn={'black'} />
            </div>
            <ChessBoard />
            <div className="flex justify-between items-center select-none">
              <div className="font-semibold">player01</div>
              <ChessClock initialTime={initialTime} turn={'white'} />
            </div>
          </div>
          <div className="hidden lg:block bg-gray-200 notation-padding rounded-lg shadow-lg">
            <ChessNotation />
          </div>
        </div>
        <div className="lg:block bg-gray-200 lg:w-full max-w-[var(--dim-board-padding)] chessgame-padding rounded-lg shadow-lg">
          <pre className="h-[var(--dim-square)] text-wrap border border-gray-600 shadow-lg text-sm bg-white p-2 overflow-y-scroll">
            {context.fen}
          </pre>
          <pre
            ref={notationRef}
            className="text-wrap h-[var(--dim-square)] border-b border-x border-gray-600 shadow-lg text-sm bg-white p-2 overflow-y-scroll"
          >
            {cleanedNotation ? cleanedNotation : ' '}
          </pre>
        </div>
      </div>
    </Layout>
  );
}

export default ChessGame;
