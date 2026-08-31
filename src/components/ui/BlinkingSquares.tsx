import React, { useEffect, useRef } from 'react';

export interface BlinkingSquaresProps {
  direction?: 'right' | 'left' | 'top' | 'bottom' | 'radial' | 'none';
  gridSize?: number;
  squareSize?: number;
  fadeStart?: number;
  fadeEnd?: number;
  falloff?: number;
  minBrightness?: number;
  twinkleSpeed?: number;
  twinkleStrength?: number;
  intensity?: number;
  opacity?: number;
  squareColor?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const BlinkingSquares: React.FC<BlinkingSquaresProps> = ({
  direction = 'right',
  gridSize = 52,
  squareSize = 0.57,
  fadeStart = 0.33,
  fadeEnd = 1.0,
  falloff = 1.25,
  minBrightness = 0.55,
  twinkleSpeed = 1.4,
  twinkleStrength = 0.94,
  intensity = 1.0,
  opacity = 1.0,
  squareColor = '#8eacb8',
  background = 'transparent',
  className = '',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    // Helper to parse hex/color to rgb
    const parseColor = (colorStr: string): [number, number, number] => {
      if (colorStr.startsWith('#')) {
        let hex = colorStr.slice(1);
        if (hex.length === 3) {
          hex = hex.split('').map((c) => c + c).join('');
        }
        const num = parseInt(hex, 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
      }
      return [142, 172, 184]; // default #8eacb8
    };

    const rgb = parseColor(squareColor);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', resize);

    const render = (now: number) => {
      const time = (now - startTime) * 0.001;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      if (background && background !== 'transparent') {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }

      const cols = Math.ceil(width / gridSize) + 1;
      const rows = Math.ceil(height / gridSize) + 1;
      const actualSquareDim = gridSize * squareSize;
      const offset = (gridSize - actualSquareDim) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * gridSize;
          const y = r * gridSize;

          // Compute normalized position along direction
          let t = 1;
          if (direction === 'right') {
            t = width > 0 ? x / width : 0;
          } else if (direction === 'left') {
            t = width > 0 ? 1 - x / width : 0;
          } else if (direction === 'bottom') {
            t = height > 0 ? y / height : 0;
          } else if (direction === 'top') {
            t = height > 0 ? 1 - y / height : 0;
          } else if (direction === 'radial') {
            const dx = (x - width / 2) / (width / 2);
            const dy = (y - height / 2) / (height / 2);
            t = Math.min(1, Math.sqrt(dx * dx + dy * dy));
          }

          // Calculate fade probability and intensity
          let fadeFactor = 0;
          if (t >= fadeEnd) {
            fadeFactor = 1;
          } else if (t <= fadeStart) {
            fadeFactor = 0;
          } else {
            const range = fadeEnd - fadeStart;
            fadeFactor = range > 0 ? Math.pow((t - fadeStart) / range, falloff) : 1;
          }

          // Deterministic hash for this square
          const seed = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
          const randomVal = seed - Math.floor(seed);

          // Dither drop probability based on fadeFactor
          if (randomVal > fadeFactor && direction !== 'none') {
            continue;
          }

          // Twinkle oscillation
          const speedOffset = (randomVal * 10) * 0.2;
          const phase = randomVal * Math.PI * 2;
          const wave = Math.sin(time * twinkleSpeed * (1 + speedOffset) + phase);
          const normalizedWave = 0.5 + 0.5 * wave;

          const brightness =
            (minBrightness + (1 - minBrightness) * normalizedWave * twinkleStrength) * intensity;
          const alpha = Math.min(1, Math.max(0, brightness * opacity * fadeFactor));

          if (alpha > 0.01) {
            ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
            ctx.fillRect(x + offset, y + offset, actualSquareDim, actualSquareDim);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [
    direction,
    gridSize,
    squareSize,
    fadeStart,
    fadeEnd,
    falloff,
    minBrightness,
    twinkleSpeed,
    twinkleStrength,
    intensity,
    opacity,
    squareColor,
    background,
  ]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};
