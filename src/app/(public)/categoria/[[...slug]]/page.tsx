import { Suspense } from 'react';

import { CatalogExperience } from '@presentation/components/catalog';
import { Spinner } from '@presentation/components/feedback';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';
import {
  buildCategoryBreadcrumbs,
  buildCategoryPath,
  CATALOG_PRODUCTS,
  getCategoryMeta,
  getProductsByCategorySlug,
} from '@shared/mocks/catalog.utils';

interface CategoryPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['clubes-brasileiros'] },
    { slug: ['clubes-brasileiros', 'flamengo'] },
    { slug: ['clubes-brasileiros', 'corinthians'] },
    { slug: ['clubes-brasileiros', 'palmeiras'] },
    { slug: ['selecoes'] },
    { slug: ['selecoes', 'brasil'] },
    { slug: ['retro'] },
    { slug: ['casual-esportiva'] },
    { slug: ['cuecas-boxer'] },
    { slug: ['intimas-masculinas'] },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug = [] } = await params;
  const meta = getCategoryMeta(slug);
  const path = buildCategoryPath(slug) as `/${string}`;

  return createPageMetadata({
    title: meta.title,
    description: meta.description,
    path,
  });
}

function CatalogFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug = [] } = await params;
  const meta = getCategoryMeta(slug);
  const path = buildCategoryPath(slug);
  const products = getProductsByCategorySlug(slug);
  const breadcrumbs = buildCategoryBreadcrumbs(slug);

  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: meta.title,
            description: meta.description,
            path: path as `/${string}` | '/',
          }),
          createBreadcrumbSchema(
            breadcrumbs.map((b) => ({
              name: b.label,
              path: (b.href ?? path) as `/${string}` | '/',
            })),
          ),
        ]}
      />
      <Suspense fallback={<CatalogFallback />}>
        <CatalogExperience
          products={products.length ? products : CATALOG_PRODUCTS}
          config={{
            title: meta.title,
            description: meta.description,
            eyebrow: 'Catálogo',
            basePath: path,
            canonicalPath: path,
            breadcrumbs,
            presetFilters:
              slug[0] && !slug[1] ? { categories: [slug[0]] } : undefined,
          }}
          hideCategoryFilter={!!slug[0]}
        />
      </Suspense>
    </>
  );
}
