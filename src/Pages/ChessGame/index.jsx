import Layout from '../../Components/Layout';
import ChessBoard from '../../Components/ChessBoard';
import ChessNotation from '../../Components/ChessNotation';

function ChessGame() {
  return (
    <Layout>
      <div className="flex justify-center mt-40">
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
          <ChessBoard />
        </div>        
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
          <ChessNotation />
        </div>
      </div>
    </Layout>
  );
}

export default ChessGame;
