import { env } from '@infrastructure/config';

import { STORE_NAME } from '../constants/store-navigation';

export type JsonLdObject = Record<string, unknown>;

export function createOrganizationSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: STORE_NAME,
    url: env.NEXT_PUBLIC_APP_URL,
    logo: `${env.NEXT_PUBLIC_APP_URL}/og-default.svg`,
    sameAs: ['https://instagram.com'],
  };
}

export function createWebSiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: STORE_NAME,
    url: env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${env.NEXT_PUBLIC_APP_URL}/busca?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function createWebPageSchema(options: {
  name: string;
  description: string;
  path: `/${string}` | '/';
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.name,
    description: options.description,
    url: new URL(options.path, env.NEXT_PUBLIC_APP_URL).toString(),
    isPartOf: {
      '@type': 'WebSite',
      name: STORE_NAME,
      url: env.NEXT_PUBLIC_APP_URL,
    },
  };
}

export function createProductSchema(product: {
  name: string;
  description: string;
  slug: string;
  sku: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  imageUrl: string;
  images?: { url: string }[];
  reviews?: {
    averageRating: number;
    totalCount: number;
  };
}): JsonLdObject {
  const productUrl = new URL(
    `/produto/${product.slug}`,
    env.NEXT_PUBLIC_APP_URL,
  ).toString();

  const images = (product.images ?? [{ url: product.imageUrl }]).map((img) =>
    new URL(img.url, env.NEXT_PUBLIC_APP_URL).toString(),
  );

  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: images,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'BRL',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      ...(product.compareAtPrice && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      }),
    },
  };

  if (product.reviews && product.reviews.totalCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.reviews.averageRating.toFixed(1),
      reviewCount: product.reviews.totalCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export function createBreadcrumbSchema(
  items: { name: string; path: `/${string}` | '/' }[],
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, env.NEXT_PUBLIC_APP_URL).toString(),
    })),
  };
}
