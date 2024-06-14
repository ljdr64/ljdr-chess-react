import Piece from '../Piece';

const ChessSquare = ({
  square,
  piece,
  isLightSquare,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      key={square}
      className={`w-12 h-12 flex items-center justify-center ${
        isLightSquare ? 'bg-amber-200' : 'bg-amber-700'
      }`}
      onClick={() => onClick(square, piece)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(square)}
      draggable={piece !== 'empty'}
      onDragStart={() => onDragStart(square, piece)}
    >
      {piece !== 'empty' && <Piece piece={piece} />}
    </div>
  );
};

export default ChessSquare;
