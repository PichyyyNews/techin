import React from 'react';

interface MetricItem {
  value: string;
  label: string;
}

interface MetricsBarProps {
  metrics?: MetricItem[];
  className?: string;
}

const DEFAULT_METRICS: MetricItem[] = [
  { value: '20M+', label: 'Videos created' },
  { value: '10x', label: 'Faster editing' },
  { value: '180k+', label: 'Active creators' },
];

export const MetricsBar: React.FC<MetricsBarProps> = ({
  metrics = DEFAULT_METRICS,
  className = '',
}) => {
  return (
    <div className={`w-full border-y border-neutral-200 dark:border-neutral-800 ${className}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
        {metrics.map((item, idx) => (
          <div key={idx} className="py-8 px-6 sm:px-10 flex flex-col justify-center">
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-orange-600 dark:text-orange-500 font-sans">
              {item.value}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-wider font-mono text-neutral-600 dark:text-neutral-400 font-medium">
              <span className="inline-block w-1.5 h-1.5 bg-orange-600 dark:bg-orange-500 rounded-xs" />
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
