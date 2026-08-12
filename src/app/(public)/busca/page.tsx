import { Suspense } from 'react';

import { CatalogExperience } from '@presentation/components/catalog';
import { Spinner } from '@presentation/components/feedback';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';
import { fetchCatalogProducts } from '@shared/services/catalog.service';
import { dynamic } from '@shared/config/data-page.config';

export { dynamic };

export const metadata = createPageMetadata({
  title: 'Busca',
  description:
    'Encontre camisas de clubes, seleções, retrô e peças íntimas premium na UNDER SELECT.',
  path: '/busca',
});

export const revalidate = 60;

function CatalogFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default async function BuscaPage() {
  const products = await fetchCatalogProducts();

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
          products={products}
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
