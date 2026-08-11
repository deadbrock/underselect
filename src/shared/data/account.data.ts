import type {
  AccountCoupon,
  AccountDashboardStats,
  AccountOrder,
  AccountSettings,
  AccountUser,
} from '@shared/types/account.types';
import type { CatalogProduct } from '@shared/types/catalog.types';

export const EMPTY_ACCOUNT_USER: AccountUser = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  cpf: '',
  phone: '',
  birthDate: '',
  marketingEmail: false,
  marketingSms: false,
  newsletter: false,
};

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  themePreference: 'system',
  orderNotifications: true,
  promoNotifications: false,
  newsletter: false,
  promotionalCommunication: false,
};

export const MOCK_ACCOUNT_USER = EMPTY_ACCOUNT_USER;
export const MOCK_ACCOUNT_ADDRESSES: never[] = [];
export const MOCK_ACCOUNT_SETTINGS = DEFAULT_ACCOUNT_SETTINGS;
export const MOCK_ACCOUNT_ORDERS: AccountOrder[] = [];
export const MOCK_ACCOUNT_COUPONS: AccountCoupon[] = [];
export const MOCK_FAVORITE_IDS: string[] = [];
export const MOCK_WISHLIST_IDS: string[] = [];
export const MOCK_RECENTLY_VIEWED_IDS: string[] = [];

export function getDashboardStats(favoriteCount = 0): AccountDashboardStats {
  return {
    totalOrders: 0,
    totalSpent: 0,
    favoriteCount,
    availableCoupons: 0,
  };
}

export function getOrderById(_id: string): AccountOrder | undefined {
  return undefined;
}

export function getAllOrderIds(): string[] {
  return [];
}

export function getProductsByIds(_ids: string[]): CatalogProduct[] {
  return [];
}
