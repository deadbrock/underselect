'use client';

import { memo, useMemo } from 'react';

import { Price } from '@presentation/components/data-display';
import { cn } from '@shared/utils/cn';
import { resolveVariationPricing } from '@shared/utils/product-variation.utils';
import type { ProductVariationOption } from '@shared/utils/product-variation.utils';

export interface PdpPricingProps {
  price: number;
  compareAtPrice?: number;
  installmentCount: number;
  discountPercent?: number;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export interface PdpPricingFromProductProps {
  product: {
    price: number;
    compareAtPrice?: number;
    installmentCount: number;
    discountPercent?: number;
  };
  variation?: ProductVariationOption;
  className?: string;
}

const PdpPricing = memo(function PdpPricing({
  product,
  variation,
  className,
}: PdpPricingFromProductProps) {
  const pricing = useMemo(
    () => resolveVariationPricing(product, variation),
    [product, variation],
  );

  const installmentValue = pricing.price / product.installmentCount;
  const savings =
    pricing.compareAtPrice && pricing.compareAtPrice > pricing.price
      ? pricing.compareAtPrice - pricing.price
      : null;

  return (
    <div className={cn('space-y-2', className)}>
      <Price
        value={pricing.price}
        compareAt={pricing.compareAtPrice}
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
          {pricing.discountPercent ? ` (−${pricing.discountPercent}%)` : ''}
        </p>
      )}
    </div>
  );
});

export { PdpPricing };
