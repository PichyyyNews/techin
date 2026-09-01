import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ArrowUpRight } from 'lucide-react';

export interface ParallaxCardItem {
  id?: string | number;
  code?: string;
  category?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  stats?: Array<{ label: string; value: string }>;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  layers?: Array<{
    image: string;
    depth?: number;
  }>;
}

export interface ParallaxCardsProps {
  items?: ParallaxCardItem[];
  perspective?: number;
  mouseSensitivity?: number;
  animationDuration?: number;
  depthFog?: boolean;
  magneticAttraction?: boolean;
  spotlight?: boolean;
  className?: string;
}

export const ParallaxCards: React.FC<ParallaxCardsProps> = ({
  items = [],
  perspective = 1200,
  mouseSensitivity = 18,
  animationDuration = 0.5,
  depthFog = true,
  magneticAttraction = true,
  spotlight = true,
  className = ''
}) => {
  return (
    <div className={cn('w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center', className)}>
      {items.map((item, index) => (
        <ParallaxCardSingle
          key={item.id || index}
          item={item}
          perspective={perspective}
          mouseSensitivity={mouseSensitivity}
          animationDuration={animationDuration}
          depthFog={depthFog}
          magneticAttraction={magneticAttraction}
          spotlight={spotlight}
        />
      ))}
    </div>
  );
};

interface ParallaxCardSingleProps {
  item: ParallaxCardItem;
  perspective: number;
  mouseSensitivity: number;
  animationDuration: number;
  depthFog: boolean;
  magneticAttraction: boolean;
  spotlight: boolean;
}

const ParallaxCardSingle: React.FC<ParallaxCardSingleProps> = ({
  item,
  perspective,
  mouseSensitivity,
  animationDuration,
  depthFog,
  magneticAttraction,
  spotlight
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [mouseSensitivity, -mouseSensitivity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-mouseSensitivity, mouseSensitivity]), springConfig);
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX.set(x);
      mouseY.set(y);

      if (spotlight) {
        setSpotlightPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    },
    [mouseX, mouseY, spotlight]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[400px] h-[480px] rounded-xl cursor-pointer select-none group"
      style={{ perspective: `${perspective}px` }}
    >
      <motion.div
        className="relative w-full h-full rounded-xl bg-white border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between"
        style={{
          rotateX,
          rotateY,
          x: magneticAttraction ? translateX : 0,
          y: magneticAttraction ? translateY : 0,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.06)',
        }}
        transition={{ duration: animationDuration }}
      >
        {/* Top Visual Frame / Image Layer */}
        <div className="relative w-full h-[220px] bg-neutral-900 overflow-hidden shrink-0" style={{ transform: 'translateZ(10px)' }}>
          {item.image && (
            <motion.img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
            />
          )}

          {/* Depth Fog Overlay */}
          {depthFog && (
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20 pointer-events-none" />
          )}

          {/* Category Chip */}
          {item.category && (
            <div className="absolute top-3 left-3 z-10">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white bg-black/75 backdrop-blur-md px-2 py-1 rounded-xs border border-white/10">
                {item.category}
              </span>
            </div>
          )}

          {/* Code Index */}
          {item.code && (
            <div className="absolute top-3 right-3 z-10">
              <span className="font-mono text-xs font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-xs">
                {item.code}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white" style={{ transform: 'translateZ(20px)' }}>
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#09090B] leading-snug group-hover:text-black transition-colors">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="mt-1 font-mono text-xs text-neutral-500 line-clamp-1">
                {item.subtitle}
              </p>
            )}
            {item.description && (
              <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            )}
          </div>

          {/* Bottom Stats & Action */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3 mt-4">
            {item.stats && item.stats.length > 0 && (
              <div className="flex items-center divide-x divide-neutral-200">
                {item.stats.map((stat, i) => (
                  <div key={i} className={cn('flex flex-col', i === 0 ? 'pr-3' : 'px-3')}>
                    <span className="text-sm font-bold font-mono tracking-tight text-[#09090B] leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5 whitespace-nowrap">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {item.action && (
              <a
                href={item.action.href}
                onClick={item.action.onClick}
                className="inline-flex items-center justify-center gap-1.5 bg-[#09090B] hover:bg-neutral-800 text-white text-xs font-mono px-3 py-1.5 rounded-xs transition-colors shrink-0 ml-auto"
              >
                <span>{item.action.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Mouse Spotlight Shimmer Effect */}
        {spotlight && isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 80%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ParallaxCards;
