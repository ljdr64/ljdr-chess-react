import { useContext } from 'react';
import { ChessBoardContext } from '../../Context';
import Layout from '../../Components/Layout';
import ChessBoard from '../../Components/ChessBoard';
import ChessNotation from '../../Components/ChessNotation';

function ChessGame() {
  const context = useContext(ChessBoardContext);

  return (
    <Layout>      
      <h1 className="font-bold text-[40px] mb-10">ChessGame</h1>
      <div className="justify-center">
        <div className="flex">
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <ChessBoard />
          </div>          
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <ChessNotation />
          </div>
        </div>
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
          <div className="text-center text-sm bg-white p-2 overflow-x-auto">
            {context.fen}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ChessGame;
