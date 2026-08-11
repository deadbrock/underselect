'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  DEFAULT_ADMIN_ACCESS_PROFILE,
  DEFAULT_ADMIN_STORE_SETTINGS,
  SETTINGS_STORAGE_KEY,
} from '@shared/constants/admin-settings.constants';
import type {
  AdminAccessProfile,
  AdminStoreSettings,
} from '@shared/types/admin-settings.types';

import {
  fetchStoreSettings,
  resetStoreSettingsApi,
  saveStoreSettings,
} from './settings.api';
import { mergeAccessProfile, mergeStoreSettings } from './settings.utils';

interface SettingsState {
  profile: AdminAccessProfile;
  settings: AdminStoreSettings;
  settingsLoaded: boolean;
  settingsLoading: boolean;
}

interface SettingsActions {
  updateProfile: (
    input: Pick<AdminAccessProfile, 'name' | 'email' | 'phone'>,
  ) => void;
  syncProfileFromSession: (input: AdminAccessProfile) => void;
  loadSettings: () => Promise<void>;
  saveSettings: (input: AdminStoreSettings) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_ADMIN_ACCESS_PROFILE,
      settings: DEFAULT_ADMIN_STORE_SETTINGS,
      settingsLoaded: false,
      settingsLoading: false,

      updateProfile: (input) =>
        set({
          profile: mergeAccessProfile(input),
        }),

      syncProfileFromSession: (profile) =>
        set({
          profile: mergeAccessProfile(profile),
        }),

      loadSettings: async () => {
        if (get().settingsLoading) return;

        set({ settingsLoading: true });
        try {
          const settings = await fetchStoreSettings();
          set({
            settings: mergeStoreSettings(settings),
            settingsLoaded: true,
          });
        } finally {
          set({ settingsLoading: false });
        }
      },

      saveSettings: async (input) => {
        const settings = await saveStoreSettings(input);
        set({
          settings: mergeStoreSettings(settings),
          settingsLoaded: true,
        });
      },

      resetSettings: async () => {
        const settings = await resetStoreSettingsApi();
        set({
          settings: mergeStoreSettings(settings),
          settingsLoaded: true,
        });
      },
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<SettingsState> | undefined;
        return {
          ...current,
          profile: mergeAccessProfile(saved?.profile),
        };
      },
    },
  ),
);
