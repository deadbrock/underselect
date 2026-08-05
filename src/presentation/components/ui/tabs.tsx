import * as TabsPrimitive from '@radix-ui/react-tabs';
import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const Tabs = TabsPrimitive.Root;

const TabsList = memo(
  forwardRef<
    React.ComponentRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-11 items-center justify-center p-1',
        className,
      )}
      {...props}
    />
  )),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = memo(
  forwardRef<
    React.ComponentRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground text-label transition-luxury inline-flex items-center justify-center px-6 py-2 whitespace-nowrap focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 data-[state=active]:shadow-sm',
        className,
      )}
      {...props}
    />
  )),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = memo(
  forwardRef<
    React.ComponentRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'ring-offset-background focus-visible:ring-ring mt-4 focus-visible:ring-1 focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  )),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
