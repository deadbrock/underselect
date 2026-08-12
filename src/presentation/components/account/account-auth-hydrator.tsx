'use client';

import { memo, useEffect } from 'react';

import { fetchCustomerSessionApi } from '@presentation/stores/account/auth.api';
import { useAccountStore } from '@presentation/stores/account';

export const AccountAuthHydrator = memo(function AccountAuthHydrator() {
  const syncUserFromSession = useAccountStore((s) => s.syncUserFromSession);

  useEffect(() => {
    void (async () => {
      try {
        const { user } = await fetchCustomerSessionApi();
        syncUserFromSession({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          cpf: user.cpf,
          phone: user.phone,
          birthDate: '',
          marketingEmail: false,
          marketingSms: false,
          newsletter: false,
        });
      } catch {
        // Middleware redirects unauthenticated users.
      }
    })();
  }, [syncUserFromSession]);

  return null;
});
