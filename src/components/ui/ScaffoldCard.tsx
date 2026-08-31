import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ScaffoldCardProps {
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export const ScaffoldCard: React.FC<ScaffoldCardProps> = ({
  title,
  description,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer min-h-[220px] ${className}`}
    >
      <div className="flex items-center justify-between w-full">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
          {title}
        </h3>
        <span className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>

      <div className="mt-8 pt-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  );
};
