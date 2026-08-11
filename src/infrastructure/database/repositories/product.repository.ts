import { prisma } from '@infrastructure/database';
import {
  buildProductCreateData,
  buildProductUpdateData,
  productInclude,
  toAdminProduct,
  toCatalogProduct,
  toProductDetail,
} from '@infrastructure/database/mappers/product.mapper';
import type { AdminProductInput } from '@shared/types/product-admin.types';
import type { Prisma } from '@prisma/client';

async function resolveCategoryId(categorySlug: string) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) {
    throw new Error(`Categoria "${categorySlug}" não encontrada.`);
  }
  return category.id;
}

async function resolveCollectionId(collectionName: string) {
  if (!collectionName.trim()) return null;
  const collection = await prisma.collection.findFirst({
    where: { name: collectionName },
  });
  return collection?.id ?? null;
}

export async function listPublicProducts(where?: Prisma.ProductWhereInput) {
  const products = await prisma.product.findMany({
    where: {
      status: 'active',
      ...where,
    },
    include: productInclude,
    orderBy: [{ isBestSeller: 'desc' }, { createdAt: 'desc' }],
  });

  return products.map(toCatalogProduct);
}

export async function listAdminProducts() {
  const products = await prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });

  return products.map(toAdminProduct);
}

export async function getProductDetailBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, status: 'active' },
    include: productInclude,
  });

  return product ? toProductDetail(product) : undefined;
}

export async function getAdminProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  return product ? toAdminProduct(product) : undefined;
}

export async function getAllActiveProductSlugs() {
  const products = await prisma.product.findMany({
    where: { status: 'active' },
    select: { slug: true },
    orderBy: { createdAt: 'desc' },
  });

  return products.map((product) => product.slug);
}

export async function createProduct(input: AdminProductInput) {
  const categoryId = await resolveCategoryId(input.category);
  const collectionId = await resolveCollectionId(input.collection);

  const product = await prisma.product.create({
    data: buildProductCreateData(input, categoryId, collectionId),
    include: productInclude,
  });

  return toAdminProduct(product);
}

export async function updateProduct(id: string, input: AdminProductInput) {
  const categoryId = await resolveCategoryId(input.category);
  const collectionId = await resolveCollectionId(input.collection);

  const product = await prisma.product.update({
    where: { id },
    data: buildProductUpdateData(input, categoryId, collectionId),
    include: productInclude,
  });

  return toAdminProduct(product);
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}

export async function getRelatedCatalogProducts(product: {
  id: string;
  category: string;
  collection?: string;
  team?: string;
  selection?: string;
}) {
  const [similar, sameCollection, alsoBought] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: 'active',
        id: { not: product.id },
        category: { slug: product.category },
      },
      include: productInclude,
      take: 4,
      orderBy: { isBestSeller: 'desc' },
    }),
    product.collection
      ? prisma.product.findMany({
          where: {
            status: 'active',
            id: { not: product.id },
            collection: { name: product.collection },
          },
          include: productInclude,
          take: 4,
          orderBy: { createdAt: 'desc' },
        })
      : Promise.resolve([]),
    prisma.product.findMany({
      where: {
        status: 'active',
        id: { not: product.id },
        isBestSeller: true,
      },
      include: productInclude,
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    similar: similar.map(toCatalogProduct),
    sameCollection: sameCollection.map(toCatalogProduct),
    alsoBought: alsoBought.map(toCatalogProduct),
  };
}
