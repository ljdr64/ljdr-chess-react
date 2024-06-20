import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Piece from '../Piece';

const PromotionPawn = ({ piece }) => {
  return (
    <>
      {piece === 'P' ? (
        <div className="flex flex-col w-12 z-20">
          <Piece piece={'Q'} />
          <Piece piece={'N'} />
          <Piece piece={'R'} />
          <Piece piece={'B'} />
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
          <Piece piece={'b'} />
          <Piece piece={'r'} />
          <Piece piece={'n'} />
          <Piece piece={'q'} />
        </div>
      )}
    </>
  );
};

export default PromotionPawn;