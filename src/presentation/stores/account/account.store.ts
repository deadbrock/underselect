'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { ACCOUNT_STORAGE_KEY } from '@shared/constants/account.constants';
import {
  MOCK_ACCOUNT_ADDRESSES,
  MOCK_ACCOUNT_SETTINGS,
  MOCK_ACCOUNT_USER,
  MOCK_FAVORITE_IDS,
  MOCK_WISHLIST_IDS,
} from '@shared/mocks/account.data';
import type {
  AccountAddress,
  AccountAddressInput,
  AccountProfileInput,
  AccountSettings,
  AccountUser,
} from '@shared/types/account.types';

interface AccountState {
  user: AccountUser;
  addresses: AccountAddress[];
  settings: AccountSettings;
  favoriteIds: string[];
  wishlistIds: string[];
}

interface AccountActions {
  updateProfile: (data: AccountProfileInput) => void;
  addAddress: (input: AccountAddressInput) => void;
  updateAddress: (id: string, input: AccountAddressInput) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updateSettings: (settings: AccountSettings) => void;
  toggleFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  removeWishlist: (productId: string) => void;
  logout: () => void;
}

export type AccountStore = AccountState & AccountActions;

function createAddress(input: AccountAddressInput): AccountAddress {
  return {
    id: `addr-${Date.now()}`,
    label: input.label,
    cep: input.cep.replace(/\D/g, ''),
    street: input.street,
    number: input.number,
    complement: input.complement,
    neighborhood: input.neighborhood,
    city: input.city,
    state: input.state.toUpperCase(),
    reference: input.reference,
    isDefault: input.isDefault ?? false,
  };
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      user: MOCK_ACCOUNT_USER,
      addresses: MOCK_ACCOUNT_ADDRESSES,
      settings: MOCK_ACCOUNT_SETTINGS,
      favoriteIds: MOCK_FAVORITE_IDS,
      wishlistIds: MOCK_WISHLIST_IDS,

      updateProfile: (data) => {
        set({
          user: {
            ...get().user,
            ...data,
          },
        });
      },

      addAddress: (input) => {
        const address = createAddress(input);
        set((state) => {
          const addresses = input.isDefault
            ? state.addresses.map((a) => ({ ...a, isDefault: false }))
            : state.addresses;
          return { addresses: [...addresses, address] };
        });
      },

      updateAddress: (id, input) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id
              ? {
                  ...a,
                  ...input,
                  cep: input.cep.replace(/\D/g, ''),
                  state: input.state.toUpperCase(),
                }
              : input.isDefault
                ? { ...a, isDefault: false }
                : a,
          ),
        }));
        if (input.isDefault) get().setDefaultAddress(id);
      },

      removeAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }));
      },

      updateSettings: (settings) => set({ settings }),

      toggleFavorite: (productId) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(productId)
            ? state.favoriteIds.filter((id) => id !== productId)
            : [...state.favoriteIds, productId],
        }));
      },

      removeFavorite: (productId) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== productId),
        }));
      },

      toggleWishlist: (productId) => {
        set((state) => ({
          wishlistIds: state.wishlistIds.includes(productId)
            ? state.wishlistIds.filter((id) => id !== productId)
            : [...state.wishlistIds, productId],
        }));
      },

      removeWishlist: (productId) => {
        set((state) => ({
          wishlistIds: state.wishlistIds.filter((id) => id !== productId),
        }));
      },

      logout: () => {
        // Estrutura preparada para autenticação / JWT
      },
    }),
    {
      name: ACCOUNT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
