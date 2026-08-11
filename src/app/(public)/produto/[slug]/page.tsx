import { notFound } from 'next/navigation';

import { ProductDetailExperience } from '@presentation/components/pdp';
import {
  JsonLd,
  createPageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
  createProductSchema,
} from '@shared/seo';
import {
  fetchAllProductSlugs,
  fetchProductBySlug,
  fetchRelatedProducts,
} from '@shared/services/catalog.service';
import { buildProductBreadcrumbs } from '@shared/utils/product-detail.utils';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await fetchAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return createPageMetadata({
      title: 'Produto não encontrado',
      description: 'O produto solicitado não foi encontrado.',
      path: '/categoria',
      noIndex: true,
    });
  }

  const path = `/produto/${slug}` as `/${string}`;

  return createPageMetadata({
    title: product.name,
    description: product.description.slice(0, 160),
    path,
    ogImage: product.imageUrl,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) notFound();

  const breadcrumbs = buildProductBreadcrumbs(product);
  const related = await fetchRelatedProducts(product);
  const path = `/produto/${slug}` as `/${string}`;

  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: product.name,
            description: product.description.slice(0, 160),
            path,
          }),
          createProductSchema({
            name: product.name,
            description: product.description,
            slug: product.slug,
            sku: product.sku,
            brand: product.brand,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            inStock: product.inStock,
            imageUrl: product.imageUrl,
            images: product.images,
            reviews: {
              averageRating: product.reviews.averageRating,
              totalCount: product.reviews.totalCount,
            },
          }),
          createBreadcrumbSchema(
            breadcrumbs
              .filter((b) => b.href)
              .map((b) => ({
                name: b.label,
                path: b.href!,
              }))
              .concat([{ name: product.name, path }]),
          ),
        ]}
      />
      <ProductDetailExperience
        product={product}
        breadcrumbs={breadcrumbs}
        related={related}
      />
    </>
  );
}
