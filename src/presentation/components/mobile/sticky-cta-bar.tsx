'use client';

import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface StickyCtaBarProps {
  label: string;
  price?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const StickyCtaBar = memo(function StickyCtaBar({
  label,
  price,
  onClick,
  loading = false,
  disabled = false,
  className,
}: StickyCtaBarProps) {
  return (
    <div
      className={cn(
        'border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur md:hidden',
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {price && (
          <span className="text-lg font-medium tabular-nums">{price}</span>
        )}
        <Button
          className="flex-1"
          size="lg"
          onClick={onClick}
          disabled={disabled || loading}
        >
          {loading ? 'Processando...' : label}
        </Button>
      </div>
    </div>
  );
});

export { StickyCtaBar };
