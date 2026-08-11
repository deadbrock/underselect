'use client';

import { useEffect } from 'react';

import { useProductStore } from '@presentation/stores/admin/product';
import { useStockStore } from '@presentation/stores/admin/stock';

export function StockSync({ children }: { children: React.ReactNode }) {
  const products = useProductStore((s) => s.products);
  const isHydrated = useProductStore((s) => s.isHydrated);
  const loadProducts = useProductStore((s) => s.loadProducts);
  const syncFromProducts = useStockStore((s) => s.syncFromProducts);

  useEffect(() => {
    if (!isHydrated) {
      void loadProducts();
    }
  }, [isHydrated, loadProducts]);

  useEffect(() => {
    if (isHydrated) {
      syncFromProducts(products);
    }
  }, [products, isHydrated, syncFromProducts]);

  return children;
}
