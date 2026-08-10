import { CUSTOMER_PAGE_SIZE } from '@shared/constants/customer-admin.constants';
import {
  MOCK_ACCOUNT_ADDRESSES,
  MOCK_ACCOUNT_COUPONS,
  MOCK_ACCOUNT_USER,
} from '@shared/mocks/account.data';
import type {
  AdminCustomer,
  AdminCustomerActivity,
  AdminCustomerCouponUsage,
  CustomerDashboardStats,
  CustomerFilters,
  CustomerSortOption,
} from '@shared/types/customer-admin.types';

const BASE_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Rafael Souza',
    email: 'rafael.souza@email.com',
    phone: '11999998888',
    cpf: '12345678909',
    birthDate: '1992-05-15',
    type: 'vip' as const,
    orderCount: 5,
    totalSpent: 4280.5,
    productsPurchased: 12,
    firstPurchaseAt: '2025-11-10T10:00:00.000Z',
    lastPurchaseAt: '2026-08-15T18:45:00.000Z',
    influencerOrigin: 'FLA10',
  },
  {
    id: 'cust-2',
    name: 'Ana Paula Lima',
    email: 'ana.lima@email.com',
    phone: '21988887777',
    cpf: '98765432100',
    birthDate: '1988-03-22',
    type: 'recurring' as const,
    orderCount: 3,
    totalSpent: 1890.0,
    productsPurchased: 6,
    firstPurchaseAt: '2026-01-15T14:00:00.000Z',
    lastPurchaseAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'cust-3',
    name: 'Carlos Mendes',
    email: 'carlos.m@email.com',
    phone: '31977776666',
    cpf: '45678912345',
    type: 'new' as const,
    orderCount: 1,
    totalSpent: 459.9,
    productsPurchased: 1,
    firstPurchaseAt: '2026-08-01T09:30:00.000Z',
    lastPurchaseAt: '2026-08-01T09:30:00.000Z',
    influencerOrigin: 'PALMEIRAS',
  },
  {
    id: 'cust-4',
    name: 'Juliana Costa',
    email: 'ju.costa@email.com',
    phone: '41966665555',
    cpf: '32165498700',
    type: 'inactive' as const,
    status: 'inactive' as const,
    orderCount: 2,
    totalSpent: 780.0,
    productsPurchased: 3,
    firstPurchaseAt: '2025-06-20T16:00:00.000Z',
    lastPurchaseAt: '2025-12-05T11:00:00.000Z',
  },
  {
    id: 'cust-5',
    name: 'Pedro Alves',
    email: 'pedro.alves@email.com',
    phone: '51955554444',
    cpf: '78912345600',
    type: 'recurring' as const,
    orderCount: 4,
    totalSpent: 2150.0,
    productsPurchased: 8,
    firstPurchaseAt: '2025-09-01T12:00:00.000Z',
    lastPurchaseAt: '2026-07-28T14:30:00.000Z',
  },
  {
    id: 'cust-6',
    name: 'Mariana Ferreira',
    email: 'mariana.f@email.com',
    phone: '11988887766',
    cpf: '65432198700',
    type: 'new' as const,
    orderCount: 0,
    totalSpent: 0,
    productsPurchased: 0,
    createdAt: '2026-08-05T08:00:00.000Z',
  },
  {
    id: 'cust-7',
    name: 'Lucas Oliveira',
    email: 'lucas.oliveira@email.com',
    phone: '21977776655',
    cpf: '11122233344',
    type: 'vip' as const,
    orderCount: 8,
    totalSpent: 8920.0,
    productsPurchased: 22,
    firstPurchaseAt: '2024-03-10T10:00:00.000Z',
    lastPurchaseAt: '2026-08-07T15:00:00.000Z',
    influencerOrigin: 'UNDER',
  },
  {
    id: 'cust-8',
    name: 'Fernanda Rocha',
    email: 'fe.rocha@email.com',
    phone: '31966665544',
    cpf: '55566677788',
    type: 'recurring' as const,
    orderCount: 2,
    totalSpent: 620.0,
    productsPurchased: 4,
    firstPurchaseAt: '2026-05-12T09:00:00.000Z',
    lastPurchaseAt: '2026-06-18T17:30:00.000Z',
  },
];

