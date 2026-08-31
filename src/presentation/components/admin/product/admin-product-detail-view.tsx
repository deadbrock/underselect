'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { PageHeader } from '@presentation/components/layout';
import { ADMIN_PRODUCT_STATUS_LABELS } from '@shared/constants/product-admin.constants';
import type { AdminProduct } from '@shared/types/product-admin.types';
import { formatCurrency, formatDate } from '@shared/utils/format';
import { shouldUnoptimizeImage } from '@shared/utils/media-src';

import { AdminProductActions } from './admin-product-actions';

export interface AdminProductDetailViewProps {
  product: AdminProduct;
}

export const AdminProductDetailView = memo(function AdminProductDetailView({
  product,
}: AdminProductDetailViewProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title={product.name}
        description={`SKU ${product.sku} · ${product.categoryLabel}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={`/admin/produtos/${product.id}/editar` as Route}>
                Editar
              </Link>
            </Button>
            <AdminProductActions product={product} compact />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="shadow-none">
          <CardContent className="p-4">
            <div className="bg-muted relative aspect-square overflow-hidden p-4">
              <Image
                src={product.imageUrl}
                alt={product.imageAlt ?? product.name}
                fill
                className="object-contain"
                sizes="320px"
                priority
                unoptimized={shouldUnoptimizeImage(product.imageUrl)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <Info
                label="Status"
                value={ADMIN_PRODUCT_STATUS_LABELS[product.status]}
              />
              <Info label="Preço" value={formatCurrency(product.price)} />
              <Info label="Estoque" value={String(product.stockQuantity)} />
              <Info label="Marca" value={product.brand} />
              <Info label="Coleção" value={product.collection} />
              <Info
                label="Time/Seleção"
                value={product.team ?? product.selection ?? '—'}
              />
              <Info label="Cadastro" value={formatDate(product.createdAt)} />
              <Info label="Atualização" value={formatDate(product.updatedAt)} />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">Variações</CardTitle>
            </CardHeader>
            <CardContent>
              {product.variations.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma variação.
                </p>
              ) : (
                <ul className="divide-border divide-y text-sm">
                  {product.variations.map((v) => (
                    <li key={v.id} className="flex justify-between py-2">
                      <span>
                        {[v.size, v.color, v.model].filter(Boolean).join(' · ')}{' '}
                        — {v.sku}
                      </span>
                      <span className="tabular-nums">
                        {formatCurrency(v.price)} · {v.stock} un.
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            {product.onSale && <Badge>Promoção</Badge>}
            {product.isNew && <Badge variant="secondary">Novo</Badge>}
            {product.isFeatured && <Badge variant="outline">Destaque</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
});

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground text-xs tracking-wider uppercase">
        {label}
      </span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
