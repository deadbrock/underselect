'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { CatalogProductGrid } from '@presentation/components/catalog';
import { EmptyState } from '@presentation/components/feedback';
import { Button } from '@presentation/components/ui';
import type { CatalogProduct } from '@shared/types/catalog.types';

export interface AccountProductSectionProps {
  title: string;
  products: (CatalogProduct | undefined)[];
  emptyMessage: string;
  href?: string;
}

export const AccountProductSection = memo(function AccountProductSection({
  title,
  products,
  emptyMessage,
  href,
}: AccountProductSectionProps) {
  const valid = products.filter(Boolean) as CatalogProduct[];

  return (
    <section aria-label={title}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-lg font-medium tracking-tight">{title}</h2>
        {href && valid.length > 0 && (
          <Button variant="link" asChild className="text-label h-auto p-0">
            <Link href={href as Route}>Ver todos</Link>
          </Button>
        )}
      </div>
      {valid.length === 0 ? (
        <EmptyState title={emptyMessage} className="py-8" />
      ) : (
        <CatalogProductGrid products={valid} />
      )}
    </section>
  );
});
