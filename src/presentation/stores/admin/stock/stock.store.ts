'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  resolveStockStatus,
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
  registerEntry: (input: StockEntryInput) => void;
  registerExit: (input: StockExitInput) => void;
  registerAdjustment: (input: StockAdjustmentInput) => void;
  updateInventoryCount: (
    inventoryId: string,
    counted: number,
    notes?: string,
  ) => void;
  applyInventoryAdjustment: (inventoryId: string) => void;
  getAlerts: () => ReturnType<typeof generateAlerts>;
}

export type StockStore = StockState & StockActions;

function updateItemQuantity(
  items: StockItem[],
  stockItemId: string,
  newQty: number,
): StockItem[] {
  const now = new Date().toISOString();
  return items.map((item) =>
    item.id === stockItemId
      ? {
          ...item,
          quantity: newQty,
          status: resolveStockStatus(newQty, item.minQuantity),
          lastUpdated: now,
        }
      : item,
  );
}

export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      stockItems: [],
      movements: [],
      inventory: [],
      initialized: false,

      syncFromProducts: (products) => {
        const state = get();
        if (state.initialized && state.stockItems.length > 0) return;

        const items = buildStockItemsFromProducts(products);
        const movements = buildInitialMovements(items);
        const inventory = buildInitialInventory(items);

        set({
          stockItems: items,
          movements,
          inventory,
          initialized: true,
        });
      },

      getStockItemById: (id) => get().stockItems.find((i) => i.id === id),

      registerEntry: (input) => {
        const item = get().getStockItemById(input.stockItemId);
        if (!item) return;

        const previous = item.quantity;
        const current = previous + input.quantity;
        const movement = createMovement(
          item,
          'entry',
          input.quantity,
          previous,
          current,
          input.reason,
          { notes: input.notes, supplier: input.supplier },
        );

        set((state) => ({
          stockItems: updateItemQuantity(state.stockItems, item.id, current),
          movements: [movement, ...state.movements],
        }));
      },

      registerExit: (input) => {
        const item = get().getStockItemById(input.stockItemId);
        if (!item) return;

        const previous = item.quantity;
        const current = Math.max(0, previous - input.quantity);
        const movement = createMovement(
          item,
          'exit',
          input.quantity,
          previous,
          current,
          input.reason,
          { notes: input.notes, destination: input.destination },
        );

        set((state) => ({
          stockItems: updateItemQuantity(state.stockItems, item.id, current),
          movements: [movement, ...state.movements],
        }));
      },

      registerAdjustment: (input) => {
        const item = get().getStockItemById(input.stockItemId);
        if (!item) return;

        const previous = item.quantity;
        let current = previous;
        let delta = input.quantity;

        if (input.mode === 'add') current = previous + input.quantity;
        else if (input.mode === 'remove')
          current = Math.max(0, previous - input.quantity);
        else current = input.quantity;

        delta = Math.abs(current - previous);

        const movement = createMovement(
          item,
          'adjustment',
          delta,
          previous,
          current,
          input.reason,
          { notes: input.notes },
        );

        set((state) => ({
          stockItems: updateItemQuantity(state.stockItems, item.id, current),
          movements: [movement, ...state.movements],
        }));
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

      applyInventoryAdjustment: (inventoryId) => {
        const state = get();
        const inv = state.inventory.find((i) => i.id === inventoryId);
        if (!inv || inv.countedQuantity === undefined) return;

        get().registerAdjustment({
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
        stockItems: state.stockItems,
        movements: state.movements,
        inventory: state.inventory,
        initialized: state.initialized,
      }),
    },
  ),
);
