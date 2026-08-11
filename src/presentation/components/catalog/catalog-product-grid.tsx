import { memo } from 'react';

import { cn } from '@shared/utils/cn';
import type { CatalogProduct } from '@shared/types/catalog.types';

import { CatalogProductCard } from './catalog-product-card';

export interface CatalogProductGridProps {
  products: CatalogProduct[];
  onQuickView?: (product: CatalogProduct) => void;
  className?: string;
  /** Preparado para virtualização futura (@tanstack/react-virtual) */
  virtualized?: boolean;
}

const CatalogProductGrid = memo(function CatalogProductGrid({
  products,
  onQuickView,
  className,
  virtualized = false,
}: CatalogProductGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4',
        className,
      )}
      data-virtualized={virtualized ? 'ready' : 'off'}
      role="list"
      aria-label="Lista de produtos"
    >
      {products.map((product, index) => (
        <div key={product.id} role="listitem">
          <CatalogProductCard
            product={product}
            priority={index < 4}
            onQuickView={onQuickView}
          />
        </div>
      ))}
    </div>
  );
});

export { CatalogProductGrid };
