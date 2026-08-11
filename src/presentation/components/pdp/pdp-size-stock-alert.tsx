'use client';

import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface PdpSizeStockAlertProps {
  message?: string | null;
  className?: string;
}

const PdpSizeStockAlert = memo(function PdpSizeStockAlert({
  message,
  className,
}: PdpSizeStockAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'border-destructive/20 bg-destructive/5 text-destructive animate-in fade-in-0 slide-in-from-top-1 rounded-sm border px-3 py-2 text-sm leading-relaxed duration-200',
        className,
      )}
    >
      {message}
    </div>
  );
});

export { PdpSizeStockAlert };
