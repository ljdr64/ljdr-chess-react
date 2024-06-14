import Piece from '../Piece';

const ChessSquare = ({ square, piece, isLightSquare, onClick }) => {
  return (
    <div
      key={square}
      className={`w-12 h-12 flex items-center justify-center ${
        isLightSquare ? 'bg-amber-200' : 'bg-amber-700'
      }`}
      onClick={() => onClick(square, piece)}
    >
      {piece !== 'empty' && <Piece piece={piece} />}
    </div>
  );
};

export default ChessSquare;
