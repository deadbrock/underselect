'use client';

import { createContext, useContext, useMemo } from 'react';

import { DEFAULT_ADMIN_STORE_SETTINGS } from '@shared/constants/admin-settings.constants';
import type { AdminStoreSettings } from '@shared/types/admin-settings.types';

const StoreSettingsContext = createContext<AdminStoreSettings>(
  DEFAULT_ADMIN_STORE_SETTINGS,
);

export interface StoreSettingsProviderProps {
  settings: AdminStoreSettings;
  children: React.ReactNode;
}

export function StoreSettingsProvider({
  settings,
  children,
}: StoreSettingsProviderProps) {
  const value = useMemo(
    () => ({ ...DEFAULT_ADMIN_STORE_SETTINGS, ...settings }),
    [settings],
  );

  return (
    <StoreSettingsContext.Provider value={value}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
