'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { ADMIN_STORAGE_KEY } from '@shared/constants/admin.constants';
import { MOCK_ADMIN_NOTIFICATIONS } from '@shared/data/admin.data';

interface AdminState {
  notifications: typeof MOCK_ADMIN_NOTIFICATIONS;
  isGlobalLoading: boolean;
  globalSearchQuery: string;
}

interface AdminActions {
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setGlobalLoading: (loading: boolean) => void;
  setGlobalSearchQuery: (query: string) => void;
}

export type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      notifications: MOCK_ADMIN_NOTIFICATIONS,
      isGlobalLoading: false,
      globalSearchQuery: '',

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
          })),
        })),

      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

      setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
    }),
    {
      name: ADMIN_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notifications: state.notifications }),
    },
  ),
);
