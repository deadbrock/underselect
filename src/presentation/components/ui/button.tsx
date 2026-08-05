import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-label transition-luxury focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-brand-gray-900 dark:hover:bg-brand-gray-100 dark:hover:text-brand-black',
        bronze: 'bg-brand-bronze text-brand-white hover:bg-brand-bronze-dark',
        outline:
          'border border-foreground bg-transparent hover:bg-foreground hover:text-background',
        ghost: 'hover:bg-muted text-foreground',
        link: 'text-brand-bronze underline-offset-4 hover:underline p-0 h-auto',
        destructive:
          'bg-destructive text-destructive-foreground hover:opacity-90',
      },
      size: {
        default: 'h-11 px-8',
        sm: 'h-9 px-5 text-[0.625rem]',
        lg: 'h-12 px-10',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : 'button';
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    },
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
