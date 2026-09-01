import React, { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ParallaxCardsProps {
  images?: string[];
  cardCount?: number;
  perspective?: number;
  mouseSensitivity?: number;
  cardWidth?: number;
  cardHeight?: number;
  animationDuration?: number;
  enableDepthFog?: boolean;
  fogIntensity?: number;
  enableMagneticAttraction?: boolean;
  magneticStrength?: number;
  onCardClick?: (index: number, imageUrl: string) => void;
  className?: string;
  children?: React.ReactNode;
}

interface CardLayoutDef {
  x: number; // Percentage from left
  y: number; // Percentage from top
  z: number; // Depth along Z-axis in pixels (-400 to +200)
  w: number; // Percentage width of container
  h: number; // Percentage height of container
  rotate: number; // Base subtle tilt in degrees
}

const DEFAULT_LAYOUTS: CardLayoutDef[] = [
  // 0: Top Left Large Front Card
  { x: 6, y: 12, z: 120, w: 28, h: 32, rotate: -1 },
  // 1: Bottom Left Front Card
  { x: 5, y: 52, z: 90, w: 24, h: 36, rotate: 1 },
  // 2: Top Center Middle Card
  { x: 40, y: 13, z: 30, w: 20, h: 26, rotate: -0.5 },
  // 3: Middle Left Deep Card
  { x: 34, y: 44, z: -200, w: 10, h: 14, rotate: 0 },
  // 4: Center Low Deep Card
  { x: 30, y: 64, z: -100, w: 10, h: 14, rotate: 1 },
  // 5: Bottom Center Mid-Front Card
  { x: 43, y: 66, z: 70, w: 14, h: 24, rotate: -1 },
  // 6: Top Right Large Front Card
  { x: 66, y: 11, z: 130, w: 27, h: 32, rotate: 1 },
  // 7: Mid Right Deep Card
  { x: 64, y: 44, z: -220, w: 12, h: 15, rotate: 0 },
  // 8: Right Center Mid Card
  { x: 77, y: 48, z: -80, w: 15, h: 18, rotate: -1 },
  // 9: Bottom Right Small Deep Card
  { x: 65, y: 66, z: -160, w: 9, h: 12, rotate: 1 },
  // 10: Bottom Right Large Front Card
  { x: 71, y: 56, z: 100, w: 23, h: 32, rotate: 1 },
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&auto=format&fit=crop&q=80',
];

export const ParallaxCards: React.FC<ParallaxCardsProps> = ({
  images = DEFAULT_IMAGES,
  cardCount,
  perspective = 2500,
  mouseSensitivity = 3,
  cardWidth,
  cardHeight,
  animationDuration = 1.2,
  enableDepthFog = true,
  fogIntensity = 1,
  enableMagneticAttraction = false,
  magneticStrength = 50,
  onCardClick,
  className = '',
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = {
    damping: 25,
    stiffness: 140,
    mass: 0.6,
  };

  const smoothMouseX = useSpring(rawMouseX, springConfig);
  const smoothMouseY = useSpring(rawMouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [mouseSensitivity * 4, -mouseSensitivity * 4]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-mouseSensitivity * 4, mouseSensitivity * 4]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rawMouseX.set(x);
      rawMouseY.set(y);
    },
    [rawMouseX, rawMouseY]
  );

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0);
    rawMouseY.set(0);
    setHoveredIndex(null);
  }, [rawMouseX, rawMouseY]);

  const activeImages = useMemo(() => {
    const list = images.length > 0 ? images : DEFAULT_IMAGES;
    const count = cardCount ? Math.min(cardCount, 12, list.length) : Math.min(list.length, 11);
    return list.slice(0, count);
  }, [images, cardCount]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative w-full h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden select-none cursor-default flex items-center justify-center',
        className
      )}
      style={{ perspective: `${perspective}px` }}
    >
      <motion.div
        className="relative w-full h-full max-w-[1400px]"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ duration: animationDuration }}
      >
        {activeImages.map((imgUrl, index) => {
          const layout = DEFAULT_LAYOUTS[index % DEFAULT_LAYOUTS.length];
          return (
            <ParallaxCardItem
              key={index}
              index={index}
              imageUrl={imgUrl}
              layout={layout}
              mouseX={smoothMouseX}
              mouseY={smoothMouseY}
              mouseSensitivity={mouseSensitivity}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              enableDepthFog={enableDepthFog}
              fogIntensity={fogIntensity}
              enableMagneticAttraction={enableMagneticAttraction}
              magneticStrength={magneticStrength}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
              onClick={() => onCardClick?.(index, imgUrl)}
            />
          );
        })}

        {children && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            style={{ transform: 'translateZ(180px)', transformStyle: 'preserve-3d' }}
          >
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface ParallaxCardItemProps {
  index: number;
  imageUrl: string;
  layout: CardLayoutDef;
  mouseX: any;
  mouseY: any;
  mouseSensitivity: number;
  cardWidth?: number;
  cardHeight?: number;
  enableDepthFog: boolean;
  fogIntensity: number;
  enableMagneticAttraction: boolean;
  magneticStrength: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const ParallaxCardItem: React.FC<ParallaxCardItemProps> = ({
  index: _index,
  imageUrl,
  layout,
  mouseX,
  mouseY,
  mouseSensitivity,
  cardWidth,
  cardHeight,
  enableDepthFog,
  fogIntensity,
  enableMagneticAttraction,
  magneticStrength,
  isHovered,
  onHover,
  onLeave,
  onClick,
}) => {
  // Parallax offset multiplier based on depth Z: front cards move more than deep cards
  const depthFactor = 1 + (layout.z + 300) / 450;
  const moveX = useTransform(mouseX, [-0.5, 0.5], [-6 * mouseSensitivity * depthFactor, 6 * mouseSensitivity * depthFactor]);
  const moveY = useTransform(mouseY, [-0.5, 0.5], [-4 * mouseSensitivity * depthFactor, 4 * mouseSensitivity * depthFactor]);

  // Depth fog calculations: distant cards (z < 0) are blurred and faded
  const isDeep = layout.z < 0;
  const depthBlur = enableDepthFog && isDeep ? Math.min(6, (Math.abs(layout.z) / 100) * fogIntensity * 1.5) : 0;
  const depthOpacity = enableDepthFog && isDeep ? Math.max(0.4, 1 - (Math.abs(layout.z) / 400) * fogIntensity * 0.45) : 1;

  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="absolute cursor-pointer will-change-transform"
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: cardWidth ? `${cardWidth}px` : `${layout.w}%`,
        height: cardHeight ? `${cardHeight}px` : `${layout.h}%`,
        x: moveX,
        y: moveY,
        z: layout.z,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        scale: 1.05,
        z: layout.z + (enableMagneticAttraction ? magneticStrength : 40),
        transition: { duration: 0.35, ease: 'easeOut' },
      }}
    >
      <div
        className={cn(
          'w-full h-full rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500',
          'bg-neutral-900 border border-black/10 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.08)]',
          isHovered && 'shadow-[0_30px_70px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.15)] ring-1 ring-black/20'
        )}
        style={{
          opacity: depthOpacity,
          filter: depthBlur > 0 ? `blur(${depthBlur}px)` : 'none',
          transform: `rotate(${layout.rotate}deg)`,
        }}
      >
        <img
          src={imageUrl}
          alt={`3D Card Layer`}
          className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 hover:scale-105 transition-all duration-700 select-none pointer-events-none"
          loading="lazy"
        />
        {/* Subtle ambient light gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default ParallaxCards;
