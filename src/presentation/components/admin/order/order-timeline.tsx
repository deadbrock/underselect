'use client';

import { memo } from 'react';

import { cn } from '@shared/utils/cn';
import type { AdminOrderTimelineEvent } from '@shared/types/order-admin.types';
import { formatDateTime } from '@shared/utils/format';

export interface OrderTimelineProps {
  events: AdminOrderTimelineEvent[];
  className?: string;
  compact?: boolean;
}

export const OrderTimeline = memo(function OrderTimeline({
  events,
  className,
  compact = false,
}: OrderTimelineProps) {
  return (
    <ol
      className={cn('relative space-y-0', className)}
      aria-label="Timeline do pedido"
    >
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <li
            key={event.id}
            className={cn(
              'relative flex gap-4',
              compact ? 'pb-5' : 'pb-8',
              isLast && 'pb-0',
            )}
          >
            {!isLast && (
              <span
                className={cn(
                  'absolute top-5 left-[7px] h-[calc(100%-12px)] w-px transition-colors',
                  event.completed ? 'bg-foreground/30' : 'bg-border',
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                'relative z-10 mt-1 size-3.5 shrink-0 rounded-full border-2 transition-colors',
                event.completed
                  ? 'border-foreground bg-foreground'
                  : 'border-muted-foreground/40 bg-background',
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1 space-y-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  !event.completed && 'text-muted-foreground',
                )}
              >
                {event.label}
              </p>
              <p className="text-muted-foreground text-xs">
                {event.description}
              </p>
              <p className="text-muted-foreground text-[0.625rem]">
                {event.user}
              </p>
              {event.createdAt && (
                <time
                  className="text-muted-foreground text-xs tabular-nums"
                  dateTime={event.createdAt}
                >
                  {formatDateTime(event.createdAt)}
                </time>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
});
