import {
  ORDER_MOCK_USER,
  ORDER_PAGE_SIZE,
} from '@shared/constants/order-admin.constants';
import { MOCK_ACCOUNT_ORDERS } from '@shared/mocks/account.data';
import { CATALOG_PRODUCTS } from '@shared/mocks/catalog.utils';
import type {
  AdminOrder,
  AdminOrderItem,
  AdminOrderStatus,
  OrderDashboardStats,
  OrderFilters,
  OrderHistoryEntry,
  OrderSortOption,
  AdminOrderTimelineEvent,
} from '@shared/types/order-admin.types';

const INFLUENCERS = [
  { code: 'FLA10', name: 'Canal Flamengo FC' },
  { code: 'PALMEIRAS', name: 'Verdão Store' },
  { code: 'UNDER', name: 'UNDER SELECT' },
];

const CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Rafael Souza',
    cpf: '12345678909',
    email: 'rafael.souza@email.com',
    phone: '11999998888',
  },
  {
    id: 'cust-2',
    name: 'Ana Paula Lima',
    cpf: '98765432100',
    email: 'ana.lima@email.com',
    phone: '21988887777',
  },
  {
    id: 'cust-3',
    name: 'Carlos Mendes',
    cpf: '45678912345',
    email: 'carlos.m@email.com',
    phone: '31977776666',
  },
  {
    id: 'cust-4',
    name: 'Juliana Costa',
    cpf: '32165498700',
    email: 'ju.costa@email.com',
    phone: '41966665555',
  },
  {
    id: 'cust-5',
    name: 'Pedro Alves',
    cpf: '78912345600',
    email: 'pedro.alves@email.com',
    phone: '51955554444',
  },
];

function mapAccountStatus(status: string): AdminOrderStatus {
  const map: Record<string, AdminOrderStatus> = {
    pending: 'payment_pending',
    processing: 'separation',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
  };
  return map[status] ?? 'new';
}

function buildItems(
  items: (typeof MOCK_ACCOUNT_ORDERS)[0]['items'],
): AdminOrderItem[] {
  return items.map((item) => ({
    productId: item.productId,
    slug: item.slug,
    sku: `US-${item.productId.slice(-4).toUpperCase()}-${item.size}`,
    name: item.name,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
    unitPrice: item.price,
    totalPrice: item.price * item.quantity,
    size: item.size,
    colorLabel: item.colorLabel,
  }));
}

function buildTimeline(
  events: (typeof MOCK_ACCOUNT_ORDERS)[0]['timeline'],
): AdminOrderTimelineEvent[] {
  return events.map((e) => ({
    id: e.id,
    type: inferTimelineType(e.label),
    label: e.label,
    description: e.description,
    user: ORDER_MOCK_USER,
    createdAt: e.date || new Date().toISOString(),
    completed: e.completed,
  }));
}

function inferTimelineType(label: string): AdminOrderTimelineEvent['type'] {
  const l = label.toLowerCase();
  if (l.includes('confirmado') || l.includes('criado')) return 'created';
  if (l.includes('pagamento')) return 'payment';
  if (l.includes('separação')) return 'separation';
  if (l.includes('enviado') || l.includes('despachado')) return 'shipping';
  if (l.includes('entregue')) return 'delivery';
  if (l.includes('cancel')) return 'cancelled';
  return 'status';
}

function createHistoryFromTimeline(
  timeline: AdminOrderTimelineEvent[],
): OrderHistoryEntry[] {
  return timeline
    .filter((t) => t.completed && t.createdAt)
    .map((t) => ({
      id: `hist-${t.id}`,
      type: t.type,
      label: t.label,
      description: t.description,
      user: t.user,
      createdAt: t.createdAt,
    }));
}

function orderFromAccount(
  order: (typeof MOCK_ACCOUNT_ORDERS)[0],
  customerIdx: number,
  extras?: Partial<AdminOrder>,
): AdminOrder {
  const customer = CUSTOMERS[customerIdx % CUSTOMERS.length]!;
  const timeline = buildTimeline(order.timeline);
  const status = mapAccountStatus(order.status);
  const now = order.createdAt;

  return {
    id: order.id,
    number: order.number,
    status,
    createdAt: order.createdAt,
    updatedAt: now,
    customer: {
      ...customer,
      totalOrders: 2 + (customerIdx % 4),
      totalSpent: 1200 + customerIdx * 450,
    },
    items: buildItems(order.items),
    itemCount: order.itemCount,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    couponCode: order.discount > 0 ? 'UNDER10' : undefined,
    couponDiscount: order.discount > 0 ? order.discount : undefined,
    influencerCode: customerIdx === 0 ? INFLUENCERS[0]?.code : undefined,
    influencerName: customerIdx === 0 ? INFLUENCERS[0]?.name : undefined,
    payment: {
      method: order.paymentMethod,
      status:
        status === 'payment_pending'
          ? 'pending'
          : status === 'cancelled'
            ? 'failed'
            : 'approved',
      installments: order.paymentMethod === 'card' ? 3 : 1,
      transactionId: `TXN-${order.id.toUpperCase()}`,
      paidAt:
        status !== 'payment_pending' && status !== 'cancelled'
          ? order.createdAt
          : undefined,
    },
    shippingInfo: {
      carrier: 'correios',
      status:
        status === 'delivered'
          ? 'delivered'
          : status === 'shipped'
            ? 'in_transit'
            : 'pending',
      method: 'PAC',
      cost: order.shipping,
      trackingCode: order.trackingCode,
      estimatedDelivery: '2026-08-20',
      shippedAt:
        status === 'shipped' || status === 'delivered' ? now : undefined,
      deliveredAt: status === 'delivered' ? now : undefined,
    },
    shippingAddress: order.shippingAddress,
    timeline,
    history: createHistoryFromTimeline(timeline),
    internalNotes: [],
    ...extras,
  };
}

