import type { Prisma } from '@prisma/client';
import { CATALOG_TYPES } from '@shared/constants/catalog.constants';
import type {
  AdminProduct,
  AdminProductInput,
} from '@shared/types/product-admin.types';
import type { CatalogProduct } from '@shared/types/catalog.types';
import type {
  ProductDetail,
  ProductFaqItem,
  ProductReviews,
  ProductSpecification,
  ProductSizeChartRow,
} from '@shared/types/product-detail.types';

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    collection: true;
    variations: true;
    gallery: { orderBy: { sortOrder: 'asc' } };
    colors: true;
    models: true;
  };
}>;

function decimal(
  value: Prisma.Decimal | number | null | undefined,
): number | undefined {
  if (value == null) return undefined;
  return Number(value);
}

function getTypeLabel(type: string): string {
  return CATALOG_TYPES.find((item) => item.value === type)?.label ?? type;
}

function calcDiscountPercent(
  price: number,
  compareAtPrice?: number,
): number | undefined {
  if (!compareAtPrice || compareAtPrice <= price) return undefined;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

function parseJsonArray<T>(value: Prisma.JsonValue | null | undefined): T[] {
  if (!value || !Array.isArray(value)) return [];
  return value as T[];
}

function defaultReviews(): ProductReviews {
  return {
    averageRating: 0,
    totalCount: 0,
    distribution: [
      { stars: 5, count: 0 },
      { stars: 4, count: 0 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ],
    comments: [],
    customerPhotosReady: false,
  };
}

function defaultFaq(): ProductFaqItem[] {
  return [
    {
      question: 'Como escolher o tamanho?',
      answer:
        'Consulte a tabela de medidas na página do produto. Em caso de dúvida, prefira o tamanho acima.',
    },
    {
      question: 'Qual o prazo de entrega?',
      answer:
        'O prazo varia conforme sua região e modalidade de frete escolhida no checkout.',
    },
  ];
}

export function toCatalogProduct(
  product: ProductWithRelations,
): CatalogProduct {
  const price = Number(product.price);
  const compareAtPrice = decimal(product.compareAtPrice);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price,
    compareAtPrice,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt ?? undefined,
    badge: product.badge ?? undefined,
    isNew: product.isNew,
    category: product.category.slug as CatalogProduct['category'],
    categoryLabel: product.category.label,
    type: product.type as CatalogProduct['type'],
    typeLabel: getTypeLabel(product.type),
    team: product.team ?? undefined,
    selection: product.selection ?? undefined,
    brand: product.brand,
    season: product.season,
    sizes: product.sizes,
    installmentCount: product.installmentCount,
    onSale: product.onSale,
    inStock: product.inStock,
    isBestSeller: product.isBestSeller,
    discountPercent: calcDiscountPercent(price, compareAtPrice),
    createdAt: product.createdAt.toISOString(),
  };
}

export function toAdminProduct(product: ProductWithRelations): AdminProduct {
  const catalog = toCatalogProduct(product);
  const price = Number(product.price);
  const compareAtPrice = decimal(product.compareAtPrice);

  return {
    ...catalog,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    onSale: product.onSale,
    isBestSeller: product.isBestSeller,
    inStock: product.inStock,
    sku: product.sku,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    collection: product.collection?.name ?? '',
    tags: product.tags,
    cost: decimal(product.cost),
    weight: decimal(product.weight),
    height: decimal(product.height),
    width: decimal(product.width),
    length: decimal(product.length),
    status: product.status as AdminProduct['status'],
    stockQuantity: product.stockQuantity,
    variations: product.variations.map((variation) => ({
      id: variation.id,
      size: variation.size ?? undefined,
      color: variation.color ?? undefined,
      model: variation.model ?? undefined,
      sku: variation.sku,
      price: Number(variation.price),
      stock: variation.stock,
      imageUrl: variation.imageUrl ?? undefined,
    })),
    gallery: product.gallery.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt ?? undefined,
      isCover: image.isCover,
      order: image.sortOrder,
    })),
    seo: {
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      keywords: product.keywords ?? '',
      slug: product.seoSlug,
      ogTitle: product.ogTitle ?? undefined,
      ogDescription: product.ogDescription ?? undefined,
      ogImage: product.ogImage ?? undefined,
    },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    discountPercent: calcDiscountPercent(price, compareAtPrice),
  };
}

