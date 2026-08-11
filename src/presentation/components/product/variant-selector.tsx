'use client';

import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface VariantOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  unavailable?: boolean;
}

export interface VariantSelectorProps {
  label: string;
  options: VariantOption[];
  value?: string;
  onChange: (value: string) => void;
  onUnavailableSelect?: (option: VariantOption) => void;
  className?: string;
}

const VariantSelector = memo(function VariantSelector({
  label,
  options,
  value,
  onChange,
  onUnavailableSelect,
  className,
}: VariantSelectorProps) {
  const handleSelect = (option: VariantOption) => {
    if (option.disabled || option.unavailable) {
      onUnavailableSelect?.(option);
      return;
    }

    onChange(option.value);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <span className="text-label">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isUnavailable = Boolean(option.disabled || option.unavailable);

          return (
            <Button
              key={option.id}
              type="button"
              variant={value === option.value ? 'default' : 'outline'}
              size="sm"
              aria-disabled={isUnavailable}
              aria-pressed={value === option.value}
              onClick={() => handleSelect(option)}
              className={cn(
                'min-w-[3rem]',
                isUnavailable &&
                  'border-border text-muted-foreground line-through opacity-60',
              )}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

export { VariantSelector };
