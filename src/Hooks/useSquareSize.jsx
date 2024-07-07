import { useEffect, useState } from 'react';

export const useSquareSize = () => {
  const [squareSize, setSquareSize] = useState(() => {
    const size = getComputedStyle(document.documentElement).getPropertyValue(
      '--dim-square'
    );
    return parseInt(size, 10);
  });

  useEffect(() => {
    const handleResize = () => {
      const size = getComputedStyle(document.documentElement).getPropertyValue(
        '--dim-square'
      );
      setSquareSize(parseInt(size, 10));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return squareSize;
};
