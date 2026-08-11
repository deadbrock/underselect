'use client';

import { useEffect } from 'react';

import {
  useClassificationStore,
  type ClassificationCategoryOption,
} from '@presentation/stores/admin/classification.store';

export type { ClassificationCategoryOption };

export function useClassificationOptions() {
  const categories = useClassificationStore((s) => s.categories);
  const collections = useClassificationStore((s) => s.collections);
  const teams = useClassificationStore((s) => s.teams);
  const selections = useClassificationStore((s) => s.selections);
  const isLoading = useClassificationStore((s) => s.isLoading);
  const loadOptions = useClassificationStore((s) => s.loadOptions);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  return {
    categories,
    collections,
    teams,
    selections,
    isLoading,
  };
}
