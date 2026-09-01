import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ArrowUpRight } from 'lucide-react';

export interface ScrollStackItem {
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
}

export interface ScrollStackProps {
  items?: ScrollStackItem[];
  children?: React.ReactNode;
  variant?: 'stack' | 'deck' | 'fade' | 'flip' | 'zoom';
  scrollLength?: number;
  peek?: number;
  scaleStep?: number;
  blur?: number;
  dim?: number;
  depth?: number;
  cardWidth?: number | string;
  cardHeight?: number | string;
  borderRadius?: number;
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
  peek = 22,
  scaleStep = 0.04,
  blur = 2,
  dim = 0.15,
  depth = 3,
  cardWidth = 960,
  cardHeight = 440,
  borderRadius = 12,
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
        height: `${Math.max(count * scrollLength * 85, 140)}vh`,
      }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Card Stage */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{
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

        {/* Minimalist Segmented Indicator */}
        {(showProgress || showCounter) && (
          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-neutral-400 select-none">
            {showCounter && (
              <span className="tracking-widest">
                <span className="text-neutral-900 font-semibold">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="text-neutral-300 mx-1.5">/</span>
                <span>{String(count).padStart(2, '0')}</span>
              </span>
            )}

            {showProgress && (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: count }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-xs transition-all duration-300',
                      i === activeIndex
                        ? 'w-6 bg-[#09090B]'
                        : i < activeIndex
                        ? 'w-2 bg-neutral-400'
                        : 'w-2 bg-neutral-200'
                    )}
                  />
                ))}
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
  variant: 'stack' | 'deck' | 'fade' | 'flip' | 'zoom';
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
    if (index === 0) return 0;
    if (progress < cardStart) return 1000;
    if (progress <= cardActive) {
      const enterProgress = (progress - cardStart) / step;
      return (1 - enterProgress) * 600;
    }
    const coveredSteps = Math.min((progress - cardActive) / step, depth);
    return -coveredSteps * peek;
  });

  const scale = useTransform(scrollYProgress, (progress) => {
    if (progress <= cardActive) {
      if (index > 0 && progress >= cardStart) {
        const enterProgress = Math.max(0, (progress - cardStart) / step);
        return 0.94 + enterProgress * 0.06;
      }
      return 1;
    }
    const coveredSteps = Math.min((progress - cardActive) / step, depth);
    return Math.max(1 - coveredSteps * scaleStep, 0.85);
  });

  const opacity = useTransform(scrollYProgress, (progress) => {
    if (index > 0 && progress < cardStart + step * 0.2) {
      return Math.max(0, (progress - cardStart) / (step * 0.6));
    }
    if (progress > cardActive) {
      const coveredSteps = (progress - cardActive) / step;
      if (coveredSteps > depth) return 0;
      return Math.max(1 - coveredSteps * dim, 0.3);
    }
    return 1;
  });

  const filter = useTransform(scrollYProgress, (progress) => {
    if (blur === 0 || progress <= cardActive) return 'blur(0px)';
    const coveredSteps = Math.min((progress - cardActive) / step, depth);
    return `blur(${coveredSteps * blur}px)`;
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
        zIndex,
        borderRadius: `${borderRadius}px`,
        transformOrigin: 'center top',
      }}
    >
      <div
        className="w-full h-full bg-[#FFFFFF] border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden"
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
      {/* Left Column: Details & Technical Data */}
      <div className="md:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Top Metadata Header */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-neutral-100 mb-4">
            <span className="font-mono text-xs font-semibold text-neutral-900">
              {item.code || '01'}
            </span>
            {item.category && (
              <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider">
                {item.category}
              </span>
            )}
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090B] leading-snug">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="mt-1 font-mono text-xs text-neutral-500">
              {item.subtitle}
            </p>
          )}

          {/* Description */}
          <p className="mt-3.5 text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        {/* Bottom Metadata Grid */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {item.stats && item.stats.length > 0 && (
            <div className="flex items-center divide-x divide-neutral-200">
              {item.stats.map((stat, i) => (
                <div key={i} className={cn('flex flex-col', i === 0 ? 'pr-4' : 'px-4')}>
                  <span className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#09090B] leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-1 whitespace-nowrap">
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
              className="inline-flex items-center justify-center gap-1.5 bg-[#09090B] hover:bg-neutral-800 text-white text-xs font-mono px-3.5 py-2 rounded-xs transition-colors w-fit shrink-0"
            >
              <span>{item.action.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Visual Frame */}
      {item.image && (
        <div className="hidden md:block md:col-span-5 relative bg-neutral-900 border-l border-neutral-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-neutral-950/10 pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default ScrollStack;
