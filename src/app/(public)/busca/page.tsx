import { Suspense } from 'react';

import { CatalogExperience } from '@presentation/components/catalog';
import { Spinner } from '@presentation/components/feedback';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';
import { CATALOG_PRODUCTS } from '@shared/mocks/catalog.utils';

export const metadata = createPageMetadata({
  title: 'Busca',
  description:
    'Encontre camisas de clubes, seleções, retrô e peças íntimas premium na UNDER SELECT.',
  path: '/busca',
});

function CatalogFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function BuscaPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Busca',
            description: 'Busca de produtos UNDER SELECT.',
            path: '/busca',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Busca', path: '/busca' },
          ]),
        ]}
      />
      <Suspense fallback={<CatalogFallback />}>
        <CatalogExperience
          products={CATALOG_PRODUCTS}
          showSearch
          config={{
            title: 'Busca',
            description:
              'Busque por nome, time, seleção, categoria ou marca. Resultados em tempo real.',
            eyebrow: 'Encontrar',
            basePath: '/busca',
            canonicalPath: '/busca',
            breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Busca' }],
          }}
        />
      </Suspense>
    </>
  );
}
