'use client';

import { memo } from 'react';

import { cn } from '@shared/utils/cn';
import type { AdminCustomerActivity } from '@shared/types/customer-admin.types';
import { formatDateTime } from '@shared/utils/format';

export interface CustomerActivityTimelineProps {
  activities: AdminCustomerActivity[];
  className?: string;
}

export const CustomerActivityTimeline = memo(function CustomerActivityTimeline({
  activities,
  className,
}: CustomerActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhuma atividade registrada.
      </p>
    );
  }

  return (
    <ol
      className={cn('relative space-y-0', className)}
      aria-label="Atividade do cliente"
    >
      {activities.map((activity, index) => {
        const isLast = index === activities.length - 1;
        return (
          <li key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className="bg-border absolute top-5 left-[7px] h-[calc(100%-12px)] w-px"
                aria-hidden
              />
            )}
            <span
              className="border-foreground bg-foreground relative z-10 mt-1 size-3.5 shrink-0 rounded-full border-2"
              aria-hidden
            />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.label}</p>
              <p className="text-muted-foreground text-xs">
                {activity.description}
              </p>
              <time
                className="text-muted-foreground text-xs tabular-nums"
                dateTime={activity.createdAt}
              >
                {formatDateTime(activity.createdAt)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
});
