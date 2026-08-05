import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'size-4', md: 'size-6', lg: 'size-8' };

const Spinner = memo(function Spinner({
  size = 'md',
  className,
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={cn(
        'border-foreground animate-spin rounded-full border-2 border-t-transparent',
        sizeMap[size],
        className,
      )}
    />
  );
});

export { Spinner };
