'use client';

import { memo, useEffect } from 'react';

import { fetchAdminSessionApi } from '@presentation/stores/admin/auth';
import { useSettingsStore } from '@presentation/stores/admin/settings';
import { getAvatarInitials } from '@presentation/stores/admin/settings/settings.utils';

export const AdminAuthHydrator = memo(function AdminAuthHydrator() {
  const syncProfileFromSession = useSettingsStore(
    (s) => s.syncProfileFromSession,
  );

  useEffect(() => {
    void (async () => {
      try {
        const { user } = await fetchAdminSessionApi();
        syncProfileFromSession({
          name: user.name,
          email: user.email,
          phone: user.phone ?? '',
          role: user.role,
          avatarInitials: getAvatarInitials(user.name),
        });
      } catch {
        // Middleware already redirects unauthenticated users.
      }
    })();
  }, [syncProfileFromSession]);

  return null;
});
