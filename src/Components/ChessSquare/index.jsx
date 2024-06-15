import Piece from '../Piece';

const ChessSquare = ({
  square,
  piece,
  isLightSquare,
  isHighlighted,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      key={square}
      className={`w-12 h-12 flex items-center justify-center cursor-pointer ${
        isHighlighted
          ? 'bg-green-300'
          : isLightSquare
          ? 'bg-amber-200'
          : 'bg-amber-700'
      }`}
      onClick={() => onClick(square, piece)}
      onDragOver={(e) => (piece !== null ? onDragOver(e) : null)}
      onDrop={() => onDrop(square)}
      onDragStart={() => onDragStart(square, piece)}
      draggable={piece !== 'empty'}
    >
      {piece !== 'empty' && <Piece piece={piece} />}
    </div>
  );
};

export default ChessSquare;
