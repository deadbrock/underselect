'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { Badge } from '@presentation/components/ui';
import { Price } from '@presentation/components/data-display';
import { cn } from '@shared/utils/cn';

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  imageAlt?: string;
  badge?: string;
  isNew?: boolean;
}

export interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  priority?: boolean;
}

const ProductCard = memo(function ProductCard({
  product,
  className,
  priority = false,
}: ProductCardProps) {
  return (
    <article className={cn('group relative', className)}>
      <Link href={`/produto/${product.slug}` as Route} className="block">
        <div className="bg-muted relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
          {(product.badge || product.isNew) && (
            <div className="absolute top-3 left-3 flex gap-1">
              {product.isNew && <Badge variant="bronze">Novo</Badge>}
              {product.badge && (
                <Badge variant="outline">{product.badge}</Badge>
              )}
            </div>
          )}
        </div>
        <div className="space-y-1 pt-4">
          <h3 className="text-sm font-normal tracking-wide">{product.name}</h3>
          <Price
            value={product.price}
            compareAt={product.compareAtPrice}
            size="sm"
          />
        </div>
      </Link>
    </article>
  );
});

export { ProductCard };
