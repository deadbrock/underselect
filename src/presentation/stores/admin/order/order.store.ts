'use client';

import { create } from 'zustand';

import type {
  AdminOrder,
  AdminOrderStatus,
  OrderNoteInput,
  OrderStatusChangeInput,
} from '@shared/types/order-admin.types';

import { fetchAdminOrderByIdApi, fetchAdminOrdersApi } from './order.api';
import {
  buildInitialOrders,
  createHistoryEntry,
  createTimelineEvent,
} from './order.utils';

interface OrderState {
  orders: AdminOrder[];
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}

interface OrderActions {
  loadOrders: (force?: boolean) => Promise<void>;
  fetchOrderById: (id: string) => Promise<AdminOrder | undefined>;
  getOrderById: (id: string) => AdminOrder | undefined;
  updateOrderStatus: (input: OrderStatusChangeInput) => void;
  addInternalNote: (input: OrderNoteInput) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  duplicateOrder: (orderId: string) => AdminOrder | undefined;
}

export type OrderStore = OrderState & OrderActions;

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: buildInitialOrders(),
  isLoading: false,
  isHydrated: false,
  error: null,

  loadOrders: async (force = false) => {
    const state = get();
    if (!force && state.isHydrated && state.orders.length > 0) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { records } = await fetchAdminOrdersApi({ limit: 200 });
      set({ orders: records, isLoading: false, isHydrated: true });
    } catch (error) {
      set({
        isLoading: false,
        isHydrated: true,
        error:
          error instanceof Error ? error.message : 'Erro ao carregar pedidos.',
      });
    }
  },

  fetchOrderById: async (id) => {
    const cached = get().getOrderById(id);
    if (cached) return cached;

    try {
      const order = await fetchAdminOrderByIdApi(id);
      set((state) => ({
        orders: state.orders.some((entry) => entry.id === order.id)
          ? state.orders.map((entry) => (entry.id === order.id ? order : entry))
          : [order, ...state.orders],
      }));
      return order;
    } catch {
      return undefined;
    }
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),

  updateOrderStatus: (input) => {
    const order = get().getOrderById(input.orderId);
    if (!order) return;

    const now = new Date().toISOString();
    const historyEntry = createHistoryEntry(
      'status',
      'Status alterado',
      input.note ?? `Status alterado para ${input.status.replace(/_/g, ' ')}.`,
      {
        previousStatus: order.status,
        newStatus: input.status as AdminOrderStatus,
      },
    );

    const timelineEvent = createTimelineEvent(
      'status',
      historyEntry.label,
      historyEntry.description,
    );

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === input.orderId
          ? {
              ...o,
              status: input.status as AdminOrderStatus,
              updatedAt: now,
              history: [historyEntry, ...o.history],
              timeline: [...o.timeline, timelineEvent],
            }
          : o,
      ),
    }));
  },

  addInternalNote: (input) => {
    const now = new Date().toISOString();
    const historyEntry = createHistoryEntry(
      'note',
      'Observação interna',
      input.note,
    );

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === input.orderId
          ? {
              ...o,
              updatedAt: now,
              internalNotes: [input.note, ...o.internalNotes],
              history: [historyEntry, ...o.history],
            }
          : o,
      ),
    }));
  },

  cancelOrder: (orderId, reason) => {
    get().updateOrderStatus({
      orderId,
      status: 'cancelled',
      note: reason ?? 'Pedido cancelado pelo administrador.',
    });

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              payment: { ...o.payment, status: 'failed' as const },
            }
          : o,
      ),
    }));
  },

  duplicateOrder: (orderId) => {
    const source = get().getOrderById(orderId);
    if (!source) return undefined;

    const now = new Date().toISOString();
    const newId = `ord-dup-${Date.now()}`;
    const duplicate: AdminOrder = {
      ...source,
      id: newId,
      number: `US-DUP${Date.now().toString().slice(-6)}`,
      status: 'new',
      createdAt: now,
      updatedAt: now,
      payment: { ...source.payment, status: 'pending', paidAt: undefined },
      shippingInfo: {
        ...source.shippingInfo,
        status: 'pending',
        trackingCode: undefined,
      },
      timeline: [
        createTimelineEvent(
          'created',
          'Pedido duplicado',
          `Duplicado a partir de ${source.number}.`,
        ),
      ],
      history: [
        createHistoryEntry(
          'created',
          'Pedido duplicado',
          `Duplicado a partir de ${source.number}.`,
        ),
      ],
      internalNotes: [],
    };

    set((state) => ({ orders: [duplicate, ...state.orders] }));
    return duplicate;
  },
}));
