import { CATALOG_SUBCATEGORY_TEAMS } from '@shared/constants/catalog.constants';
import type { CatalogProduct } from '@shared/types/catalog.types';
import type {
  ProductDetail,
  ProductRelatedGroups,
} from '@shared/types/product-detail.types';

function teamSlug(team: string): string | undefined {
  return Object.entries(CATALOG_SUBCATEGORY_TEAMS).find(
    ([, name]) => name === team,
  )?.[0];
}

export function getProductBySlug(_slug: string): ProductDetail | undefined {
  return undefined;
}

export function getAllProductSlugs(): string[] {
  return [];
}

export function buildProductBreadcrumbs(product: CatalogProduct) {
  const crumbs: { label: string; href?: `/${string}` | '/' }[] = [
    { label: 'Início', href: '/' },
    { label: 'Catálogo', href: '/categoria' },
    {
      label: product.categoryLabel,
      href: `/categoria/${product.category}` as `/${string}`,
    },
  ];

  const entity = product.team ?? product.selection;
  if (entity) {
    const sub = teamSlug(entity);
    if (sub) {
      crumbs.push({
        label: entity,
        href: `/categoria/${product.category}/${sub}` as `/${string}`,
      });
    } else {
      crumbs.push({ label: entity });
    }
  }

  crumbs.push({ label: product.name });
  return crumbs;
}

export function getRelatedProducts(
  _product: CatalogProduct,
): ProductRelatedGroups {
  return {
    similar: [],
    alsoBought: [],
    sameCollection: [],
  };
}
