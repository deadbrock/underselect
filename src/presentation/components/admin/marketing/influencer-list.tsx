'use client';

import { memo, useEffect } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import { AdminModulePagination } from '@presentation/components/admin/admin-module-pagination';
import { Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useAdminStore } from '@presentation/stores/admin';
import { useMarketingStore } from '@presentation/stores/admin/marketing';

import { InfluencerCards } from './influencer-cards';
import { InfluencerTable } from './influencer-table';
import { InfluencerToolbar } from './influencer-toolbar';
import { useInfluencerListState } from './use-influencer-list-state';

export const InfluencerList = memo(function InfluencerList() {
  const influencers = useMarketingStore((s) => s.influencers);
  const campaigns = useMarketingStore((s) => s.campaigns);
  const coupons = useMarketingStore((s) => s.coupons);
  const attributions = useMarketingStore((s) => s.attributions);
  const setGlobalLoading = useAdminStore((s) => s.setGlobalLoading);

  const {
    filters,
    sort,
    page,
    isLoading,
    paginated,
    metricsMap,
    totalPages,
    totalItems,
    setSort,
    setPage,
    updateFilter,
    resetFilters,
  } = useInfluencerListState(influencers, campaigns, coupons, attributions);

  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Influenciadores"
        description="Parceiros, códigos e performance de atribuição."
      />

      <InfluencerToolbar
        search={filters.search}
        onSearchChange={(v) => updateFilter('search', v)}
        sort={sort}
        onSortChange={setSort}
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      {isLoading ? (
        <div className="flex justify-center py-16" role="status">
          <Spinner className="size-8" />
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          title="Nenhum influenciador encontrado"
          description="Ajuste os filtros ou cadastre um novo parceiro."
          className="py-16"
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="shadow-none">
              <CardContent className="p-0">
                <InfluencerTable
                  influencers={paginated}
                  metricsMap={metricsMap}
                />
              </CardContent>
            </Card>
          </div>
          <div className="md:hidden">
            <InfluencerCards influencers={paginated} metricsMap={metricsMap} />
          </div>
          <AdminModulePagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
});
