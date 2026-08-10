'use client';

import { memo, useEffect } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import { AdminModulePagination } from '@presentation/components/admin/admin-module-pagination';
import { Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useAdminStore } from '@presentation/stores/admin';
import { useMarketingStore } from '@presentation/stores/admin/marketing';

import { CouponCards } from './coupon-cards';
import { CouponTable } from './coupon-table';
import { CouponToolbar } from './coupon-toolbar';
import { useCouponListState } from './use-coupon-list-state';

export const CouponList = memo(function CouponList() {
  const coupons = useMarketingStore((s) => s.coupons);
  const attributions = useMarketingStore((s) => s.attributions);
  const setGlobalLoading = useAdminStore((s) => s.setGlobalLoading);
  const state = useCouponListState(coupons, attributions);

  useEffect(() => {
    setGlobalLoading(state.isLoading);
  }, [state.isLoading, setGlobalLoading]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cupons"
        description="Criação rápida, regras e atribuição de vendas."
      />
      <CouponToolbar
        search={state.filters.search}
        onSearchChange={(v) => state.updateFilter('search', v)}
        sort={state.sort}
        onSortChange={state.setSort}
        filters={state.filters}
        onChange={state.updateFilter}
        onReset={state.resetFilters}
      />
      {state.isLoading ? (
        <div className="flex justify-center py-16" role="status">
          <Spinner className="size-8" />
        </div>
      ) : state.paginated.length === 0 ? (
        <EmptyState title="Nenhum cupom encontrado" className="py-16" />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="shadow-none">
              <CardContent className="p-0">
                <CouponTable coupons={state.paginated} />
              </CardContent>
            </Card>
          </div>
          <div className="md:hidden">
            <CouponCards coupons={state.paginated} />
          </div>
          <AdminModulePagination
            page={state.page}
            totalPages={state.totalPages}
            totalItems={state.totalItems}
            onPageChange={state.setPage}
          />
        </>
      )}
    </div>
  );
});
