'use client';

import { useCallback } from 'react';

import { toast } from '@presentation/hooks';
import { adminLogoutApi } from '@presentation/stores/admin/auth';

export function useAdminLogout() {
  return useCallback(async () => {
    try {
      await adminLogoutApi();
      toast.success('Você saiu do painel.');
      window.location.assign('/admin/login');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Não foi possível sair.',
      );
    }
  }, []);
}
