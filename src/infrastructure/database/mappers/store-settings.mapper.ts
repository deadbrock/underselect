import type { StoreSettings as PrismaStoreSettings } from '@prisma/client';

import { DEFAULT_ADMIN_STORE_SETTINGS } from '@shared/constants/admin-settings.constants';
import type { AdminStoreSettings } from '@shared/types/admin-settings.types';

export function mapStoreSettingsToDomain(
  record: PrismaStoreSettings,
): AdminStoreSettings {
  return {
    storeName: record.storeName,
    contactEmail: record.contactEmail,
    contactPhone: record.contactPhone,
    storeLocation: record.storeLocation,
    instagramUrl: record.instagramUrl,
    maxInstallments: record.maxInstallments,
    freeShippingMinValue: Number(record.freeShippingMinValue),
    estimatedDelivery: record.estimatedDelivery,
    promoBarEnabled: record.promoBarEnabled,
    promoBarMessage: record.promoBarMessage,
    ordersAlertEmail: record.ordersAlertEmail,
    maintenanceMode: record.maintenanceMode,
    shippingOriginCep: record.shippingOriginCep,
    shippingOriginStreet: record.shippingOriginStreet,
    shippingOriginNumber: record.shippingOriginNumber,
    shippingOriginComplement: record.shippingOriginComplement,
    shippingOriginNeighborhood: record.shippingOriginNeighborhood,
    shippingOriginCity: record.shippingOriginCity,
    shippingOriginState: record.shippingOriginState,
  };
}

export function mapStoreSettingsToCreateInput(
  settings: AdminStoreSettings = DEFAULT_ADMIN_STORE_SETTINGS,
) {
  return {
    id: 'default' as const,
    storeName: settings.storeName,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    storeLocation: settings.storeLocation,
    instagramUrl: settings.instagramUrl,
    maxInstallments: settings.maxInstallments,
    freeShippingMinValue: settings.freeShippingMinValue,
    estimatedDelivery: settings.estimatedDelivery,
    promoBarEnabled: settings.promoBarEnabled,
    promoBarMessage: settings.promoBarMessage,
    ordersAlertEmail: settings.ordersAlertEmail,
    maintenanceMode: settings.maintenanceMode,
    shippingOriginCep: settings.shippingOriginCep,
    shippingOriginStreet: settings.shippingOriginStreet,
    shippingOriginNumber: settings.shippingOriginNumber,
    shippingOriginComplement: settings.shippingOriginComplement,
    shippingOriginNeighborhood: settings.shippingOriginNeighborhood,
    shippingOriginCity: settings.shippingOriginCity,
    shippingOriginState: settings.shippingOriginState,
  };
}

export function mapStoreSettingsToUpdateInput(settings: AdminStoreSettings) {
  return {
    storeName: settings.storeName,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    storeLocation: settings.storeLocation,
    instagramUrl: settings.instagramUrl,
    maxInstallments: settings.maxInstallments,
    freeShippingMinValue: settings.freeShippingMinValue,
    estimatedDelivery: settings.estimatedDelivery,
    promoBarEnabled: settings.promoBarEnabled,
    promoBarMessage: settings.promoBarMessage,
    ordersAlertEmail: settings.ordersAlertEmail,
    maintenanceMode: settings.maintenanceMode,
    shippingOriginCep: settings.shippingOriginCep,
    shippingOriginStreet: settings.shippingOriginStreet,
    shippingOriginNumber: settings.shippingOriginNumber,
    shippingOriginComplement: settings.shippingOriginComplement,
    shippingOriginNeighborhood: settings.shippingOriginNeighborhood,
    shippingOriginCity: settings.shippingOriginCity,
    shippingOriginState: settings.shippingOriginState,
  };
}
