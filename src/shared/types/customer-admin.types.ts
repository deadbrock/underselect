import type { AccountAddress } from '@shared/types/account.types';

export type AdminCustomerStatus = 'active' | 'blocked' | 'inactive';

export type AdminCustomerType = 'new' | 'recurring' | 'inactive' | 'vip';

export type AdminCustomerSegment =
  | 'vip'
  | 'recurring'
  | 'inactive'
  | 'new'
  | 'high_ticket'
  | 'coupon_user'
  | 'influencer_origin';

export type CustomerActivityType =
  | 'registered'
  | 'first_purchase'
  | 'purchase'
  | 'profile_update'
  | 'coupon_used'
  | 'return'
  | 'exchange'
  | 'communication'
  | 'note'
  | 'blocked'
  | 'unblocked';

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate?: string;
  status: AdminCustomerStatus;
  type: AdminCustomerType;
  segments: AdminCustomerSegment[];
  createdAt: string;
  updatedAt: string;
  orderCount: number;
  totalSpent: number;
  averageTicket: number;
  productsPurchased: number;
  firstPurchaseAt?: string;
  lastPurchaseAt?: string;
  influencerOrigin?: string;
  internalNotes: string[];
  addresses: AccountAddress[];
}

export interface AdminCustomerCouponUsage {
  id: string;
  customerId: string;
  code: string;
  discountLabel: string;
  discountAmount: number;
  orderId: string;
  orderNumber: string;
  usedAt: string;
  influencerCode?: string;
}

export interface AdminCustomerActivity {
  id: string;
  customerId: string;
  type: CustomerActivityType;
  label: string;
  description: string;
  createdAt: string;
}

export interface CustomerDashboardStats {
  totalCustomers: number;
  newCustomers: number;
  recurringCustomers: number;
  inactiveCustomers: number;
  averageTicket: number;
  purchasedInPeriod: number;
  recurrenceRate: number;
  totalRevenue: number;
}

export interface CustomerFilters {
  search: string;
  type: string;
  status: string;
  segment: string;
  withOrders: boolean;
  withoutOrders: boolean;
  registeredFrom?: string;
  registeredTo?: string;
  lastPurchaseFrom?: string;
  lastPurchaseTo?: string;
  spentMin?: number;
  spentMax?: number;
  ordersMin?: number;
  ordersMax?: number;
}

export type CustomerSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'spent-desc'
  | 'spent-asc'
  | 'orders-desc'
  | 'registered-desc'
  | 'last-purchase-desc';

export interface CustomerNoteInput {
  customerId: string;
  note: string;
}

export interface CustomerAddressInput {
  customerId: string;
  address: Omit<AccountAddress, 'id'>;
}
