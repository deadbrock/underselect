'use client';

import { memo } from 'react';

import { Badge, Card, CardContent } from '@presentation/components/ui';
import {
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_STATUS_LABELS,
} from '@shared/constants/admin.constants';
import type { AdminListRow } from '@shared/types/admin.types';
import { formatDate } from '@shared/utils/format';

import { AdminModuleActions } from './admin-module-actions';

export interface AdminModuleMobileCardsProps {
  rows: AdminListRow[];
  singularLabel: string;
}

function StatusBadge({ status }: { status: string }) {
  const label =
    ADMIN_ORDER_STATUS_LABELS[status] ?? ADMIN_STATUS_LABELS[status] ?? status;

  return <Badge variant="secondary">{label}</Badge>;
}

export const AdminModuleMobileCards = memo(function AdminModuleMobileCards({
  rows,
  singularLabel,
}: AdminModuleMobileCardsProps) {
  return (
    <ul className="space-y-3 md:hidden" aria-label="Lista de registros">
      {rows.map((row) => (
        <li key={row.id}>
          <Card className="shadow-none">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{row.name}</p>
                  {row.subtitle && (
                    <p className="text-muted-foreground truncate text-sm">
                      {row.subtitle}
                    </p>
                  )}
                </div>
                <StatusBadge status={row.status} />
              </div>
              <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {row.meta && <span>{row.meta}</span>}
                {row.value !== undefined && (
                  <span className="text-foreground font-medium tabular-nums">
                    {row.value}
                  </span>
                )}
                {row.badge && (
                  <Badge variant="outline" className="text-[0.625rem]">
                    {row.badge}
                  </Badge>
                )}
                {row.createdAt && (
                  <time dateTime={row.createdAt}>
                    {formatDate(row.createdAt)}
                  </time>
                )}
              </div>
              <AdminModuleActions
                itemName={row.name}
                singularLabel={singularLabel}
              />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
});
