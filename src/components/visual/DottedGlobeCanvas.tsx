import React, { useEffect, useRef } from 'react';

interface CreatorPin {
  id: string;
  name: string;
  avatar: string;
  lat: number; // -90 to 90
  lon: number; // -180 to 180
}

const CREATORS: CreatorPin[] = [
  {
    id: '1',
    name: '@maya.cuts',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    lat: 35,
    lon: -40,
  },
  {
    id: '2',
    name: '@leo.edits',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    lat: 48,
    lon: 15,
  },
];

export const DottedGlobeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pinCoords, setPinCoords] = React.useState<{ id: string; x: number; y: number; visible: boolean }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Generate sphere points on a grid
    const points: { phi: number; theta: number }[] = [];
    const numPoints = 1400;

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const theta = (i * 2.3999632) % (2 * Math.PI); // Golden angle
      const phi = Math.acos(y);
      points.push({ phi, theta });
    }

    const render = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.95; // Position globe to peek upward from bottom
      const globeRadius = Math.min(width, height) * 0.72;

      // Draw dots
      const activeCoords: { id: string; x: number; y: number; visible: boolean }[] = [];

      points.forEach(({ phi, theta }) => {
        const rotatedTheta = theta + rotation;

        const x = Math.sin(phi) * Math.cos(rotatedTheta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(rotatedTheta);

        if (z > -0.2) {
          const screenX = centerX + x * globeRadius;
          const screenY = centerY - y * globeRadius * 0.7; // slight perspective flattening
          const size = Math.max(0.7, (z + 1) * 1.3);
          const alpha = Math.max(0.1, (z + 0.3) * 0.7);

          ctx.fillStyle = isDark
            ? `rgba(220, 220, 230, ${alpha * 0.75})`
            : `rgba(40, 40, 50, ${alpha * 0.6})`;

          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Calculate positions for creator pins
      CREATORS.forEach((creator) => {
        const latRad = (creator.lat * Math.PI) / 180;
        const lonRad = (creator.lon * Math.PI) / 180 + rotation;

        const x = Math.cos(latRad) * Math.cos(lonRad);
        const y = Math.sin(latRad);
        const z = Math.cos(latRad) * Math.sin(lonRad);

        const screenX = centerX + x * globeRadius;
        const screenY = centerY - y * globeRadius * 0.7;

        activeCoords.push({
          id: creator.id,
          x: screenX,
          y: screenY,
          visible: z > 0.1,
        });
      });

      setPinCoords(activeCoords);

      rotation += 0.003;
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
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
    <div ref={containerRef} className="relative w-full h-[400px] md:h-[480px] overflow-hidden flex flex-col items-center justify-end select-none">
      {/* Horizon atmospheric amber glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] w-[85%] max-w-[700px] h-[300px] rounded-[100%] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 110, 20, 0.35) 0%, rgba(255, 140, 40, 0.12) 45%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      <div 
        className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[70%] max-w-[550px] h-[2px] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,140,40,0.8) 50%, transparent 100%)',
          boxShadow: '0 0 25px 3px rgba(255,100,20,0.8)',
        }}
      />

      <canvas ref={canvasRef} className="w-full h-full object-cover" />

      {/* Floating creator avatar tags */}
      {pinCoords.map((coord) => {
        const creator = CREATORS.find((c) => c.id === coord.id);
        if (!creator || !coord.visible) return null;

        return (
          <div
            key={coord.id}
            className="absolute transition-transform duration-75 ease-out pointer-events-none"
            style={{
              left: `${coord.x}px`,
              top: `${coord.y}px`,
              transform: 'translate(-50%, -100%) translateY(-10px)',
            }}
          >
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 shadow-md backdrop-blur-sm text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-4 h-4 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
              />
              <span>{creator.name}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mx-auto mt-1 ring-2 ring-white dark:ring-neutral-900" />
          </div>
        );
      })}
    </div>
  );
};
