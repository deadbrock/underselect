'use client';

import { Minus, Plus, Search } from 'lucide-react';
import { memo } from 'react';

import { Button, Input } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  onSearch?: (value: string) => void;
}

const SearchInput = memo(function SearchInput({
  className,
  onSearch,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        className="pl-10"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch?.(e.currentTarget.value);
        }}
        {...props}
      />
    </div>
  );
});

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

const QuantityStepper = memo(function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn('flex items-center border', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 rounded-none"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Diminuir quantidade"
      >
        <Minus className="size-3" />
      </Button>
      <span className="flex size-11 items-center justify-center text-sm tabular-nums">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 rounded-none"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Aumentar quantidade"
      >
        <Plus className="size-3" />
      </Button>
    </div>
  );
});

export { SearchInput, QuantityStepper };
