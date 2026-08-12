import { CATALOG_SUBCATEGORY_TEAMS } from '@shared/constants/catalog.constants';
import {
  listPublicProducts,
  getProductDetailBySlug,
  getAllActiveProductSlugs,
  getRelatedCatalogProducts,
} from '@infrastructure/database/repositories/product.repository';
import type { CatalogProduct } from '@shared/types/catalog.types';
import type {
  ProductDetail,
  ProductRelatedGroups,
} from '@shared/types/product-detail.types';
import {
  applyFilters,
  buildCategoryBreadcrumbs,
  buildCategoryPath,
  getCategoryMeta as getCategoryMetaStatic,
  paginateProducts,
  parseSearchParams,
  processCatalog,
  searchProducts,
  sortProducts,
} from '@shared/utils/catalog.utils';

export async function fetchCatalogProducts(): Promise<CatalogProduct[]> {
  return listPublicProducts();
}

export async function fetchProductsByCategorySlug(
  slug: string[],
): Promise<CatalogProduct[]> {
  if (!slug.length) return fetchCatalogProducts();

  const [category, sub] = slug;
  const products = await listPublicProducts({
    category: { slug: category },
  });

  if (sub && CATALOG_SUBCATEGORY_TEAMS[sub]) {
    const teamName = CATALOG_SUBCATEGORY_TEAMS[sub];
    return products.filter(
      (product) => product.team === teamName || product.selection === teamName,
    );
  }

  return products;
}

export async function fetchPromoProducts(): Promise<CatalogProduct[]> {
  return listPublicProducts({ onSale: true });
}

export async function fetchNewProducts(): Promise<CatalogProduct[]> {
  return listPublicProducts({ isNew: true });
}

export async function fetchFeaturedProducts(): Promise<CatalogProduct[]> {
  return listPublicProducts({ isFeatured: true });
}

export async function fetchBestSellerProducts(): Promise<CatalogProduct[]> {
  return listPublicProducts({ isBestSeller: true });
}

export async function fetchProductBySlug(
  slug: string,
): Promise<ProductDetail | undefined> {
  return getProductDetailBySlug(slug);
}

export async function fetchAllProductSlugs(): Promise<string[]> {
  return getAllActiveProductSlugs();
}

export async function fetchRelatedProducts(
  product: ProductDetail,
): Promise<ProductRelatedGroups> {
  return getRelatedCatalogProducts({
    id: product.id,
    category: product.category,
    collection: product.collection,
    team: product.team,
    selection: product.selection,
  });
}

export {
  applyFilters,
  buildCategoryBreadcrumbs,
  buildCategoryPath,
  getCategoryMetaStatic as getCategoryMeta,
  paginateProducts,
  parseSearchParams,
  processCatalog,
  searchProducts,
  sortProducts,
};
