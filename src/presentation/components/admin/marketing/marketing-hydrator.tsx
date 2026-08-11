'use client';

import { useEffect } from 'react';

import { useMarketingStore } from '@presentation/stores/admin/marketing';

export function MarketingHydrator() {
  const hydrate = useMarketingStore((s) => s.hydrate);
  const hydrated = useMarketingStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  return null;
}
