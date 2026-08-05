import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, forwardRef } from 'react';

import { cn } from '@shared/utils/cn';

const labelVariants = cva(
  'text-label text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
);

const Label = memo(
  forwardRef<
    React.ComponentRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
      VariantProps<typeof labelVariants>
  >(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  )),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
