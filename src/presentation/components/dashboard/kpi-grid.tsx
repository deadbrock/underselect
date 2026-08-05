import { memo } from 'react';

import { StatCard } from '@presentation/components/data-display';
import { cn } from '@shared/utils/cn';

export interface KpiItem {
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: number; label: string };
}

export interface KpiGridProps {
  items: KpiItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const KpiGrid = memo(function KpiGrid({
  items,
  columns = 4,
  className,
}: KpiGridProps) {
  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {items.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
});

export { KpiGrid };
