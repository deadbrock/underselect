'use client';

import { useEffect, useState } from 'react';

import {
  CATALOG_CATEGORIES,
  CATALOG_SELECTIONS,
  CATALOG_TEAMS,
} from '@shared/constants/catalog.constants';
import { ADMIN_PRODUCT_COLLECTIONS } from '@shared/constants/product-admin.constants';

export interface ClassificationCategoryOption {
  slug: string;
  label: string;
}

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

function mergeUnique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function mergeCategoryOptions(
  fallback: ClassificationCategoryOption[],
  fromApi: ClassificationCategoryOption[],
): ClassificationCategoryOption[] {
  const map = new Map<string, ClassificationCategoryOption>();
  for (const item of fallback) map.set(item.slug, item);
  for (const item of fromApi) map.set(item.slug, item);
  return [...map.values()];
}

export function useClassificationOptions() {
  const [categories, setCategories] = useState<ClassificationCategoryOption[]>(
    CATALOG_CATEGORIES.map((item) => ({
      slug: item.slug,
      label: item.label,
    })),
  );
  const [collections, setCollections] = useState<string[]>([
    ...ADMIN_PRODUCT_COLLECTIONS,
  ]);
  const [teams, setTeams] = useState<string[]>([...CATALOG_TEAMS]);
  const [selections, setSelections] = useState<string[]>([
    ...CATALOG_SELECTIONS,
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      try {
        const [categoryData, collectionData, teamData, selectionData] =
          await Promise.all([
            fetchList<ApiListItem>('/api/admin/categories'),
            fetchList<ApiListItem>('/api/admin/collections'),
            fetchList<ApiListItem>('/api/admin/teams'),
            fetchList<ApiListItem>('/api/admin/selections'),
          ]);

        if (cancelled) return;

        const activeCategories = categoryData
          .filter((item) => item.status !== 'inactive')
          .map((item) => ({
            slug: item.slug,
            label: item.label ?? item.name ?? item.slug,
          }));

        const activeCollections = collectionData
          .filter((item) => item.status !== 'inactive')
          .map((item) => item.name ?? item.label ?? '')
          .filter(Boolean);

        const activeTeams = teamData
          .filter((item) => item.status !== 'inactive')
          .map((item) => item.name ?? item.label ?? '')
          .filter(Boolean);

        const activeSelections = selectionData
          .filter((item) => item.status !== 'inactive')
          .map((item) => item.name ?? item.label ?? '')
          .filter(Boolean);

        const fallbackCategories = CATALOG_CATEGORIES.map((item) => ({
          slug: item.slug,
          label: item.label,
        }));

        setCategories(
          mergeCategoryOptions(fallbackCategories, activeCategories),
        );
        setCollections(
          mergeUnique([...ADMIN_PRODUCT_COLLECTIONS, ...activeCollections]),
        );
        setTeams(mergeUnique([...CATALOG_TEAMS, ...activeTeams]));
        setSelections(
          mergeUnique([...CATALOG_SELECTIONS, ...activeSelections]),
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    categories,
    collections,
    teams,
    selections,
    isLoading,
  };
}
