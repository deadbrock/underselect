import type { AccountAddress } from '@shared/types/account.types';

export type AdminOrderStatus =
  | 'new'
  | 'payment_pending'
  | 'payment_approved'
  | 'separation'
  | 'packaging'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'exchange';

export type AdminPaymentMethod = 'pix' | 'card' | 'boleto' | 'infinitepay';

export type AdminPaymentStatus =
  'pending' | 'approved' | 'failed' | 'refunded' | 'chargeback';

export type AdminShippingCarrier =
  'correios' | 'melhor_envio' | 'carrier' | 'pickup';

export type AdminShippingStatus =
  'pending' | 'label_generated' | 'shipped' | 'in_transit' | 'delivered';

export type OrderHistoryType =
  | 'created'
  | 'payment'
  | 'separation'
  | 'shipping'
  | 'delivery'
  | 'cancelled'
  | 'return'
  | 'exchange'
  | 'note'
  | 'status';

export interface AdminOrderCustomer {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}

export interface AdminOrderItem {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size: string;
  colorLabel: string;
  variationId?: string;
}

export interface AdminOrderPayment {
  method: AdminPaymentMethod;
  status: AdminPaymentStatus;
  installments?: number;
  transactionId?: string;
  paidAt?: string;
  refundAmount?: number;
}

export interface AdminOrderShipping {
  carrier: AdminShippingCarrier;
  status: AdminShippingStatus;
  method: string;
  cost: number;
  trackingCode?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface AdminOrderTimelineEvent {
  id: string;
  type: OrderHistoryType;
  label: string;
  description: string;
  user: string;
  createdAt: string;
  completed: boolean;
}

export interface OrderHistoryEntry {
  id: string;
  type: OrderHistoryType;
  label: string;
  description: string;
  user: string;
  createdAt: string;
  previousStatus?: AdminOrderStatus;
  newStatus?: AdminOrderStatus;
}

export interface AdminOrder {
  id: string;
  number: string;
  status: AdminOrderStatus;
  createdAt: string;
  updatedAt: string;
  customer: AdminOrderCustomer;
  items: AdminOrderItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
  influencerCode?: string;
  influencerName?: string;
  payment: AdminOrderPayment;
  shippingInfo: AdminOrderShipping;
  shippingAddress: AccountAddress;
  timeline: AdminOrderTimelineEvent[];
  history: OrderHistoryEntry[];
  internalNotes: string[];
}

export interface OrderDashboardStats {
  ordersToday: number;
  pendingOrders: number;
  paidOrders: number;
  cancelledOrders: number;
  averageTicket: number;
  revenueToday: number;
  inSeparation: number;
  shippedOrders: number;
  deliveredOrders: number;
}

export interface OrderFilters {
  search: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingCarrier: string;
  coupon: string;
  influencer: string;
  dateFrom?: string;
  dateTo?: string;
  valueMin?: number;
  valueMax?: number;
}

export type OrderSortOption =
  | 'date-desc'
  | 'date-asc'
  | 'value-desc'
  | 'value-asc'
  | 'number-desc'
  | 'number-asc'
  | 'customer-asc';

export interface OrderStatusChangeInput {
  orderId: string;
  status: AdminOrderStatus;
  note?: string;
}

export interface OrderNoteInput {
  orderId: string;
  note: string;
}
