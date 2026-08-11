'use client';

import { create } from 'zustand';

export interface ClassificationCategoryOption {
  slug: string;
  label: string;
}

interface ClassificationState {
  categories: ClassificationCategoryOption[];
  collections: string[];
  teams: string[];
  selections: string[];
  isLoading: boolean;
  isHydrated: boolean;
  loadedAt: number | null;
}

interface ClassificationActions {
  loadOptions: (force?: boolean) => Promise<void>;
  invalidate: () => void;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

type ClassificationStore = ClassificationState & ClassificationActions;

interface ApiListItem {
  slug: string;
  label?: string;
  name?: string;
  status?: string;
}

async function fetchList<T>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = await response.json();
  if (!response.ok || !payload.success || !Array.isArray(payload.data)) {
    return [];
  }
  return payload.data as T[];
}

export const useClassificationStore = create<ClassificationStore>(
  (set, get) => ({
    categories: [],
    collections: [],
    teams: [],
    selections: [],
    isLoading: false,
    isHydrated: false,
    loadedAt: null,

    loadOptions: async (force = false) => {
      const state = get();
      const isFresh =
        state.loadedAt != null && Date.now() - state.loadedAt < CACHE_TTL_MS;

      if (!force && state.isHydrated && isFresh) return;

      set({ isLoading: true });

      try {
        const [categoryData, collectionData, teamData, selectionData] =
          await Promise.all([
            fetchList<ApiListItem>('/api/admin/categories'),
            fetchList<ApiListItem>('/api/admin/collections'),
            fetchList<ApiListItem>('/api/admin/teams'),
            fetchList<ApiListItem>('/api/admin/selections'),
          ]);

        set({
          categories: categoryData
            .filter((item) => item.status !== 'inactive')
            .map((item) => ({
              slug: item.slug,
              label: item.label ?? item.name ?? item.slug,
            })),
          collections: collectionData
            .filter((item) => item.status !== 'inactive')
            .map((item) => item.name ?? item.label ?? '')
            .filter(Boolean),
          teams: teamData
            .filter((item) => item.status !== 'inactive')
            .map((item) => item.name ?? item.label ?? '')
            .filter(Boolean),
          selections: selectionData
            .filter((item) => item.status !== 'inactive')
            .map((item) => item.name ?? item.label ?? '')
            .filter(Boolean),
          isLoading: false,
          isHydrated: true,
          loadedAt: Date.now(),
        });
      } catch {
        set({ isLoading: false, isHydrated: true });
      }
    },

    invalidate: () => {
      set({ loadedAt: null, isHydrated: false });
    },
  }),
);
