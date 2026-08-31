import React from 'react';

interface PixelDitherGridProps {
  className?: string;
}

export const PixelDitherGrid: React.FC<PixelDitherGridProps> = ({ className }) => {
  // Pre-calculated geometric pixel pattern matrix (orange/terracotta/amber tones)
  const pixelMap = [
    { x: 1, y: 0, color: 'bg-orange-100 dark:bg-orange-950/40' },
    { x: 3, y: 0, color: 'bg-orange-300 dark:bg-orange-800/40' },
    { x: 5, y: 0, color: 'bg-orange-600 dark:bg-orange-500' },
    { x: 6, y: 0, color: 'bg-orange-700 dark:bg-orange-400' },
    { x: 7, y: 0, color: 'bg-orange-800/80 dark:bg-orange-600/70' },
    { x: 8, y: 0, color: 'bg-amber-900/60 dark:bg-amber-700/60' },

    { x: 3, y: 1, color: 'bg-orange-200 dark:bg-orange-900/40' },
    { x: 4, y: 1, color: 'bg-orange-400 dark:bg-orange-700/50' },
    { x: 5, y: 1, color: 'bg-orange-500 dark:bg-orange-500' },
    { x: 6, y: 1, color: 'bg-orange-600 dark:bg-orange-400' },
    { x: 7, y: 1, color: 'bg-orange-800 dark:bg-orange-600' },
    { x: 8, y: 1, color: 'bg-orange-900/80 dark:bg-orange-700' },

    { x: 1, y: 2, color: 'bg-orange-100 dark:bg-orange-950/30' },
    { x: 3, y: 2, color: 'bg-orange-300 dark:bg-orange-800/40' },
    { x: 5, y: 2, color: 'bg-orange-500 dark:bg-orange-500' },
    { x: 6, y: 2, color: 'bg-orange-600 dark:bg-orange-400' },
    { x: 7, y: 2, color: 'bg-orange-200 dark:bg-orange-900/50' },
    { x: 8, y: 2, color: 'bg-orange-700 dark:bg-orange-500' },

    { x: 4, y: 3, color: 'bg-orange-300 dark:bg-orange-800/40' },
    { x: 5, y: 3, color: 'bg-orange-400 dark:bg-orange-700/50' },
    { x: 6, y: 3, color: 'bg-orange-700 dark:bg-orange-400' },
    { x: 7, y: 3, color: 'bg-orange-800/70 dark:bg-orange-600/70' },
    { x: 8, y: 3, color: 'bg-orange-600 dark:bg-orange-500' },

    { x: 2, y: 4, color: 'bg-orange-100 dark:bg-orange-950/30' },
    { x: 5, y: 4, color: 'bg-orange-200 dark:bg-orange-900/30' },
    { x: 6, y: 4, color: 'bg-orange-500 dark:bg-orange-500' },
    { x: 7, y: 4, color: 'bg-orange-400 dark:bg-orange-600' },
    { x: 8, y: 4, color: 'bg-orange-300 dark:bg-orange-700' },

    { x: 3, y: 5, color: 'bg-orange-100 dark:bg-orange-950/20' },
    { x: 6, y: 5, color: 'bg-orange-300 dark:bg-orange-800/30' },
    { x: 7, y: 5, color: 'bg-orange-400 dark:bg-orange-600/40' },
    { x: 8, y: 5, color: 'bg-orange-200 dark:bg-orange-800/30' },

    { x: 7, y: 6, color: 'bg-orange-100 dark:bg-orange-950/20' },
    { x: 8, y: 6, color: 'bg-orange-100 dark:bg-orange-950/20' },
  ];

  return (
    <div className={`relative w-full h-full min-h-[320px] flex items-center justify-center ${className || ''}`}>
      <div className="grid grid-cols-9 gap-1.5 p-6 select-none">
        {Array.from({ length: 9 * 7 }).map((_, idx) => {
          const x = idx % 9;
          const y = Math.floor(idx / 9);
          const pixel = pixelMap.find((p) => p.x === x && p.y === y);

          return (
            <div
              key={idx}
              className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300 ${
                pixel ? pixel.color : 'bg-transparent'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
