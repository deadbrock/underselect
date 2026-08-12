import { Suspense } from 'react';

import { CatalogExperience } from '@presentation/components/catalog';
import { Spinner } from '@presentation/components/feedback';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';
import { fetchNewProducts } from '@shared/services/catalog.service';

export const metadata = createPageMetadata({
  title: 'Novidades',
  description:
    'Lançamentos UNDER SELECT. Camisas de clubes, seleções, retrô e linha íntima masculina.',
  path: '/novidades',
});

export const revalidate = 60;

function CatalogFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default async function NovidadesPage() {
  const products = await fetchNewProducts();

  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Novidades',
            description: 'Lançamentos UNDER SELECT.',
            path: '/novidades',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Novidades', path: '/novidades' },
          ]),
        ]}
      />
      <Suspense fallback={<CatalogFallback />}>
        <CatalogExperience
          products={products}
          config={{
            title: 'Novidades',
            description:
              'Os lançamentos mais recentes da UNDER SELECT. Edições limitadas e novas coleções.',
            eyebrow: 'Lançamentos',
            basePath: '/novidades',
            canonicalPath: '/novidades',
            breadcrumbs: [
              { label: 'Início', href: '/' },
              { label: 'Novidades' },
            ],
          }}
        />
      </Suspense>
    </>
  );
}
