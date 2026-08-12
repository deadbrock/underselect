import type {
  Coupon,
  Customer,
  Influencer,
  Order,
  OrderItem,
  PaymentTransaction,
} from '@prisma/client';

import type {
  AccountAddress,
  AccountOrder,
  AccountOrderItem,
  OrderStatus,
} from '@shared/types/account.types';
import type {
  AdminOrder,
  AdminOrderStatus,
  AdminPaymentMethod,
  AdminPaymentStatus,
  AdminShippingCarrier,
  AdminShippingStatus,
} from '@shared/types/order-admin.types';

type OrderWithRelations = Order & {
  customer: Customer;
  items: OrderItem[];
  coupon?: Pick<Coupon, 'code'> | null;
  influencer?: Pick<Influencer, 'name' | 'identifierCode'> | null;
  paymentTransactions?: PaymentTransaction[];
};

function parseShippingAddress(raw: unknown): AccountAddress {
  const address = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(address.id ?? 'shipping'),
    label: String(address.label ?? 'Entrega'),
    cep: String(address.cep ?? ''),
    street: String(address.street ?? ''),
    number: String(address.number ?? ''),
    complement: address.complement ? String(address.complement) : undefined,
    neighborhood: String(address.neighborhood ?? ''),
    city: String(address.city ?? ''),
    state: String(address.state ?? ''),
    reference: address.reference ? String(address.reference) : undefined,
    isDefault: Boolean(address.isDefault),
  };
}

function mapPaymentMethod(
  method: string,
  captureMethod?: string | null,
): AdminPaymentMethod {
  if (captureMethod === 'pix') return 'pix';
  if (captureMethod === 'credit_card') return 'card';
  if (method === 'pix' || method === 'card' || method === 'boleto') {
    return method;
  }
  return 'infinitepay';
}

function mapAccountPaymentMethod(
  method: string,
  captureMethod?: string | null,
): AccountOrder['paymentMethod'] {
  const mapped = mapPaymentMethod(method, captureMethod);
  if (mapped === 'infinitepay') return 'pix';
  return mapped;
}

function mapAccountOrderStatus(
  status: string,
  paymentStatus: string,
): OrderStatus {
  if (status === 'cancelled' || status === 'returned') return 'cancelled';
  if (status === 'delivered') return 'delivered';
  if (status === 'shipped' || status === 'in_transit') return 'shipped';
  if (
    status === 'payment_approved' ||
    status === 'separation' ||
    status === 'packaging' ||
    status === 'new'
  ) {
    return 'processing';
  }
  if (paymentStatus === 'pending' || status === 'payment_pending') {
    return 'pending';
  }
  return 'processing';
}

function buildOrderTimeline(
  order: OrderWithRelations,
  latestPayment?: PaymentTransaction | null,
): AccountOrder['timeline'] {
  const events: AccountOrder['timeline'] = [
    {
      id: `${order.id}-created`,
      label: 'Pedido realizado',
      description: `Pedido ${order.number} registrado.`,
      date: order.createdAt.toISOString(),
      completed: true,
    },
  ];

  if (
    order.paymentStatus === 'approved' ||
    latestPayment?.status === 'approved'
  ) {
    events.push({
      id: `${order.id}-paid`,
      label: 'Pagamento confirmado',
      description: 'Recebemos a confirmação do pagamento.',
      date:
        latestPayment?.updatedAt.toISOString() ?? order.updatedAt.toISOString(),
      completed: true,
    });
  } else if (order.paymentStatus === 'pending') {
    events.push({
      id: `${order.id}-pending`,
      label: 'Aguardando pagamento',
      description: 'Estamos aguardando a confirmação do pagamento.',
      date: order.createdAt.toISOString(),
      completed: false,
    });
  }

  if (['separation', 'packaging'].includes(order.status)) {
    events.push({
      id: `${order.id}-prep`,
      label: 'Preparando envio',
      description: 'Seu pedido está sendo separado.',
      date: order.updatedAt.toISOString(),
      completed: false,
    });
  }

  if (['shipped', 'in_transit'].includes(order.status)) {
    events.push({
      id: `${order.id}-shipped`,
      label: 'Pedido enviado',
      description: 'Seu pedido saiu para entrega.',
      date: order.updatedAt.toISOString(),
      completed: true,
    });
  }

  if (order.status === 'delivered') {
    events.push({
      id: `${order.id}-delivered`,
      label: 'Pedido entregue',
      description: 'Entrega concluída.',
      date: order.updatedAt.toISOString(),
      completed: true,
    });
  }

  return events;
}

