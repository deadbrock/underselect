import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface PriceProps {
  value: number;
  currency?: string;
  locale?: string;
  size?: 'sm' | 'md' | 'lg';
  compareAt?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

const Price = memo(function Price({
  value,
  currency = 'BRL',
  locale = 'pt-BR',
  size = 'md',
  compareAt,
  className,
}: PriceProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);

  const formattedCompare = compareAt
    ? new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
        compareAt,
      )
    : null;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-medium tabular-nums', sizeClasses[size])}>
        {formatted}
      </span>
      {formattedCompare && (
        <span className="text-muted-foreground text-sm tabular-nums line-through">
          {formattedCompare}
        </span>
      )}
    </div>
  );
});

export { Price };