function buildSegments(
  c: (typeof BASE_CUSTOMERS)[0],
): AdminCustomer['segments'] {
  const segments: AdminCustomer['segments'] = [];
  if (c.type === 'vip') segments.push('vip');
  if (c.type === 'recurring') segments.push('recurring');
  if (c.type === 'inactive') segments.push('inactive');
  if (c.type === 'new') segments.push('new');
  if (c.totalSpent >= 2000) segments.push('high_ticket');
  if (c.orderCount >= 2) segments.push('coupon_user');
  if (c.influencerOrigin) segments.push('influencer_origin');
  return segments;
}

export function buildInitialCustomers(): AdminCustomer[] {
  return BASE_CUSTOMERS.map((c) => {
    const createdAt =
      'createdAt' in c && c.createdAt
        ? c.createdAt
        : (c.firstPurchaseAt ?? '2026-01-01T10:00:00.000Z');
    const avg = c.orderCount > 0 ? c.totalSpent / c.orderCount : 0;

    return {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      cpf: c.cpf,
      birthDate: 'birthDate' in c ? c.birthDate : undefined,
      status: 'status' in c ? c.status! : 'active',
      type: c.type,
      segments: buildSegments(c),
      createdAt,
      updatedAt: c.lastPurchaseAt ?? createdAt,
      orderCount: c.orderCount,
      totalSpent: c.totalSpent,
      averageTicket: avg,
      productsPurchased: c.productsPurchased,
      firstPurchaseAt: c.firstPurchaseAt,
      lastPurchaseAt: c.lastPurchaseAt,
      influencerOrigin: c.influencerOrigin,
      internalNotes: [],
      addresses:
        c.id === 'cust-1'
          ? MOCK_ACCOUNT_ADDRESSES
          : c.id === 'cust-2'
            ? [MOCK_ACCOUNT_ADDRESSES[0]!]
            : [],
    };
  });
}

export function buildCustomerCouponUsages(): AdminCustomerCouponUsage[] {
  return [
    {
      id: 'cu-1',
      customerId: 'cust-1',
      code: 'UNDER10',
      discountLabel: '10% de desconto',
      discountAmount: 44.9,
      orderId: 'ord-1',
      orderNumber: 'US-MOCK001',
      usedAt: '2026-07-28T14:30:00.000Z',
      influencerCode: 'FLA10',
    },
    {
      id: 'cu-2',
      customerId: 'cust-1',
      code: 'BEMVINDO',
      discountLabel: '15% na primeira compra',
      discountAmount: 53.8,
      orderId: 'ord-3',
      orderNumber: 'US-MOCK003',
      usedAt: '2026-08-15T18:45:00.000Z',
    },
    {
      id: 'cu-3',
      customerId: 'cust-5',
      code: 'FRETEGRATIS',
      discountLabel: 'Frete grátis',
      discountAmount: 19.9,
      orderId: 'ord-2',
      orderNumber: 'US-MOCK002',
      usedAt: '2026-08-10T10:00:00.000Z',
    },
  ];
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

  MOCK_ACCOUNT_COUPONS.filter((c) => c.status === 'used').forEach(
    (coupon, i) => {
      if (customer.id === 'cust-1') {
        activities.push({
          id: `act-${customer.id}-cup-${i}`,
          customerId: customer.id,
          type: 'coupon_used',
          label: 'Cupom utilizado',
          description: `Cupom ${coupon.code} aplicado.`,
          createdAt: coupon.usedAt ?? customer.lastPurchaseAt ?? now(),
        });
      }
    },
  );

  customer.internalNotes.forEach((note, i) => {
    activities.push({
      id: `act-${customer.id}-note-${i}`,
      customerId: customer.id,
      type: 'note',
      label: 'Observação interna',
      description: note,
      createdAt: now(),
    });
  });

  return activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function now() {
  return new Date().toISOString();
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
  return months.map((label, i) => ({
    label,
    value: customers.filter((_, idx) => idx % 6 === i).length + 2 + i,
  }));
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

export { CUSTOMER_PAGE_SIZE, MOCK_ACCOUNT_USER };
