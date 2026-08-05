import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const Checkbox = memo(
  forwardRef<
    React.ComponentRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
  >(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'border-foreground focus-visible:ring-ring data-[state=checked]:bg-foreground data-[state=checked]:text-background peer transition-luxury size-4 shrink-0 border focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('flex items-center justify-center text-current')}
      >
        <Check className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