export function toProductDetail(product: ProductWithRelations): ProductDetail {
  const catalog = toCatalogProduct(product);
  const images =
    product.gallery.length > 0
      ? product.gallery.map((image) => ({
          url: image.url,
          alt: image.alt ?? undefined,
        }))
      : [{ url: product.imageUrl, alt: product.imageAlt ?? undefined }];

  const colors =
    product.colors.length > 0
      ? product.colors.map((color) => ({
          id: color.id,
          label: color.label,
          hex: color.hex,
          disabled: color.disabled,
        }))
      : [{ id: 'default', label: 'Principal', hex: '#1a1a1a' }];

  const models =
    product.models.length > 0
      ? product.models.map((model) => ({
          id: model.id,
          label: model.label,
          disabled: model.disabled,
        }))
      : [{ id: 'default', label: 'Padrão' }];

  const reviewsDistribution = parseJsonArray<{ stars: number; count: number }>(
    product.reviewsDistribution,
  );
  const reviewsComments = parseJsonArray<ProductReviews['comments'][number]>(
    product.reviewsComments,
  );

  return {
    ...catalog,
    sku: product.sku,
    collection: product.collection?.name ?? '',
    images,
    colors,
    models,
    unavailableSizes: product.unavailableSizes,
    description:
      product.description ??
      product.fullDescription ??
      product.shortDescription,
    specifications: parseJsonArray<ProductSpecification>(
      product.specifications,
    ),
    sizeChart: parseJsonArray<ProductSizeChartRow>(product.sizeChart),
    returnsPolicy:
      product.returnsPolicy ??
      'Trocas em até 7 dias após o recebimento, conforme CDC.',
    faq: parseJsonArray<ProductFaqItem>(product.faq).length
      ? parseJsonArray<ProductFaqItem>(product.faq)
      : defaultFaq(),
    reviews: {
      averageRating: product.reviewsAverage,
      totalCount: product.reviewsCount,
      distribution:
        reviewsDistribution.length > 0
          ? reviewsDistribution
          : defaultReviews().distribution,
      comments: reviewsComments,
      customerPhotosReady: false,
    },
    estimatedDelivery: product.estimatedDelivery ?? '8 a 15 dias úteis',
    customizationAvailable: product.customizationAvailable,
  };
}

export function buildProductCreateData(
  input: AdminProductInput,
  categoryId: string,
  collectionId: string | null,
) {
  return {
    name: input.name,
    slug: input.slug,
    sku: input.sku,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    categoryId,
    type: input.type,
    collectionId,
    team: input.team ?? null,
    selection: input.selection ?? null,
    brand: input.brand,
    season: input.season,
    tags: input.tags,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    cost: input.cost ?? null,
    weight: input.weight ?? null,
    height: input.height ?? null,
    width: input.width ?? null,
    length: input.length ?? null,
    isFeatured: input.isFeatured,
    isNew: input.isNew,
    onSale: input.onSale,
    isBestSeller: input.isBestSeller,
    status: input.status,
    inStock: input.inStock,
    stockQuantity: input.stockQuantity,
    sizes: input.sizes,
    installmentCount: input.installmentCount,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt ?? null,
    badge: input.badge ?? null,
    metaTitle: input.seo.metaTitle,
    metaDescription: input.seo.metaDescription,
    seoSlug: input.seo.slug,
    keywords: input.seo.keywords || null,
    ogTitle: input.seo.ogTitle ?? null,
    ogDescription: input.seo.ogDescription ?? null,
    ogImage: input.seo.ogImage ?? null,
    description: input.fullDescription,
    unavailableSizes: [],
    variations: {
      create: input.variations.map((variation) => ({
        size: variation.size ?? null,
        color: variation.color ?? null,
        model: variation.model ?? null,
        sku: variation.sku,
        price: variation.price,
        stock: variation.stock,
        imageUrl: variation.imageUrl ?? null,
      })),
    },
    gallery: {
      create: input.gallery.map((image) => ({
        url: image.url,
        alt: image.alt ?? null,
        isCover: image.isCover,
        sortOrder: image.order,
      })),
    },
    colors: {
      create: [{ label: 'Principal', hex: '#1a1a1a' }],
    },
    models: {
      create: [{ label: 'Padrão' }],
    },
  };
}

export function buildProductUpdateData(
  input: AdminProductInput,
  categoryId: string,
  collectionId: string | null,
) {
  return {
    name: input.name,
    slug: input.slug,
    sku: input.sku,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    categoryId,
    type: input.type,
    collectionId,
    team: input.team ?? null,
    selection: input.selection ?? null,
    brand: input.brand,
    season: input.season,
    tags: input.tags,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    cost: input.cost ?? null,
    weight: input.weight ?? null,
    height: input.height ?? null,
    width: input.width ?? null,
    length: input.length ?? null,
    isFeatured: input.isFeatured,
    isNew: input.isNew,
    onSale: input.onSale,
    isBestSeller: input.isBestSeller,
    status: input.status,
    inStock: input.inStock,
    stockQuantity: input.stockQuantity,
    sizes: input.sizes,
    installmentCount: input.installmentCount,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt ?? null,
    badge: input.badge ?? null,
    metaTitle: input.seo.metaTitle,
    metaDescription: input.seo.metaDescription,
    seoSlug: input.seo.slug,
    keywords: input.seo.keywords || null,
    ogTitle: input.seo.ogTitle ?? null,
    ogDescription: input.seo.ogDescription ?? null,
    ogImage: input.seo.ogImage ?? null,
    description: input.fullDescription,
    variations: {
      deleteMany: {},
      create: input.variations.map((variation) => ({
        size: variation.size ?? null,
        color: variation.color ?? null,
        model: variation.model ?? null,
        sku: variation.sku,
        price: variation.price,
        stock: variation.stock,
        imageUrl: variation.imageUrl ?? null,
      })),
    },
    gallery: {
      deleteMany: {},
      create: input.gallery.map((image) => ({
        url: image.url,
        alt: image.alt ?? null,
        isCover: image.isCover,
        sortOrder: image.order,
      })),
    },
  };
}

export const productInclude = {
  category: true,
  collection: true,
  variations: true,
  gallery: { orderBy: { sortOrder: 'asc' as const } },
  colors: true,
  models: true,
} satisfies Prisma.ProductInclude;
