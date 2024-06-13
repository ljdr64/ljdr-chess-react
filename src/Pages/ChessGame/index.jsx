import Layout from '../../Components/Layout';
import ChessBoard from '../../Components/ChessBoard';

function ChessGame() {
  return (
    <Layout>
      <div className="flex justify-center mt-40">
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Chess Game</h1>
          <ChessBoard />
        </div>
      </div>
    </Layout>
  );
}

export default ChessGame;
