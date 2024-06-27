import Piece from '../Piece';
import PromotionPawn from '../PromotionPawn';

const getSquareClass = (
  isLightSquare,
  isHighlighted,
  isDragStartSquare,
  isPossibleMove,
  isWhiteInCheck,
  isBlackInCheck,
  isPromotedWhitePawn,
  isPromotedBlackPawn
) => {
  if (isPromotedWhitePawn || isPromotedBlackPawn) {
    return 'bg-blue-500';
  } else if ((isWhiteInCheck || isBlackInCheck) && isLightSquare) {
    return 'bg-red-400';
  } else if ((isWhiteInCheck || isBlackInCheck) && !isLightSquare) {
    return 'bg-red-500';
  } else if (isHighlighted || isDragStartSquare) {
    return 'bg-green-300';
  } else if (isPossibleMove && isLightSquare) {
    return 'bg-green-600';
  } else if (isPossibleMove && !isLightSquare) {
    return 'bg-green-700';
  } else if (isLightSquare) {
    return 'bg-amber-200';
  } else {
    return 'bg-amber-700';
  }
};

const ChessSquare = ({
  square,
  piece,
  isLightSquare,
  isHighlighted,
  isPossibleMove,
  isDragStartSquare,
  isWhiteInCheck,
  isBlackInCheck,
  isPromotedWhitePawn,
  isPromotedBlackPawn,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const squareClass = getSquareClass(
    isLightSquare,
    isHighlighted,
    isDragStartSquare,
    isPossibleMove,
    isWhiteInCheck,
    isBlackInCheck,
    isPromotedWhitePawn,
    isPromotedBlackPawn
  );

  return (
    <div
      key={square}
      className={`w-12 h-12 flex items-center justify-center cursor-pointer ${squareClass}`}
      onClick={() => onClick(square, piece)}
      onDragStart={() => onDragStart(square, piece)}
      onDragOver={(e) => onDragOver(e, square)}
      onDrop={() => onDrop(square)}
      draggable={piece !== 'empty'}
    >
      {piece !== 'empty' && <Piece piece={piece} />}
      {isPromotedWhitePawn && piece === 'P' && (
        <div className="shadow-lg bg-white h-auto mt-[144px] z-20">
          <PromotionPawn piece={piece} square={square} />
        </div>
      )}
      {isPromotedBlackPawn && piece === 'p' && (
        <div className="shadow-lg bg-white h-auto mb-[144px] z-20">
          <PromotionPawn piece={piece} square={square} />
        </div>
      )}
    </div>
  );
};

export default ChessSquare;
