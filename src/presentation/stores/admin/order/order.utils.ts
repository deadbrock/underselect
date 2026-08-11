import {
  ORDER_MOCK_USER,
  ORDER_PAGE_SIZE,
} from '@shared/constants/order-admin.constants';
import type {
  AdminOrder,
  AdminOrderTimelineEvent,
  OrderDashboardStats,
  OrderFilters,
  OrderHistoryEntry,
  OrderSortOption,
} from '@shared/types/order-admin.types';

export function buildInitialOrders(): AdminOrder[] {
  return [];
}

export function getOrderDashboardStats(
  orders: AdminOrder[],
): OrderDashboardStats {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  );

  return {
    ordersToday: todayOrders.length,
    pendingOrders: orders.filter(
      (o) => o.status === 'new' || o.status === 'payment_pending',
    ).length,
    paidOrders: orders.filter(
      (o) =>
        o.payment.status === 'approved' &&
        !['cancelled', 'returned'].includes(o.status),
    ).length,
    cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
    averageTicket:
      orders.length > 0
        ? orders.reduce((a, o) => a + o.total, 0) / orders.length
        : 0,
    revenueToday: todayOrders.reduce((a, o) => a + o.total, 0),
    inSeparation: orders.filter(
      (o) => o.status === 'separation' || o.status === 'packaging',
    ).length,
    shippedOrders: orders.filter(
      (o) => o.status === 'shipped' || o.status === 'in_transit',
    ).length,
    deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
  };
}

export function filterOrders(
  orders: AdminOrder[],
  filters: OrderFilters,
): AdminOrder[] {
  let result = orders;

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.number.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.cpf.includes(q) ||
        o.customer.phone.includes(q),
    );
  }
  if (filters.status !== 'all') {
    result = result.filter((o) => o.status === filters.status);
  }
  if (filters.paymentMethod !== 'all') {
    result = result.filter((o) => o.payment.method === filters.paymentMethod);
  }
  if (filters.paymentStatus !== 'all') {
    result = result.filter((o) => o.payment.status === filters.paymentStatus);
  }
  if (filters.shippingCarrier !== 'all') {
    result = result.filter(
      (o) => o.shippingInfo.carrier === filters.shippingCarrier,
    );
  }
  if (filters.coupon.trim()) {
    const c = filters.coupon.toLowerCase();
    result = result.filter((o) => o.couponCode?.toLowerCase().includes(c));
  }
  if (filters.influencer.trim()) {
    const inf = filters.influencer.toLowerCase();
    result = result.filter(
      (o) =>
        o.influencerCode?.toLowerCase().includes(inf) ||
        o.influencerName?.toLowerCase().includes(inf),
    );
  }
  if (filters.dateFrom) {
    result = result.filter(
      (o) => new Date(o.createdAt) >= new Date(filters.dateFrom!),
    );
  }
  if (filters.dateTo) {
    result = result.filter(
      (o) => new Date(o.createdAt) <= new Date(filters.dateTo!),
    );
  }
  if (filters.valueMin !== undefined) {
    result = result.filter((o) => o.total >= filters.valueMin!);
  }
  if (filters.valueMax !== undefined) {
    result = result.filter((o) => o.total <= filters.valueMax!);
  }

  return result;
}

export function sortOrders(
  orders: AdminOrder[],
  sort: OrderSortOption,
): AdminOrder[] {
  const sorted = [...orders];
  switch (sort) {
    case 'date-desc':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'date-asc':
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case 'value-desc':
      return sorted.sort((a, b) => b.total - a.total);
    case 'value-asc':
      return sorted.sort((a, b) => a.total - b.total);
    case 'number-desc':
      return sorted.sort((a, b) => b.number.localeCompare(a.number));
    case 'number-asc':
      return sorted.sort((a, b) => a.number.localeCompare(b.number));
    case 'customer-asc':
      return sorted.sort((a, b) =>
        a.customer.name.localeCompare(b.customer.name),
      );
    default:
      return sorted;
  }
}

export function createHistoryEntry(
  type: OrderHistoryEntry['type'],
  label: string,
  description: string,
  extra?: Partial<OrderHistoryEntry>,
): OrderHistoryEntry {
  return {
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    label,
    description,
    user: ORDER_MOCK_USER,
    createdAt: new Date().toISOString(),
    ...extra,
  };
}

export function createTimelineEvent(
  type: AdminOrderTimelineEvent['type'],
  label: string,
  description: string,
  completed = true,
): AdminOrderTimelineEvent {
  return {
    id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    label,
    description,
    user: ORDER_MOCK_USER,
    createdAt: new Date().toISOString(),
    completed,
  };
}

export function getOrdersChartData(orders: AdminOrder[]) {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const now = new Date();

  return days.map((label, i) => {
    const target = new Date(now);
    target.setDate(now.getDate() - (6 - i));

    return {
      label,
      value: orders.filter(
        (o) => new Date(o.createdAt).toDateString() === target.toDateString(),
      ).length,
    };
  });
}

export { ORDER_PAGE_SIZE };
