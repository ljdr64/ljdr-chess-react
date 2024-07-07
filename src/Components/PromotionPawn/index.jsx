import React, { useContext } from 'react';
import { ChessBoardContext } from '../../Context';
import Piece from '../Piece';
import '../ChessBoard/styles.css';

const PromotionPawn = ({ piece, square }) => {
  const context = useContext(ChessBoardContext);

  const handlePieceClick = (selectedPiece) => {
    context.handlePromote(selectedPiece, square);
    context.setNotation((prev) => prev + '=' + selectedPiece.toUpperCase());
    context.setPromotionModal(false);
  };

  return (
    <>
      {piece === 'P' ? (
        <div className="flex flex-col square-promote z-20 bg-white">
          <div className="bg-circle-promotion-pawn hover:bg-orange-400">
            <Piece piece={'Q'} onClick={() => handlePieceClick('Q')} />
          </div>
          <div className="bg-circle-promotion-pawn hover:bg-orange-400">
            <Piece piece={'N'} onClick={() => handlePieceClick('N')} />
          </div>
          <div className="bg-circle-promotion-pawn hover:bg-orange-400">
            <Piece piece={'R'} onClick={() => handlePieceClick('R')} />
          </div>
          <div className="bg-circle-promotion-pawn hover:bg-orange-400">
            <Piece piece={'B'} onClick={() => handlePieceClick('B')} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col square-promote z-20 bg-white">
          <div className="bg-circle-promotion-pawn hover:bg-orange-400">
            <Piece piece={'b'} onClick={() => handlePieceClick('b')} />
          </div>
          <div className="bg-circle-promotion-pawn hover:bg-orange-400">
            <Piece piece={'r'} onClick={() => handlePieceClick('r')} />
          </div>
          <div className="bg-circle-promotion-pawn hover:bg-orange-400">
            <Piece piece={'n'} onClick={() => handlePieceClick('n')} />
          </div>
          <div className="bg-circle-promotion-pawn hover:bg-orange-400">
            <Piece piece={'q'} onClick={() => handlePieceClick('q')} />
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionPawn;
