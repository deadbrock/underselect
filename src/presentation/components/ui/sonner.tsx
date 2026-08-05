'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { cn } from '@shared/utils/cn';

const Toaster = ({ className, ...props }: ToasterProps) => (
  <Sonner
    theme="system"
    className={cn('toaster group', className)}
    toastOptions={{
      classNames: {
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-none',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton:
          'group-[.toast]:bg-foreground group-[.toast]:text-background',
        cancelButton:
          'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }}
    {...props}
  />
);

export { Toaster };
