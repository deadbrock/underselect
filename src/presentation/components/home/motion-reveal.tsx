'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface MotionRevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  direction?: 'up' | 'down' | 'none';
}

const directionOffset = {
  up: 16,
  down: -16,
  none: 0,
};

export const MotionReveal = memo(function MotionReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  ...props
}: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: directionOffset[direction] }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
});
