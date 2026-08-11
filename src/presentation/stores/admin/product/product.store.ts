'use client';

import { create } from 'zustand';

import type {
  AdminProduct,
  AdminProductInput,
} from '@shared/types/product-admin.types';

import {
  createEmptyProductDefaults,
  generateSku,
  resolveLabels,
  slugify,
} from './product.utils';

interface ProductState {
  products: AdminProduct[];
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}

interface ProductActions {
  loadProducts: () => Promise<void>;
  getProductById: (id: string) => AdminProduct | undefined;
  getProductBySlug: (slug: string) => AdminProduct | undefined;
  fetchProductById: (id: string) => Promise<AdminProduct | undefined>;
  createProduct: (input: AdminProductInput) => Promise<AdminProduct>;
  updateProduct: (
    id: string,
    input: AdminProductInput,
  ) => Promise<AdminProduct>;
  duplicateProduct: (id: string) => Promise<AdminProduct | undefined>;
  archiveProduct: (id: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Erro ao comunicar com a API.');
  }
  return payload.data as T;
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  products: [],
  isLoading: false,
  isHydrated: false,
  error: null,

  loadProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/products', {
        cache: 'no-store',
      });
      const products = await parseApiResponse<AdminProduct[]>(response);
      set({ products, isLoading: false, isHydrated: true });
    } catch (error) {
      set({
        isLoading: false,
        isHydrated: true,
        error:
          error instanceof Error ? error.message : 'Erro ao carregar produtos.',
      });
    }
  },

  getProductById: (id) => get().products.find((product) => product.id === id),

  getProductBySlug: (slug) =>
    get().products.find((product) => product.slug === slug),

  fetchProductById: async (id) => {
    const cached = get().getProductById(id);
    if (cached) return cached;

    const response = await fetch(`/api/admin/products/${id}`, {
      cache: 'no-store',
    });
    const product = await parseApiResponse<AdminProduct>(response);
    set((state) => ({
      products: state.products.some((item) => item.id === product.id)
        ? state.products.map((item) =>
            item.id === product.id ? product : item,
          )
        : [product, ...state.products],
    }));
    return product;
  },

  createProduct: async (input) => {
    const normalized = normalizeInput(input);
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
    });
    const product = await parseApiResponse<AdminProduct>(response);
    set((state) => ({ products: [product, ...state.products] }));
    return product;
  },

  updateProduct: async (id, input) => {
    const normalized = normalizeInput(input);
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
    });
    const product = await parseApiResponse<AdminProduct>(response);
    set((state) => ({
      products: state.products.map((item) => (item.id === id ? product : item)),
    }));
    return product;
  },

  duplicateProduct: async (id) => {
    const original =
      get().getProductById(id) ?? (await get().fetchProductById(id));
    if (!original) return undefined;

    const copyName = `${original.name} (cópia)`;
    const {
      id: _id,
      categoryLabel: _cl,
      typeLabel: _tl,
      createdAt: _ca,
      updatedAt: _ua,
      discountPercent: _dp,
      ...rest
    } = original;

    return get().createProduct({
      ...createEmptyProductDefaults(),
      ...rest,
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

  archiveProduct: async (id) => {
    const product =
      get().getProductById(id) ?? (await get().fetchProductById(id));
    if (!product) return;

    const {
      id: _id,
      categoryLabel: _cl,
      typeLabel: _tl,
      createdAt: _ca,
      updatedAt: _ua,
      discountPercent: _dp,
      ...input
    } = product;

    await get().updateProduct(id, { ...input, status: 'archived' });
  },

  deleteProduct: async (id) => {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
    await parseApiResponse(response);
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    }));
  },
}));

export {
  createEmptyProductDefaults,
  productToFormValues,
} from './product.utils';

export { resolveLabels };
