'use client';

import { Drawer as DrawerPrimitive } from 'vaul';
import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const Drawer = ({
  shouldScaleBackground = true,
  direction = 'bottom',
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    direction={direction}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = memo(
  forwardRef<
    React.ComponentRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
  >(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )),
);
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = memo(
  forwardRef<
    React.ComponentRef<typeof DrawerPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
      side?: 'bottom' | 'right' | 'left';
    }
  >(({ className, children, side = 'bottom', ...props }, ref) => (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          'bg-background fixed z-50 flex flex-col border',
          side === 'bottom' &&
            'inset-x-0 bottom-0 mt-24 max-h-[96vh] rounded-t-none',
          side === 'right' && 'inset-y-0 right-0 h-full w-full max-w-md',
          side === 'left' && 'inset-y-0 left-0 h-full w-full max-w-md',
          className,
        )}
        {...props}
      >
        {side === 'bottom' && (
          <div className="bg-muted mx-auto mt-4 h-1 w-12 shrink-0" />
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )),
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = memo(function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('grid gap-1.5 p-6 text-center sm:text-left', className)}
      {...props}
    />
  );
});

const DrawerFooter = memo(function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-6', className)}
      {...props}
    />
  );
});

const DrawerTitle = memo(
  forwardRef<
    React.ComponentRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
  >(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn(
        'text-lg leading-none font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  )),
);
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = memo(
  forwardRef<
    React.ComponentRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
  >(({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )),
);
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
