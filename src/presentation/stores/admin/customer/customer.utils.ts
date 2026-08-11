import { CUSTOMER_PAGE_SIZE } from '@shared/constants/customer-admin.constants';
import type {
  AdminCustomer,
  AdminCustomerActivity,
  AdminCustomerCouponUsage,
  CustomerDashboardStats,
  CustomerFilters,
  CustomerSortOption,
} from '@shared/types/customer-admin.types';

export function buildInitialCustomers(): AdminCustomer[] {
  return [];
}

export function buildCustomerCouponUsages(): AdminCustomerCouponUsage[] {
  return [];
}

export function buildCustomerActivities(
  customer: AdminCustomer,
): AdminCustomerActivity[] {
  const activities: AdminCustomerActivity[] = [
    {
      id: `act-${customer.id}-reg`,
      customerId: customer.id,
      type: 'registered',
      label: 'Cadastro realizado',
      description: 'Cliente criou conta na UNDER SELECT.',
      createdAt: customer.createdAt,
    },
  ];

  if (customer.firstPurchaseAt) {
    activities.push({
      id: `act-${customer.id}-first`,
      customerId: customer.id,
      type: 'first_purchase',
      label: 'Primeira compra',
      description: 'Primeiro pedido confirmado.',
      createdAt: customer.firstPurchaseAt,
    });
  }

  if (customer.lastPurchaseAt && customer.orderCount > 1) {
    activities.push({
      id: `act-${customer.id}-last`,
      customerId: customer.id,
      type: 'purchase',
      label: 'Nova compra',
      description: `Total de ${customer.orderCount} pedidos.`,
      createdAt: customer.lastPurchaseAt,
    });
  }

  customer.internalNotes.forEach((note, i) => {
    activities.push({
      id: `act-${customer.id}-note-${i}`,
      customerId: customer.id,
      type: 'note',
      label: 'Observação interna',
      description: note,
      createdAt: new Date().toISOString(),
    });
  });

  return activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getCustomerDashboardStats(
  customers: AdminCustomer[],
): CustomerDashboardStats {
  const thirtyDaysAgo = Date.now() - 30 * 86400000;
  const newCustomers = customers.filter(
    (c) => new Date(c.createdAt).getTime() >= thirtyDaysAgo,
  ).length;
  const recurring = customers.filter(
    (c) => c.type === 'recurring' || c.type === 'vip',
  ).length;
  const inactive = customers.filter((c) => c.type === 'inactive').length;
  const withOrders = customers.filter((c) => c.orderCount > 0);
  const purchasedInPeriod = customers.filter(
    (c) =>
      c.lastPurchaseAt && new Date(c.lastPurchaseAt).getTime() >= thirtyDaysAgo,
  ).length;
  const totalRevenue = customers.reduce((a, c) => a + c.totalSpent, 0);
  const avgTicket =
    withOrders.length > 0
      ? withOrders.reduce((a, c) => a + c.averageTicket, 0) / withOrders.length
      : 0;
  const recurrenceRate =
    customers.length > 0 ? Math.round((recurring / customers.length) * 100) : 0;

  return {
    totalCustomers: customers.length,
    newCustomers,
    recurringCustomers: recurring,
    inactiveCustomers: inactive,
    averageTicket: avgTicket,
    purchasedInPeriod,
    recurrenceRate,
    totalRevenue,
  };
}

export function filterCustomers(
  customers: AdminCustomer[],
  filters: CustomerFilters,
  orderNumbersByCustomer?: Map<string, string[]>,
): AdminCustomer[] {
  let result = customers;

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter((c) => {
      const orderMatch = orderNumbersByCustomer
        ?.get(c.id)
        ?.some((n) => n.toLowerCase().includes(q));
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.cpf.includes(q.replace(/\D/g, '')) ||
        c.phone.includes(q.replace(/\D/g, '')) ||
        orderMatch
      );
    });
  }
  if (filters.type !== 'all') {
    result = result.filter((c) => c.type === filters.type);
  }
  if (filters.status !== 'all') {
    result = result.filter((c) => c.status === filters.status);
  }
  if (filters.segment !== 'all') {
    result = result.filter((c) =>
      c.segments.includes(filters.segment as AdminCustomer['segments'][0]),
    );
  }
  if (filters.withOrders) {
    result = result.filter((c) => c.orderCount > 0);
  }
  if (filters.withoutOrders) {
    result = result.filter((c) => c.orderCount === 0);
  }
  if (filters.registeredFrom) {
    result = result.filter(
      (c) => new Date(c.createdAt) >= new Date(filters.registeredFrom!),
    );
  }
  if (filters.registeredTo) {
    result = result.filter(
      (c) => new Date(c.createdAt) <= new Date(filters.registeredTo!),
    );
  }
  if (filters.lastPurchaseFrom) {
    result = result.filter(
      (c) =>
        c.lastPurchaseAt &&
        new Date(c.lastPurchaseAt) >= new Date(filters.lastPurchaseFrom!),
    );
  }
  if (filters.lastPurchaseTo) {
    result = result.filter(
      (c) =>
        c.lastPurchaseAt &&
        new Date(c.lastPurchaseAt) <= new Date(filters.lastPurchaseTo!),
    );
  }
  if (filters.spentMin !== undefined) {
    result = result.filter((c) => c.totalSpent >= filters.spentMin!);
  }
  if (filters.spentMax !== undefined) {
    result = result.filter((c) => c.totalSpent <= filters.spentMax!);
  }
  if (filters.ordersMin !== undefined) {
    result = result.filter((c) => c.orderCount >= filters.ordersMin!);
  }
  if (filters.ordersMax !== undefined) {
    result = result.filter((c) => c.orderCount <= filters.ordersMax!);
  }

  return result;
}

export function sortCustomers(
  customers: AdminCustomer[],
  sort: CustomerSortOption,
): AdminCustomer[] {
  const sorted = [...customers];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'spent-desc':
      return sorted.sort((a, b) => b.totalSpent - a.totalSpent);
    case 'spent-asc':
      return sorted.sort((a, b) => a.totalSpent - b.totalSpent);
    case 'orders-desc':
      return sorted.sort((a, b) => b.orderCount - a.orderCount);
    case 'registered-desc':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'last-purchase-desc':
      return sorted.sort((a, b) => {
        const da = a.lastPurchaseAt ? new Date(a.lastPurchaseAt).getTime() : 0;
        const db = b.lastPurchaseAt ? new Date(b.lastPurchaseAt).getTime() : 0;
        return db - da;
      });
    default:
      return sorted;
  }
}

export function getCustomersChartData(customers: AdminCustomer[]) {
  const months = ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
  const now = new Date();

  return months.map((label, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const nextMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      1,
    );

    return {
      label,
      value: customers.filter((c) => {
        const created = new Date(c.createdAt);
        return created >= monthDate && created < nextMonth;
      }).length,
    };
  });
}

export function getOrderNumbersByCustomer(
  orders: { customer: { id: string }; number: string }[],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const o of orders) {
    const list = map.get(o.customer.id) ?? [];
    list.push(o.number);
    map.set(o.customer.id, list);
  }
  return map;
}

export { CUSTOMER_PAGE_SIZE };
