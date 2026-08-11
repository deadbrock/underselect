import { memo } from 'react';

import { Price } from '@presentation/components/data-display';
import { cn } from '@shared/utils/cn';
import type { ProductDetail } from '@shared/types/product-detail.types';

export interface PdpPricingProps {
  product: ProductDetail;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

const PdpPricing = memo(function PdpPricing({
  product,
  className,
}: PdpPricingProps) {
  const installmentValue = product.price / product.installmentCount;
  const savings =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice - product.price
      : null;

  return (
    <div className={cn('space-y-2', className)}>
      <Price
        value={product.price}
        compareAt={product.compareAtPrice}
        size="lg"
      />
      <p className="text-muted-foreground text-sm">
        ou {product.installmentCount}x de{' '}
        <span className="text-foreground font-medium">
          {formatCurrency(installmentValue)}
        </span>{' '}
        sem juros
      </p>
      {savings !== null && (
        <p className="text-sm text-[var(--brand-bronze)]">
          Economize {formatCurrency(savings)}
          {product.discountPercent ? ` (−${product.discountPercent}%)` : ''}
        </p>
      )}
    </div>
  );
});

export { PdpPricing };
