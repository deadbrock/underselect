'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { CUSTOMER_STORAGE_KEY } from '@shared/constants/customer-admin.constants';
import type {
  AdminCustomer,
  AdminCustomerActivity,
  AdminCustomerCouponUsage,
  CustomerNoteInput,
} from '@shared/types/customer-admin.types';
import type { AccountAddress } from '@shared/types/account.types';

import {
  buildCustomerActivities,
  buildCustomerCouponUsages,
  buildInitialCustomers,
} from './customer.utils';

interface CustomerState {
  customers: AdminCustomer[];
  couponUsages: AdminCustomerCouponUsage[];
  initialized: boolean;
}

interface CustomerActions {
  getCustomerById: (id: string) => AdminCustomer | undefined;
  getCouponUsagesByCustomer: (id: string) => AdminCustomerCouponUsage[];
  getActivitiesByCustomer: (id: string) => AdminCustomerActivity[];
  blockCustomer: (id: string) => void;
  unblockCustomer: (id: string) => void;
  addInternalNote: (input: CustomerNoteInput) => void;
  addAddress: (customerId: string, address: Omit<AccountAddress, 'id'>) => void;
  removeAddress: (customerId: string, addressId: string) => void;
}

export type CustomerStore = CustomerState & CustomerActions;

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: buildInitialCustomers(),
      couponUsages: buildCustomerCouponUsages(),
      initialized: true,

      getCustomerById: (id) => get().customers.find((c) => c.id === id),

      getCouponUsagesByCustomer: (id) =>
        get().couponUsages.filter((u) => u.customerId === id),

      getActivitiesByCustomer: (id) => {
        const customer = get().getCustomerById(id);
        if (!customer) return [];
        return buildCustomerActivities(customer);
      },

      blockCustomer: (id) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id
              ? { ...c, status: 'blocked' as const, updatedAt: now() }
              : c,
          ),
        }));
      },

      unblockCustomer: (id) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id
              ? { ...c, status: 'active' as const, updatedAt: now() }
              : c,
          ),
        }));
      },

      addInternalNote: (input) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === input.customerId
              ? {
                  ...c,
                  internalNotes: [input.note, ...c.internalNotes],
                  updatedAt: now(),
                }
              : c,
          ),
        }));
      },

      addAddress: (customerId, address) => {
        const newAddress: AccountAddress = {
          ...address,
          id: `addr-${Date.now()}`,
        };
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === customerId
              ? {
                  ...c,
                  addresses: [...c.addresses, newAddress],
                  updatedAt: now(),
                }
              : c,
          ),
        }));
      },

      removeAddress: (customerId, addressId) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === customerId
              ? {
                  ...c,
                  addresses: c.addresses.filter((a) => a.id !== addressId),
                  updatedAt: now(),
                }
              : c,
          ),
        }));
      },
    }),
    {
      name: CUSTOMER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customers: state.customers,
        couponUsages: state.couponUsages,
        initialized: state.initialized,
      }),
    },
  ),
);

function now() {
  return new Date().toISOString();
}
