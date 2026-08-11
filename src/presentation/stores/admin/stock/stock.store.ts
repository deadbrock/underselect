'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { useProductStore } from '@presentation/stores/admin/product';
import { STOCK_STORAGE_KEY } from '@shared/constants/stock.constants';
import type { AdminProduct } from '@shared/types/product-admin.types';
import type {
  InventoryItem,
  StockAdjustmentInput,
  StockEntryInput,
  StockExitInput,
  StockItem,
  StockMovement,
} from '@shared/types/stock.types';

import {
  buildInitialInventory,
  buildInitialMovements,
  buildStockItemsFromProducts,
  createMovement,
  generateAlerts,
  mergeInventoryFromItems,
} from './stock.utils';

interface StockState {
  stockItems: StockItem[];
  movements: StockMovement[];
  inventory: InventoryItem[];
  initialized: boolean;
}

interface StockActions {
  syncFromProducts: (products: AdminProduct[]) => void;
  getStockItemById: (id: string) => StockItem | undefined;
  registerEntry: (input: StockEntryInput) => Promise<void>;
  registerExit: (input: StockExitInput) => Promise<void>;
  registerAdjustment: (input: StockAdjustmentInput) => Promise<void>;
  updateInventoryCount: (
    inventoryId: string,
    counted: number,
    notes?: string,
  ) => void;
  applyInventoryAdjustment: (inventoryId: string) => Promise<void>;
  getAlerts: () => ReturnType<typeof generateAlerts>;
}

export type StockStore = StockState & StockActions;

async function persistStockQuantity(item: StockItem, stock: number) {
  await useProductStore.getState().patchProductStock(item.productId, {
    variationId: item.variationId,
    stock,
  });
}

function appendMovement(
  set: (
    partial: Partial<StockState> | ((state: StockState) => Partial<StockState>),
  ) => void,
  movement: StockMovement,
) {
  set((state) => ({
    movements: [movement, ...state.movements],
  }));
}

export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      stockItems: [],
      movements: [],
      inventory: [],
      initialized: false,

      syncFromProducts: (products) => {
        const items = buildStockItemsFromProducts(products);

        set((state) => ({
          stockItems: items,
          movements: state.initialized
            ? state.movements
            : buildInitialMovements(items),
          inventory: state.initialized
            ? mergeInventoryFromItems(items, state.inventory)
            : buildInitialInventory(items),
          initialized: true,
        }));
      },

      getStockItemById: (id) => get().stockItems.find((i) => i.id === id),

      registerEntry: async (input) => {
        const item = get().getStockItemById(input.stockItemId);
        if (!item) {
          throw new Error('Item de estoque não encontrado.');
        }

        const previous = item.quantity;
        const current = previous + input.quantity;

        await persistStockQuantity(item, current);

        appendMovement(
          set,
          createMovement(
            item,
            'entry',
            input.quantity,
            previous,
            current,
            input.reason,
            { notes: input.notes, supplier: input.supplier },
          ),
        );
      },

      registerExit: async (input) => {
        const item = get().getStockItemById(input.stockItemId);
        if (!item) {
          throw new Error('Item de estoque não encontrado.');
        }

        const previous = item.quantity;
        const current = Math.max(0, previous - input.quantity);

        await persistStockQuantity(item, current);

        appendMovement(
          set,
          createMovement(
            item,
            'exit',
            input.quantity,
            previous,
            current,
            input.reason,
            { notes: input.notes, destination: input.destination },
          ),
        );
      },

      registerAdjustment: async (input) => {
        const item = get().getStockItemById(input.stockItemId);
        if (!item) {
          throw new Error('Item de estoque não encontrado.');
        }

        const previous = item.quantity;
        let current = previous;

        if (input.mode === 'add') current = previous + input.quantity;
        else if (input.mode === 'remove')
          current = Math.max(0, previous - input.quantity);
        else current = input.quantity;

        const delta = Math.abs(current - previous);

        await persistStockQuantity(item, current);

        appendMovement(
          set,
          createMovement(
            item,
            input.reason === 'Correção inventário' ? 'inventory' : 'adjustment',
            delta,
            previous,
            current,
            input.reason,
            { notes: input.notes },
          ),
        );
      },

      updateInventoryCount: (inventoryId, counted, notes) => {
        set((state) => ({
          inventory: state.inventory.map((inv) => {
            if (inv.id !== inventoryId) return inv;
            const stockItem = state.stockItems.find(
              (s) => s.id === inv.stockItemId,
            );
            const systemQty = stockItem?.quantity ?? inv.systemQuantity;
            return {
              ...inv,
              countedQuantity: counted,
              difference: counted - systemQty,
              status: 'counted' as const,
              notes,
            };
          }),
        }));
      },

      applyInventoryAdjustment: async (inventoryId) => {
        const state = get();
        const inv = state.inventory.find((i) => i.id === inventoryId);
        if (!inv || inv.countedQuantity === undefined) return;

        await get().registerAdjustment({
          stockItemId: inv.stockItemId,
          mode: 'set',
          quantity: inv.countedQuantity,
          reason: 'Correção inventário',
          notes: inv.notes,
        });

        set((s) => ({
          inventory: s.inventory.map((i) =>
            i.id === inventoryId ? { ...i, status: 'adjusted' as const } : i,
          ),
        }));
      },

      getAlerts: () => generateAlerts(get().stockItems),
    }),
    {
      name: STOCK_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        movements: state.movements,
        inventory: state.inventory,
        initialized: state.initialized,
      }),
    },
  ),
);
