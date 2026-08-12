'use client';

import { memo, useEffect } from 'react';

import { useOrderStore } from '@presentation/stores/admin/order';

export const OrderHydrator = memo(function OrderHydrator() {
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const isHydrated = useOrderStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      void loadOrders();
    }
  }, [isHydrated, loadOrders]);

  return null;
});
