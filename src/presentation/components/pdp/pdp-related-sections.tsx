'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { memo } from 'react';

import { CatalogProductGrid } from '@presentation/components/catalog';
import { Container } from '@presentation/components/layout';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import type { CatalogProduct } from '@shared/mocks/catalog.types';
import type { ProductRelatedGroups } from '@shared/mocks/product-detail.types';

export interface PdpRelatedSectionsProps {
  related: ProductRelatedGroups;
}

function RelatedBlock({
  title,
  products,
}: {
  title: string;
  products: CatalogProduct[];
}) {
  if (!products.length) return null;

  return (
    <section aria-label={title} className="py-10 md:py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-xl font-medium tracking-tight md:text-2xl">
          {title}
        </h2>
        <Link
          href={'/categoria' as Route}
          className="text-label text-muted-foreground hover:text-foreground transition-luxury"
        >
          Ver catálogo
        </Link>
      </div>
      <CatalogProductGrid products={products} />
    </section>
  );
}

const PdpRelatedSections = memo(function PdpRelatedSections({
  related,
}: PdpRelatedSectionsProps) {
  return (
    <Container className="border-border border-t">
      <MotionReveal>
        <RelatedBlock title="Produtos semelhantes" products={related.similar} />
      </MotionReveal>
      <MotionReveal delay={0.05}>
        <RelatedBlock
          title="Clientes também compraram"
          products={related.alsoBought}
        />
      </MotionReveal>
      <MotionReveal delay={0.1}>
        <RelatedBlock title="Mesma coleção" products={related.sameCollection} />
      </MotionReveal>
    </Container>
  );
});

export { PdpRelatedSections };
