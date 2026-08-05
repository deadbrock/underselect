'use client';

import { memo } from 'react';

import type { OrderHistoryEntry } from '@shared/types/order-admin.types';
import { formatDateTime } from '@shared/utils/format';

export interface OrderHistoryListProps {
  entries: OrderHistoryEntry[];
}

export const OrderHistoryList = memo(function OrderHistoryList({
  entries,
}: OrderHistoryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhum registro no histórico.
      </p>
    );
  }

  return (
    <ul className="divide-border divide-y" aria-label="Histórico do pedido">
      {entries.map((entry) => (
        <li key={entry.id} className="space-y-1 py-3 first:pt-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">{entry.label}</p>
            <time
              className="text-muted-foreground shrink-0 text-xs tabular-nums"
              dateTime={entry.createdAt}
            >
              {formatDateTime(entry.createdAt)}
            </time>
          </div>
          <p className="text-muted-foreground text-xs">{entry.description}</p>
          <p className="text-muted-foreground text-[0.625rem]">{entry.user}</p>
        </li>
      ))}
    </ul>
  );
});
