import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ScrollStackItem {
  id?: string | number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  body?: string;
  image?: string;
  accent?: string;
  tag?: string;
  stats?: Array<{ label: string; value: string }>;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
}

export interface ScrollStackProps {
  items?: ScrollStackItem[];
  children?: React.ReactNode;
  variant?: 'stack' | 'deck' | 'fade' | 'flip' | 'zoom' | 'reveal';
  scrollLength?: number;
  peek?: number;
  scaleStep?: number;
  blur?: number;
  dim?: number;
  smooth?: number;
  depth?: number;
  cardWidth?: number | string;
  cardHeight?: number | string;
  borderRadius?: number;
  perspective?: number;
  showProgress?: boolean;
  showCounter?: boolean;
  onIndexChange?: (index: number) => void;
  className?: string;
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  items,
  children,
  variant = 'stack',
  scrollLength = 1,
  peek = 24,
  scaleStep = 0.05,
  blur = 4,
  dim = 0.2,
  depth = 3,
  cardWidth = 920,
  cardHeight = 460,
  borderRadius = 16,
  perspective = 1400,
  showProgress = true,
  showCounter = true,
  onIndexChange,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childArray = children ? React.Children.toArray(children) : null;
  const count = childArray ? childArray.length : items?.length || 0;

  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (count <= 1) return;
    const progressPerCard = 1 / (count - 1);
    const idx = Math.min(Math.floor(latest / progressPerCard + 0.5), count - 1);
    if (idx !== activeIndex) {
      setActiveIndex(idx);
      onIndexChange?.(idx);
    }
  });

  if (count === 0) return null;

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      style={{
        height: `${Math.max(count * scrollLength * 90, 150)}vh`,
      }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Card Stage with 3D Perspective */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            perspective: `${perspective}px`,
            maxWidth: typeof cardWidth === 'number' ? `${cardWidth}px` : cardWidth,
            height: typeof cardHeight === 'number' ? `${cardHeight}px` : cardHeight,
          }}
        >
          {Array.from({ length: count }).map((_, index) => {
            return (
              <StackCardItem
                key={index}
                index={index}
                totalCount={count}
                scrollYProgress={scrollYProgress}
                variant={variant}
                peek={peek}
                scaleStep={scaleStep}
                blur={blur}
                dim={dim}
                depth={depth}
                borderRadius={borderRadius}
                item={items ? items[index] : undefined}
              >
                {childArray ? childArray[index] : null}
              </StackCardItem>
            );
          })}
        </div>

        {/* Bottom Status Rail (Counter & Progress Bar) */}
        {(showProgress || showCounter) && (
          <div className="mt-8 w-full max-w-sm flex items-center gap-4 text-xs font-mono text-neutral-500 select-none">
            {showCounter && (
              <div className="flex items-center gap-1 shrink-0 font-semibold text-neutral-900">
                <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="text-neutral-300">/</span>
                <span className="text-neutral-400">{String(count).padStart(2, '0')}</span>
              </div>
            )}

            {showProgress && (
              <div className="relative flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/50">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-[#09090B] rounded-full"
                  style={{
                    width: useTransform(scrollYProgress, [0, 1], ['15%', '100%']),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface StackCardItemProps {
  index: number;
  totalCount: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  variant: 'stack' | 'deck' | 'fade' | 'flip' | 'zoom' | 'reveal';
  peek: number;
  scaleStep: number;
  blur: number;
  dim: number;
  depth: number;
  borderRadius: number;
  item?: ScrollStackItem;
  children?: React.ReactNode;
}

const StackCardItem: React.FC<StackCardItemProps> = ({
  index,
  totalCount,
  scrollYProgress,
  variant,
  peek,
  scaleStep,
  blur,
  dim,
  depth,
  borderRadius,
  item,
  children,
}) => {
  const step = 1 / Math.max(totalCount - 1, 1);
  const cardStart = (index - 1) * step;
  const cardActive = index * step;

  const y = useTransform(scrollYProgress, (progress) => {
    if (index === 0 && progress <= cardActive) return 0;
    if (progress < cardActive) {
      const enterProgress = (progress - cardStart) / step;
      return (1 - Math.min(Math.max(enterProgress, 0), 1)) * 120;
    }
    const coveredSteps = Math.min((progress - cardActive) / step, totalCount - index);
    return -coveredSteps * peek;
  });

  const scale = useTransform(scrollYProgress, (progress) => {
    if (progress <= cardActive) {
      if (variant === 'zoom') {
        const enterProgress = Math.max(0, (progress - cardStart) / step);
        return 0.9 + enterProgress * 0.1;
      }
      return 1;
    }
    const coveredSteps = Math.min((progress - cardActive) / step, depth);
    return Math.max(1 - coveredSteps * scaleStep, 0.7);
  });

  const opacity = useTransform(scrollYProgress, (progress) => {
    if (index > 0 && progress < cardStart + step * 0.2) {
      if (variant === 'fade') {
        return Math.max(0, (progress - cardStart) / (step * 0.8));
      }
      return Math.max(0, (progress - cardStart) / (step * 0.5));
    }
    if (progress > cardActive) {
      const coveredSteps = (progress - cardActive) / step;
      if (coveredSteps > depth) return 0;
      return Math.max(1 - coveredSteps * dim, 0.2);
    }
    return 1;
  });

  const filter = useTransform(scrollYProgress, (progress) => {
    if (blur === 0 || progress <= cardActive) return 'blur(0px)';
    const coveredSteps = Math.min((progress - cardActive) / step, depth);
    return `blur(${coveredSteps * blur}px)`;
  });

  const rotateX = useTransform(scrollYProgress, (progress) => {
    if (variant !== 'flip') return 0;
    if (progress < cardActive) {
      const enterProgress = Math.min(Math.max((progress - cardStart) / step, 0), 1);
      return (1 - enterProgress) * 35;
    }
    return 0;
  });

  const rotateZ = useTransform(scrollYProgress, (progress) => {
    if (variant !== 'deck') return 0;
    if (progress > cardActive) {
      const coveredSteps = Math.min((progress - cardActive) / step, depth);
      return (index % 2 === 0 ? 1 : -1) * coveredSteps * 1.5;
    }
    return 0;
  });

  const zIndex = index * 10;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full will-change-transform"
      style={{
        y,
        scale,
        opacity,
        filter,
        rotateX,
        rotateZ,
        zIndex,
        borderRadius: `${borderRadius}px`,
        transformOrigin: 'center top',
      }}
    >
      <div
        className="w-full h-full bg-[#FFFFFF] border border-neutral-200/90 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-colors"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        {children ? (
          children
        ) : item ? (
          <DefaultCardLayout item={item} />
        ) : null}
      </div>
    </motion.div>
  );
};

const DefaultCardLayout: React.FC<{ item: ScrollStackItem }> = ({ item }) => {
  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white">
      {/* Left Info Column */}
      <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Eyebrow / Tag & Badge */}
          <div className="flex items-center gap-2 mb-3">
            {item.eyebrow && (
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                {item.eyebrow}
              </span>
            )}
            {item.tag && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono bg-neutral-100 text-neutral-800 border border-neutral-200">
                {item.tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#09090B] leading-tight">
            {item.title}
          </h3>

          {/* Subtitle / Department */}
          {item.subtitle && (
            <p className="mt-1 text-xs sm:text-sm font-mono text-neutral-500">
              {item.subtitle}
            </p>
          )}

          {/* Description */}
          <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            {item.description || item.body}
          </p>
        </div>

        {/* Bottom Section: Stats & Action Button */}
        <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {item.stats && item.stats.length > 0 && (
            <div className="flex items-center gap-4 sm:gap-6">
              {item.stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-lg sm:text-xl font-bold font-mono tracking-tight text-[#09090B]">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
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
              className="inline-flex items-center justify-center gap-2 bg-[#09090B] hover:bg-neutral-800 text-white text-xs font-mono font-medium px-4 py-2 rounded-md transition-colors w-fit"
            >
              <span>{item.action.label}</span>
              <span>→</span>
            </a>
          )}
        </div>
      </div>

      {/* Right Image / Visual Column */}
      {item.image && (
        <div className="hidden md:block md:col-span-5 relative bg-neutral-100 border-l border-neutral-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default ScrollStack;