function buildAdminTimeline(order: OrderWithRelations): AdminOrder['timeline'] {
  const createdAt = order.createdAt.toISOString();
  const timeline: AdminOrder['timeline'] = [
    {
      id: `${order.id}-created`,
      type: 'created',
      label: 'Pedido criado',
      description: `Pedido ${order.number} registrado no sistema.`,
      user: 'Sistema',
      createdAt,
      completed: true,
    },
  ];

  if (order.paymentStatus === 'approved') {
    timeline.push({
      id: `${order.id}-payment`,
      type: 'payment',
      label: 'Pagamento confirmado',
      description: 'Pagamento aprovado pela InfinitePay.',
      user: 'InfinitePay',
      createdAt: order.updatedAt.toISOString(),
      completed: true,
    });
  }

  return timeline;
}

export function mapOrderToAdminOrder(
  order: OrderWithRelations,
  customerStats?: { totalOrders: number; totalSpent: number },
): AdminOrder {
  const latestPayment = order.paymentTransactions?.[0] ?? null;
  const shippingAddress = parseShippingAddress(order.shippingAddress);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: order.id,
    number: order.number,
    status: order.status as AdminOrderStatus,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    customer: {
      id: order.customer.id,
      name: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
      cpf: order.customer.cpf,
      email: order.customer.email,
      phone: order.customer.phone,
      totalOrders: customerStats?.totalOrders ?? 0,
      totalSpent: customerStats?.totalSpent ?? 0,
    },
    items: order.items.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      sku: item.sku,
      name: item.name,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      size: item.size ?? '',
      colorLabel: item.colorLabel ?? '',
      variationId: item.variationId ?? undefined,
    })),
    itemCount,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    discount: Number(order.discount),
    total: Number(order.total),
    couponCode: order.couponCode ?? undefined,
    couponDiscount: order.couponDiscount
      ? Number(order.couponDiscount)
      : undefined,
    influencerCode: order.influencer?.identifierCode ?? undefined,
    influencerName: order.influencer?.name ?? undefined,
    payment: {
      method: mapPaymentMethod(
        order.paymentMethod,
        latestPayment?.captureMethod,
      ),
      status: order.paymentStatus as AdminPaymentStatus,
      installments: latestPayment?.installments ?? undefined,
      transactionId: latestPayment?.transactionNsu ?? undefined,
      paidAt:
        order.paymentStatus === 'approved'
          ? latestPayment?.updatedAt.toISOString()
          : undefined,
    },
    shippingInfo: {
      carrier: 'carrier' as AdminShippingCarrier,
      status: 'pending' as AdminShippingStatus,
      method: order.shippingMethod ?? 'Entrega',
      cost: Number(order.shipping),
    },
    shippingAddress,
    timeline: buildAdminTimeline(order),
    history: [
      {
        id: `${order.id}-hist-created`,
        type: 'created',
        label: 'Pedido criado',
        description: `Pedido ${order.number} registrado.`,
        user: 'Sistema',
        createdAt: order.createdAt.toISOString(),
      },
    ],
    internalNotes: [],
  };
}

export function mapOrderToAccountOrder(
  order: OrderWithRelations,
): AccountOrder {
  const latestPayment = order.paymentTransactions?.[0] ?? null;
  const shippingAddress = parseShippingAddress(order.shippingAddress);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const items: AccountOrderItem[] = order.items.map((item) => ({
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
    price: Number(item.unitPrice),
    size: item.size ?? '',
    colorLabel: item.colorLabel ?? '',
  }));

  return {
    id: order.id,
    number: order.number,
    status: mapAccountOrderStatus(order.status, order.paymentStatus),
    createdAt: order.createdAt.toISOString(),
    itemCount,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    discount: Number(order.discount),
    total: Number(order.total),
    paymentMethod: mapAccountPaymentMethod(
      order.paymentMethod,
      latestPayment?.captureMethod,
    ),
    shippingAddress,
    items,
    timeline: buildOrderTimeline(order, latestPayment),
  };
}
