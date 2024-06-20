import React, { useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ChessBoardContext } from '../../Context';
import Piece from '../Piece';

const PromotionPawn = ({ piece, square }) => {
  const context = useContext(ChessBoardContext);

  const handlePieceClick = (selectedPiece) => {
    context.handlePromote(selectedPiece, square);
    context.setNotation(context.notation + '=' + selectedPiece.toUpperCase())
  };

  return (
    <>
      {piece === 'P' ? (
          <div className="flex flex-col w-12 z-20">
          <Piece piece={'Q'} onClick={() => handlePieceClick('Q')} />
          <Piece piece={'N'} onClick={() => handlePieceClick('N')} />
          <Piece piece={'R'} onClick={() => handlePieceClick('R')} />
          <Piece piece={'B'} onClick={() => handlePieceClick('B')} />
          <div className='flex justify-center bg-gray-300'>
            <div className='m-1'>
              <FaTimes className='text-gray-600' />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-12 z-20">
          <div className='flex justify-center bg-gray-300'>
            <div className='m-1'>
              <FaTimes className='text-gray-600' />
            </div>
          </div>
          <Piece piece={'b'} onClick={() => handlePieceClick('b')} />
          <Piece piece={'r'} onClick={() => handlePieceClick('r')} />
          <Piece piece={'n'} onClick={() => handlePieceClick('n')} />
          <Piece piece={'q'} onClick={() => handlePieceClick('q')} />
        </div>
      )}
    </>
  );
};

export default PromotionPawn;