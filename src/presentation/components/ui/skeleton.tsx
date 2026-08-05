import { memo } from 'react';

import { cn } from '@shared/utils/cn';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-muted animate-pulse', className)} {...props} />;
}

const MemoizedSkeleton = memo(Skeleton);
MemoizedSkeleton.displayName = 'Skeleton';

export { MemoizedSkeleton as Skeleton };
