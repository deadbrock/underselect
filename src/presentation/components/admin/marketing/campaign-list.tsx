'use client';

import { memo, useEffect } from 'react';

import { EmptyState, Spinner } from '@presentation/components/feedback';
import { AdminModulePagination } from '@presentation/components/admin/admin-module-pagination';
import { Card, CardContent } from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { useAdminStore } from '@presentation/stores/admin';
import { useMarketingStore } from '@presentation/stores/admin/marketing';

import { CampaignCards } from './campaign-cards';
import { CampaignTable } from './campaign-table';
import { CampaignToolbar } from './campaign-toolbar';
import { useCampaignListState } from './use-campaign-list-state';

export const CampaignList = memo(function CampaignList() {
  const campaigns = useMarketingStore((s) => s.campaigns);
  const setGlobalLoading = useAdminStore((s) => s.setGlobalLoading);
  const state = useCampaignListState(campaigns);

  useEffect(() => {
    setGlobalLoading(state.isLoading);
  }, [state.isLoading, setGlobalLoading]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campanhas"
        description="Promoções, metas e cupons associados."
      />
      <CampaignToolbar
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
        <EmptyState title="Nenhuma campanha" className="py-16" />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="shadow-none">
              <CardContent className="p-0">
                <CampaignTable campaigns={state.paginated} />
              </CardContent>
            </Card>
          </div>
          <div className="md:hidden">
            <CampaignCards campaigns={state.paginated} />
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
