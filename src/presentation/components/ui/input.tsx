import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => (
      <input
        type={type}
        className={cn(
          'border-input bg-background placeholder:text-muted-foreground transition-luxury focus-visible:ring-ring flex h-11 w-full border px-4 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
          error && 'border-destructive focus-visible:ring-destructive',
          className,
        )}
        ref={ref}
        {...props}
      />
    ),
  ),
);
Input.displayName = 'Input';

export { Input };
