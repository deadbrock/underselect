'use client';

import { memo } from 'react';

import { cn } from '@shared/utils/cn';
import type { OrderTimelineEvent } from '@shared/types/account.types';
import { formatDateTime } from '@shared/utils/format';

export interface AccountOrderTimelineProps {
  events: OrderTimelineEvent[];
  className?: string;
}

export const AccountOrderTimeline = memo(function AccountOrderTimeline({
  events,
  className,
}: AccountOrderTimelineProps) {
  return (
    <ol
      className={cn('relative space-y-0', className)}
      aria-label="Status do pedido"
    >
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  'absolute top-5 left-[7px] h-[calc(100%-12px)] w-px',
                  event.completed ? 'bg-foreground/30' : 'bg-border',
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                'relative z-10 mt-1 size-3.5 shrink-0 rounded-full border-2',
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
              {event.date && (
                <time
                  className="text-muted-foreground text-xs tabular-nums"
                  dateTime={event.date}
                >
                  {formatDateTime(event.date)}
                </time>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
});
