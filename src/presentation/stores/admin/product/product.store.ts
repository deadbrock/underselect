'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { PRODUCT_STORAGE_KEY } from '@shared/constants/product-admin.constants';
import type {
  AdminProduct,
  AdminProductInput,
} from '@shared/types/product-admin.types';

import {
  createEmptyProductDefaults,
  generateSku,
  resolveLabels,
  seedAdminProducts,
  slugify,
} from './product.utils';

interface ProductState {
  products: AdminProduct[];
}

interface ProductActions {
  getProductById: (id: string) => AdminProduct | undefined;
  getProductBySlug: (slug: string) => AdminProduct | undefined;
  createProduct: (input: AdminProductInput) => AdminProduct;
  updateProduct: (id: string, input: AdminProductInput) => void;
  duplicateProduct: (id: string) => AdminProduct | undefined;
  archiveProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
}

export type ProductStore = ProductState & ProductActions;

function normalizeInput(input: AdminProductInput): AdminProductInput {
  return {
    ...input,
    slug: input.slug || slugify(input.name),
    team: input.team?.trim() ? input.team : undefined,
    selection: input.selection?.trim() ? input.selection : undefined,
    compareAtPrice: input.compareAtPrice || undefined,
    cost: input.cost || undefined,
    seo: {
      ...input.seo,
      slug: input.seo.slug || slugify(input.name),
      metaTitle: input.seo.metaTitle || input.name,
    },
  };
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: seedAdminProducts(),

      getProductById: (id) => get().products.find((p) => p.id === id),

      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),

      createProduct: (input) => {
        const normalized = normalizeInput(input);
        const labels = resolveLabels(normalized);
        const now = new Date().toISOString();
        const product: AdminProduct = {
          ...normalized,
          ...labels,
          id: `prod-${Date.now()}`,
          sku: normalized.sku || generateSku(),
          createdAt: now,
          updatedAt: now,
          discountPercent:
            normalized.compareAtPrice &&
            normalized.compareAtPrice > normalized.price
              ? Math.round(
                  ((normalized.compareAtPrice - normalized.price) /
                    normalized.compareAtPrice) *
                    100,
                )
              : undefined,
        };
        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },

      updateProduct: (id, input) => {
        const normalized = normalizeInput(input);
        const labels = resolveLabels(normalized);
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...normalized,
                  ...labels,
                  updatedAt: new Date().toISOString(),
                  discountPercent:
                    normalized.compareAtPrice &&
                    normalized.compareAtPrice > normalized.price
                      ? Math.round(
                          ((normalized.compareAtPrice - normalized.price) /
                            normalized.compareAtPrice) *
                            100,
                        )
                      : undefined,
                }
              : p,
          ),
        }));
      },

      duplicateProduct: (id) => {
        const original = get().getProductById(id);
        if (!original) return undefined;
        const copyName = `${original.name} (cópia)`;
        return get().createProduct({
          ...createEmptyProductDefaults(),
          ...productToInput(original),
          name: copyName,
          slug: slugify(copyName),
          sku: generateSku(),
          status: 'draft',
          seo: {
            ...original.seo,
            slug: slugify(copyName),
            metaTitle: `${copyName} | UNDER SELECT`,
          },
        });
      },

      archiveProduct: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'archived',
                  updatedAt: new Date().toISOString(),
                }
              : p,
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: PRODUCT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

function productToInput(product: AdminProduct): AdminProductInput {
  const {
    id: _id,
    categoryLabel: _cl,
    typeLabel: _tl,
    createdAt: _ca,
    updatedAt: _ua,
    discountPercent: _dp,
    ...input
  } = product;
  return input;
}

export {
  createEmptyProductDefaults,
  productToFormValues,
} from './product.utils';
