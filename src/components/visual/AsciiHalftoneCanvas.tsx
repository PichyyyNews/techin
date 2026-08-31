import React, { useEffect, useRef } from 'react';

interface AsciiHalftoneCanvasProps {
  className?: string;
}

export const AsciiHalftoneCanvas: React.FC<AsciiHalftoneCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const chars = [' ', '.', '-', '+', '*', '%', '#', '@'];

    const render = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const cols = 56;
      const rows = 42;
      const cellWidth = width / cols;
      const cellHeight = height / rows;

      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const centerX = cols / 2;
      const centerY = rows / 2;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const dx = (x - centerX) * 1.3;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Torus/Donut wave equation
          const angle = Math.atan2(dy, dx);
          const donutRadius = 13.5;
          const tubeRadius = 6.5;

          const distFromTube = Math.abs(distance - donutRadius);
          
          if (distFromTube < tubeRadius) {
            const intensity = Math.cos((distFromTube / tubeRadius) * (Math.PI / 2)) *
              (0.5 + 0.5 * Math.sin(angle * 3 + time * 1.2 + distance * 0.2));

            const charIndex = Math.min(
              chars.length - 1,
              Math.max(0, Math.floor(intensity * (chars.length - 1)))
            );
            const char = chars[charIndex];

            if (char !== ' ') {
              ctx.fillStyle = isDark
                ? `rgba(240, 240, 240, ${0.15 + intensity * 0.85})`
                : `rgba(20, 20, 20, ${0.15 + intensity * 0.85})`;

              ctx.fillText(char, x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2);
            }
          } else if (distance < 24 && Math.sin(distance * 0.8 + time) > 0.6) {
            // Subtle ambient dotted field
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
            ctx.fillText('.', x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2);
          }
        }
      }

      time += 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio || 500;
      canvas.height = rect.height * window.devicePixelRatio || 400;
      if (ctx) ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[380px] flex items-center justify-center overflow-hidden select-none ${className || ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[560px] max-h-[460px] object-contain"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
