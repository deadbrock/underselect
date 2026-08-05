import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = memo(
  forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => (
      <textarea
        className={cn(
          'border-input bg-background placeholder:text-muted-foreground transition-luxury focus-visible:ring-ring flex min-h-[120px] w-full border px-4 py-3 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
          error && 'border-destructive focus-visible:ring-destructive',
          className,
        )}
        ref={ref}
        {...props}
      />
    ),
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
