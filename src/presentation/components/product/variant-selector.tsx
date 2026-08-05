'use client';

import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface VariantOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface VariantSelectorProps {
  label: string;
  options: VariantOption[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

const VariantSelector = memo(function VariantSelector({
  label,
  options,
  value,
  onChange,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <span className="text-label">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.id}
            type="button"
            variant={value === option.value ? 'default' : 'outline'}
            size="sm"
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className="min-w-[3rem]"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
});

export { VariantSelector };
