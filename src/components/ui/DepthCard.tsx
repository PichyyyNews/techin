import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface DepthCardLayer {
  image: string;
  depth: number;
}

export interface DepthCardProps {
  image?: string;
  title: string;
  description?: string;
  width?: number | string;
  height?: number | string;
  maxRotation?: number;
  maxTranslation?: number;
  borderRadius?: string;
  className?: string;
  contentClassName?: string;
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  imageAlt?: string;
  disableOnMobile?: boolean;
  ariaLabel?: string;
  layers?: DepthCardLayer[];
  staggerDelay?: number;
  revealAnimation?: 'slide' | 'fade' | 'scale' | 'none';
  respectReducedMotion?: boolean;
  spotlight?: boolean;
  spotlightColor?: string;
  badge?: string;
  code?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const DepthCard: React.FC<DepthCardProps> = ({
  image,
  title,
  description,
  width = 320,
  height = 420,
  maxRotation = 18,
  maxTranslation = 20,
  borderRadius = '16px',
  className,
  contentClassName,
  onClick,
  href,
  target = '_self',
  imageAlt,
  disableOnMobile = false,
  ariaLabel,
  layers,
  respectReducedMotion = true,
  spotlight = true,
  spotlightColor = 'rgba(255, 255, 255, 0.35)',
  badge,
  code,
  icon,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | HTMLAnchorElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const targetTransform = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const currentTransform = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!disableOnMobile) return;
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          window.innerWidth < 768
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [disableOnMobile]);

  useEffect(() => {
    if (!respectReducedMotion) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };
    updateMotion(mediaQuery);
    mediaQuery.addEventListener('change', updateMotion);
    return () => mediaQuery.removeEventListener('change', updateMotion);
  }, [respectReducedMotion]);

  const isDisabled = (disableOnMobile && isMobile) || prefersReducedMotion;

  useEffect(() => {
    if (isDisabled) return;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      const target = targetTransform.current;
      const current = currentTransform.current;

      current.x = lerp(current.x, target.x, 0.1);
      current.y = lerp(current.y, target.y, 0.1);
      current.rotateX = lerp(current.rotateX, target.rotateX, 0.1);
      current.rotateY = lerp(current.rotateY, target.rotateY, 0.1);

      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${current.rotateX}deg) rotateY(${current.rotateY}deg)`;
      }

      if (layers && layers.length > 0) {
        layerRefs.current.forEach((layerEl, idx) => {
          if (layerEl) {
            const depth = layers[idx]?.depth ?? 1;
            layerEl.style.transform = `translateX(${current.x * depth}px) translateY(${current.y * depth}px) scale(1.15)`;
          }
        });
      } else if (layerRefs.current[0]) {
        layerRefs.current[0].style.transform = `translateX(${current.x}px) translateY(${current.y}px) scale(1.15)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isDisabled, layers]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || isDisabled) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      if (spotlight && spotlightRef.current) {
        const spotX = e.clientX - rect.left;
        const spotY = e.clientY - rect.top;
        spotlightRef.current.style.background = `radial-gradient(500px circle at ${spotX}px ${spotY}px, ${spotlightColor} 0%, rgba(255, 255, 255, 0.08) 40%, transparent 100%)`;
      }

      const normX = deltaX / (rect.width / 2);
      const normY = deltaY / (rect.height / 2);

      targetTransform.current = {
        x: -(normX * maxTranslation),
        y: -(normY * maxTranslation),
        rotateX: -(normY * maxRotation),
        rotateY: normX * maxRotation,
      };
    },
    [maxRotation, maxTranslation, isDisabled, spotlight, spotlightColor]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '1';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    targetTransform.current = { x: 0, y: 0, rotateX: 0, rotateY: 0 };
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0';
    }
  }, []);

  const handleClick = useCallback(() => {
    if (href) {
      if (target === '_blank') {
        window.open(href, target, 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    }
    onClick?.();
  }, [href, target, onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const Component = href ? 'a' : 'div';
  const linkProps = href ? { href, target, rel: target === '_blank' ? 'noopener noreferrer' : undefined } : {};

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <Component
      {...linkProps}
      ref={containerRef as React.Ref<never>}
      className={cn('relative cursor-pointer focus:outline-none block select-none group', className)}
      style={{
        width: widthStyle,
        height: heightStyle,
        perspective: '1200px',
        borderRadius,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick || href ? handleClick : undefined}
      onKeyDown={onClick || href ? handleKeyDown : undefined}
      role={onClick || href ? 'button' : undefined}
      tabIndex={onClick || href ? 0 : undefined}
      aria-label={ariaLabel || `${title} card`}
    >
      <div
        ref={cardRef}
        className={cn(
          'relative w-full h-full bg-[#121214] border border-neutral-800/80 transition-all duration-300 ease-out overflow-hidden',
          isHovered ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)]' : 'shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)]'
        )}
        style={{
          borderRadius,
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
          clipPath: `inset(0 round ${borderRadius})`,
        }}
      >
        {/* Layered Background Images */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius }}>
          {layers && layers.length > 0 ? (
            layers.map((l, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  layerRefs.current[idx] = el;
                }}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-transform duration-75"
                style={{
                  backgroundImage: `url(${l.image})`,
                  zIndex: idx,
                  opacity: idx === 0 ? 1 : 0.65,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              />
            ))
          ) : image ? (
            <div
              ref={(el) => {
                layerRefs.current[0] = el;
              }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-transform duration-75"
              style={{
                backgroundImage: `url(${image})`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              aria-label={imageAlt}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950" />
          )}
        </div>

        {/* Ambient Dark/Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 z-10 pointer-events-none" />

        {/* Spotlight Shimmer Effect */}
        {spotlight && (
          <div
            ref={spotlightRef}
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 ease-out opacity-0"
            style={{ mixBlendMode: 'screen' }}
          />
        )}

        {/* Card Header Info (Badge / Code / Icon) */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="w-7 h-7 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/15">
                {icon}
              </div>
            )}
            {badge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-white/10 backdrop-blur-md text-white/90 border border-white/15">
                {badge}
              </span>
            )}
          </div>
          {code && (
            <span className="text-[11px] font-mono text-neutral-400/90 font-medium">
              {code}
            </span>
          )}
        </div>

        {/* Content Details Bottom */}
        <div className={cn('absolute inset-0 z-30 flex flex-col justify-end p-6 pointer-events-none', contentClassName)}>
          <h3
            className={cn(
              'text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 transform transition-all duration-500',
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-95'
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                'text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal transform transition-all duration-500 delay-75',
                isHovered ? 'translate-y-0 opacity-100 text-neutral-200' : 'translate-y-2 opacity-80'
              )}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </Component>
  );
};

DepthCard.displayName = 'DepthCard';

export default DepthCard;
