import * as SwitchPrimitives from '@radix-ui/react-switch';
import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const Switch = memo(
  forwardRef<
    React.ComponentRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
  >(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        'focus-visible:ring-ring data-[state=checked]:bg-brand-bronze peer transition-luxury data-[state=unchecked]:bg-muted inline-flex h-5 w-9 shrink-0 cursor-pointer items-center border border-transparent focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background pointer-events-none block size-4 shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitives.Root>
  )),
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
