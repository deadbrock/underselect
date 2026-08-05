'use client';

import Image from 'next/image';
import { memo } from 'react';

import { Badge, Card, CardContent } from '@presentation/components/ui';
import { ADMIN_PRODUCT_STATUS_LABELS } from '@shared/constants/product-admin.constants';
import type { AdminProduct } from '@shared/types/product-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';

import { AdminProductActions } from './admin-product-actions';

export interface AdminProductGridViewProps {
  products: AdminProduct[];
}

export const AdminProductGridView = memo(function AdminProductGridView({
  products,
}: AdminProductGridViewProps) {
  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Produtos em grid"
    >
      {products.map((product) => (
        <li key={product.id}>
          <Card className="shadow-none">
            <CardContent className="space-y-4 p-4">
              <div className="bg-muted relative aspect-square overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt ?? product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {product.onSale && <Badge>Promoção</Badge>}
                  {product.isNew && <Badge variant="secondary">Novo</Badge>}
                </div>
              </div>
              <div className="space-y-1">
                <p className="line-clamp-2 font-medium">{product.name}</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {product.sku}
                </p>
                <p className="text-muted-foreground text-xs">
                  {product.categoryLabel} · {product.collection}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                <Badge variant="secondary">
                  {ADMIN_PRODUCT_STATUS_LABELS[product.status]}
                </Badge>
              </div>
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Estoque: {product.stockQuantity}</span>
                <time dateTime={product.createdAt}>
                  {formatDate(product.createdAt)}
                </time>
              </div>
              <AdminProductActions product={product} compact />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
});
