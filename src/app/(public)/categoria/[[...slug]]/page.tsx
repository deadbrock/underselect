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
  getCategoryMeta,
} from '@shared/utils/catalog.utils';
import { fetchProductsByCategorySlug } from '@shared/services/catalog.service';
interface CategoryPageProps {
  params: Promise<{ slug?: string[] }>;
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
  const products = await fetchProductsByCategorySlug(slug);
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
          products={products}
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
