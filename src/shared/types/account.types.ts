import type { CatalogCategorySlug } from '@shared/mocks/catalog.types';

export type OrderStatus =
  'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type CouponAccountStatus = 'available' | 'used' | 'expired';

export interface AccountUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  marketingEmail: boolean;
  marketingSms: boolean;
  newsletter: boolean;
}

export interface AccountAddress {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
  isDefault: boolean;
}

export interface OrderTimelineEvent {
  id: string;
  label: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface AccountOrderItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
  size: string;
  colorLabel: string;
}

export interface AccountOrder {
  id: string;
  number: string;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'card' | 'boleto';
  shippingAddress: AccountAddress;
  items: AccountOrderItem[];
  timeline: OrderTimelineEvent[];
  trackingCode?: string;
}

export interface AccountCoupon {
  code: string;
  label: string;
  status: CouponAccountStatus;
  expiresAt?: string;
  usedAt?: string;
  category?: CatalogCategorySlug;
}

export interface AccountSettings {
  themePreference: 'system' | 'light' | 'dark';
  orderNotifications: boolean;
  promoNotifications: boolean;
  newsletter: boolean;
  promotionalCommunication: boolean;
}

export interface AccountDashboardStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCount: number;
  availableCoupons: number;
}

export interface AccountProfileInput {
  firstName: string;
  lastName: string;
  cpf: string;
  phone: string;
  birthDate: string;
  email: string;
  marketingEmail: boolean;
  marketingSms: boolean;
  newsletter: boolean;
}

export interface AccountAddressInput {
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
  isDefault?: boolean;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