function generateExtraOrders(): AdminOrder[] {
  const statuses: AdminOrderStatus[] = [
    'new',
    'payment_pending',
    'payment_approved',
    'separation',
    'packaging',
    'in_transit',
    'cancelled',
    'returned',
    'exchange',
  ];

  return statuses.map((status, i) => {
    const product = CATALOG_PRODUCTS[i + 10] ?? CATALOG_PRODUCTS[0]!;
    const customer = CUSTOMERS[(i + 2) % CUSTOMERS.length]!;
    const qty = 1 + (i % 3);
    const subtotal = product.price * qty;
    const shipping = 19.9;
    const discount = i % 3 === 0 ? subtotal * 0.1 : 0;
    const total = subtotal + shipping - discount;
    const createdAt = new Date(Date.now() - i * 86400000 * 2).toISOString();
    const influencer = INFLUENCERS[i % INFLUENCERS.length]!;

    const items: AdminOrderItem[] = [
      {
        productId: product.id,
        slug: product.slug,
        sku: `US-${product.id.slice(-4).toUpperCase()}-M`,
        name: product.name,
        imageUrl: product.imageUrl,
        quantity: qty,
        unitPrice: product.price,
        totalPrice: subtotal,
        size: 'M',
        colorLabel: 'Principal',
      },
    ];

    const timeline: AdminOrderTimelineEvent[] = [
      {
        id: `tl-${i}-1`,
        type: 'created',
        label: 'Pedido criado',
        description: 'Pedido registrado no sistema.',
        user: ORDER_MOCK_USER,
        createdAt,
        completed: true,
      },
    ];

    if (!['new', 'payment_pending'].includes(status)) {
      timeline.push({
        id: `tl-${i}-2`,
        type: 'payment',
        label: 'Pagamento aprovado',
        description: 'Pagamento confirmado.',
        user: ORDER_MOCK_USER,
        createdAt,
        completed: true,
      });
    }

    return {
      id: `ord-extra-${i + 1}`,
      number: `US-2026${String(100 + i).padStart(4, '0')}`,
      status,
      createdAt,
      updatedAt: createdAt,
      customer: {
        ...customer,
        totalOrders: 1 + i,
        totalSpent: total * (1 + i),
      },
      items,
      itemCount: qty,
      subtotal,
      shipping,
      discount,
      total,
      couponCode: discount > 0 ? 'UNDER10' : undefined,
      couponDiscount: discount > 0 ? discount : undefined,
      influencerCode: i % 2 === 0 ? influencer.code : undefined,
      influencerName: i % 2 === 0 ? influencer.name : undefined,
      payment: {
        method: (['pix', 'card', 'boleto'] as const)[i % 3],
        status:
          status === 'payment_pending'
            ? 'pending'
            : status === 'cancelled'
              ? 'failed'
              : 'approved',
        installments: i % 3 === 1 ? 6 : 1,
        transactionId: `TXN-EXTRA-${i}`,
        paidAt:
          status !== 'payment_pending' && status !== 'new'
            ? createdAt
            : undefined,
      },
      shippingInfo: {
        carrier: (['correios', 'melhor_envio', 'carrier'] as const)[i % 3],
        status: 'pending',
        method: i % 2 === 0 ? 'PAC' : 'SEDEX',
        cost: shipping,
        trackingCode:
          status === 'in_transit' ? `BR${1000000 + i}US` : undefined,
      },
      shippingAddress: MOCK_ACCOUNT_ORDERS[0]!.shippingAddress,
      timeline,
      history: createHistoryFromTimeline(timeline),
      internalNotes: [],
    };
  });
}

export function buildInitialOrders(): AdminOrder[] {
  const fromAccount = MOCK_ACCOUNT_ORDERS.map((o, i) => orderFromAccount(o, i));
  const todayOrder: AdminOrder = {
    ...orderFromAccount(MOCK_ACCOUNT_ORDERS[2]!, 1),
    id: 'ord-today',
    number: 'US-TODAY001',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    payment: {
      method: 'pix',
      status: 'pending',
      installments: 1,
    },
    shippingInfo: {
      carrier: 'correios',
      status: 'pending',
      method: 'PAC',
      cost: 19.9,
    },
    timeline: [
      {
        id: 'tl-today-1',
        type: 'created',
        label: 'Pedido criado',
        description: 'Novo pedido recebido.',
        user: ORDER_MOCK_USER,
        createdAt: new Date().toISOString(),
        completed: true,
      },
    ],
    history: [
      {
        id: 'hist-today-1',
        type: 'created',
        label: 'Pedido criado',
        description: 'Novo pedido recebido.',
        user: ORDER_MOCK_USER,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  return [...fromAccount, todayOrder, ...generateExtraOrders()];
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
  return days.map((label, i) => ({
    label,
    value: orders.filter((_, idx) => idx % 7 === i).length + 3 + i,
  }));
}

export { ORDER_PAGE_SIZE };
