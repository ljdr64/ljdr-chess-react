import { useContext } from 'react';
import { ChessBoardContext } from '../../Context';
import Layout from '../../Components/Layout';
import ChessBoard from '../../Components/ChessBoard';
import ChessNotation from '../../Components/ChessNotation';

function ChessGame() {
  const context = useContext(ChessBoardContext);

  const cleanedNotation = context.notation.replace(/\n/g, '').trim();

  return (
    <Layout>
      <h1 className="font-bold text-[40px] mb-10">ChessGame</h1>
      <div className="justify-center mb-10 min-w-[320px]">
        <div className="flex lg:flex-row flex-col w-[448px] lg:w-full">
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <ChessBoard />
          </div>
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <ChessNotation />
          </div>
        </div>
        <div className=" bg-gray-200 w-[448px] lg:w-full max-w-[752px] p-8 rounded-lg shadow-lg">
          <pre className="whitespace-pre-wrap border border-gray-600 shadow-lg text-sm bg-white p-2 overflow-scroll">
            {context.fen}
          </pre>
          <pre className="whitespace-pre-wrap border-b border-x border-gray-600 shadow-lg text-sm bg-white p-2">
            {cleanedNotation ? cleanedNotation : ' '}
          </pre>
        </div>
      </div>
    </Layout>
  );
}

export default ChessGame;
