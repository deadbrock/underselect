'use client';

import { memo } from 'react';

import { Spinner } from '@presentation/components/feedback';
import { useAdminStore } from '@presentation/stores/admin';
import { cn } from '@shared/utils/cn';

export const AdminGlobalLoader = memo(function AdminGlobalLoader() {
  const isLoading = useAdminStore((s) => s.isGlobalLoading);

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'bg-background/60 fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm',
      )}
      role="status"
      aria-live="polite"
      aria-label="Carregando"
    >
      <Spinner className="size-8" />
    </div>
  );
});
