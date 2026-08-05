'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { memo } from 'react';

import { STOCK_ALERT_LABELS } from '@shared/constants/stock.constants';
import type { StockAlert } from '@shared/types/stock.types';
import { cn } from '@shared/utils/cn';

export interface StockAlertsBannerProps {
  alerts: StockAlert[];
  className?: string;
}

export const StockAlertsBanner = memo(function StockAlertsBanner({
  alerts,
  className,
}: StockAlertsBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div
      className={cn(
        'border-destructive/30 bg-destructive/5 flex flex-col gap-2 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Alertas de estoque</p>
          <ul className="text-muted-foreground space-y-0.5 text-xs">
            {alerts.map((a) => (
              <li key={a.id}>
                <span className="font-medium">
                  {STOCK_ALERT_LABELS[a.type]}:
                </span>{' '}
                {a.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link
        href="/admin/estoque/alertas"
        className="text-label text-brand-bronze shrink-0 hover:underline"
      >
        Ver todos
      </Link>
    </div>
  );
});
