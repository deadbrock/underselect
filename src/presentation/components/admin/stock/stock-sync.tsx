'use client';

import { useEffect } from 'react';

import { useProductStore } from '@presentation/stores/admin/product';
import { useStockStore } from '@presentation/stores/admin/stock';

export function StockSync({ children }: { children: React.ReactNode }) {
  const products = useProductStore((s) => s.products);
  const syncFromProducts = useStockStore((s) => s.syncFromProducts);

  useEffect(() => {
    syncFromProducts(products);
  }, [products, syncFromProducts]);

  return children;
}
