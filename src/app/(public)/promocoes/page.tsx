import { Suspense } from 'react';

import { CatalogExperience } from '@presentation/components/catalog';
import { Spinner } from '@presentation/components/feedback';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';
import { fetchPromoProducts } from '@shared/services/catalog.service';
import { dynamic } from '@shared/config/data-page.config';

export { dynamic };

export const metadata = createPageMetadata({
  title: 'Promoções',
  description:
    'Promoções exclusivas UNDER SELECT. Camisas de clubes, seleções e peças íntimas com desconto.',
  path: '/promocoes',
});

export const revalidate = 60;

function CatalogFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default async function PromocoesPage() {
  const products = await fetchPromoProducts();

  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Promoções',
            description: 'Promoções UNDER SELECT.',
            path: '/promocoes',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Promoções', path: '/promocoes' },
          ]),
        ]}
      />
      <Suspense fallback={<CatalogFallback />}>
        <CatalogExperience
          products={products}
          config={{
            title: 'Promoções',
            description:
              'Seleção especial com preços promocionais. Peças premium com condições exclusivas.',
            eyebrow: 'Ofertas',
            basePath: '/promocoes',
            canonicalPath: '/promocoes',
            breadcrumbs: [
              { label: 'Início', href: '/' },
              { label: 'Promoções' },
            ],
            presetFilters: { onSale: true },
          }}
        />
      </Suspense>
    </>
  );
}
