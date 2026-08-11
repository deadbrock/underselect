import { STORE_LEGAL } from './legal.constants';
import { PROMO_BAR, SOCIAL_LINKS, STORE_NAME } from './store-navigation';

import type {
  AdminAccessProfile,
  AdminStoreSettings,
} from '../types/admin-settings.types';

export const SETTINGS_STORAGE_KEY = 'underselect-admin-settings';

export const DEFAULT_ADMIN_ACCESS_PROFILE: AdminAccessProfile = {
  id: 'default',
  name: 'Administrador',
  email: '',
  phone: '',
  role: 'admin',
  avatarInitials: 'AD',
};

export const DEFAULT_ADMIN_STORE_SETTINGS: AdminStoreSettings = {
  storeName: STORE_NAME,
  contactEmail: STORE_LEGAL.contactEmail,
  contactPhone: '',
  storeLocation: STORE_LEGAL.location,
  instagramUrl: SOCIAL_LINKS[0]?.href ?? '',
  maxInstallments: 2,
  freeShippingMinValue: 599,
  estimatedDelivery: '8 a 15 dias úteis',
  promoBarEnabled: PROMO_BAR.enabled,
  promoBarMessage: PROMO_BAR.message,
  ordersAlertEmail: STORE_LEGAL.contactEmail,
  maintenanceMode: false,
  shippingOriginCep: '50030000',
  shippingOriginStreet: '',
  shippingOriginNumber: '',
  shippingOriginComplement: '',
  shippingOriginNeighborhood: '',
  shippingOriginCity: 'Recife',
  shippingOriginState: 'PE',
};
