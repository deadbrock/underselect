import { memo } from 'react';

import { cn } from '@shared/utils/cn';

import { ProductCard, type ProductCardData } from './product-card';

export interface ProductGridProps {
  products: ProductCardData[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

const ProductGrid = memo(function ProductGrid({
  products,
  columns = 4,
  className,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        'grid gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10',
        columnClasses[columns],
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
});

export { ProductGrid };
