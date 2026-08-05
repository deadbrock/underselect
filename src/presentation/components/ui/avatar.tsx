import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const Avatar = memo(
  forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex size-10 shrink-0 overflow-hidden',
        className,
      )}
      {...props}
    />
  )),
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = memo(
  forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )),
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = memo(
  forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'bg-muted text-muted-foreground flex size-full items-center justify-center text-xs font-medium uppercase',
        className,
      )}
      {...props}
    />
  )),
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
