'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { DataTable, type Column } from '@presentation/components/data-display';
import { EmptyState } from '@presentation/components/feedback';
import { Spinner } from '@presentation/components/feedback';
import { Badge, Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { toast } from '@presentation/hooks';
import { useAdminStore } from '@presentation/stores/admin';
import {
  ADMIN_MODULE_META,
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_STATUS_LABELS,
} from '@shared/constants/admin.constants';
import { getAdminModuleData } from '@shared/data/admin.data';
import type { AdminListRow, AdminModuleId } from '@shared/types/admin.types';
import { formatDate } from '@shared/utils/format';

import { AdminModuleActions } from './admin-module-actions';
import { AdminModuleMobileCards } from './admin-module-mobile-cards';
import { AdminModulePagination } from './admin-module-pagination';
import { AdminModuleToolbar } from './admin-module-toolbar';

const PAGE_SIZE = 8;

function StatusBadge({ status }: { status: string }) {
  const label =
    ADMIN_ORDER_STATUS_LABELS[status] ?? ADMIN_STATUS_LABELS[status] ?? status;
  return <Badge variant="secondary">{label}</Badge>;
}

export interface AdminModuleListProps {
  moduleId: AdminModuleId;
}

export const AdminModuleList = memo(function AdminModuleList({
  moduleId,
}: AdminModuleListProps) {
  const meta = ADMIN_MODULE_META[moduleId];
  const setGlobalLoading = useAdminStore((s) => s.setGlobalLoading);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const allData = useMemo(() => getAdminModuleData(moduleId), [moduleId]);

  useEffect(() => {
    setIsLoading(true);
    setGlobalLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setGlobalLoading(false);
    }, 400);
    return () => {
      clearTimeout(timer);
      setGlobalLoading(false);
    };
  }, [moduleId, search, statusFilter, page, setGlobalLoading]);

  const filtered = useMemo(() => {
    let rows = allData;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.subtitle?.toLowerCase().includes(q) ||
          r.meta?.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'all') {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    return rows;
  }, [allData, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, moduleId]);

  const handleNew = useCallback(() => {
    toast.info(
      `Criar novo ${meta.singularLabel} — integração futura preparada.`,
    );
  }, [meta.singularLabel]);

  const columns: Column<AdminListRow>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Nome',
        cell: (row) => (
          <div>
            <p className="font-medium">{row.name}</p>
            {row.subtitle && (
              <p className="text-muted-foreground text-xs">{row.subtitle}</p>
            )}
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        cell: (row) => <StatusBadge status={row.status} />,
        hideOnMobile: true,
      },
      {
        key: 'meta',
        header: 'Info',
        cell: (row) => row.meta ?? '—',
        hideOnMobile: true,
      },
      {
        key: 'value',
        header: 'Valor',
        cell: (row) =>
          row.value !== undefined ? (
            <span className="tabular-nums">{row.value}</span>
          ) : (
            '—'
          ),
        hideOnMobile: true,
      },
      {
        key: 'createdAt',
        header: 'Data',
        cell: (row) => (row.createdAt ? formatDate(row.createdAt) : '—'),
        hideOnMobile: true,
      },
      {
        key: 'actions',
        header: 'Ações',
        cell: (row) => (
          <AdminModuleActions
            itemName={row.name}
            singularLabel={meta.singularLabel}
          />
        ),
        className: 'w-[120px]',
      },
    ],
    [meta.singularLabel],
  );

  return (
    <div className="space-y-6">
      <PageHeader title={meta.title} description={meta.description} />

      <AdminModuleToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNew={handleNew}
        singularLabel={meta.singularLabel}
      />

      {isLoading ? (
        <div className="flex justify-center py-16" role="status">
          <Spinner className="size-8" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum registro encontrado"
          description="Tente ajustar os filtros ou criar um novo item."
          className="py-16"
        />
      ) : (
        <>
          <Card className="hidden shadow-none md:block">
            <CardContent className="p-0">
              <DataTable
                data={paginated}
                columns={columns}
                keyExtractor={(row) => row.id}
              />
            </CardContent>
          </Card>

          <AdminModuleMobileCards
            rows={paginated}
            singularLabel={meta.singularLabel}
          />

          <AdminModulePagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
});
