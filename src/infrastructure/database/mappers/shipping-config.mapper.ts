import type {
  ShippingDistanceRange as PrismaShippingDistanceRange,
  StoreSettings as PrismaStoreSettings,
} from '@prisma/client';

import type {
  AdminShippingConfig,
  ShippingDistanceRange,
} from '@shared/types/shipping-config.types';

export function mapShippingDistanceRangeToDomain(
  record: PrismaShippingDistanceRange,
): ShippingDistanceRange {
  return {
    id: record.id,
    startKm: Number(record.startKm),
    endKm: Number(record.endKm),
    pricePerKm: Number(record.pricePerKm),
    additionalFee: Number(record.additionalFee),
    enabled: record.enabled,
    sortOrder: record.sortOrder,
  };
}

export function mapStoreSettingsToShippingConfig(
  settings: PrismaStoreSettings,
  ranges: PrismaShippingDistanceRange[],
): AdminShippingConfig {
  return {
    shippingBaseFee: Number(settings.shippingBaseFee),
    shippingPerKm: Number(settings.shippingPerKm),
    shippingMinFee: Number(settings.shippingMinFee),
    shippingMaxFee: Number(settings.shippingMaxFee),
    freeShippingEnabled: settings.freeShippingEnabled,
    freeShippingMinValue: Number(settings.freeShippingMinValue),
    distanceCalculationEnabled: settings.distanceCalculationEnabled,
    distanceRangesEnabled: settings.distanceRangesEnabled,
    shippingOriginCep: settings.shippingOriginCep,
    shippingOriginCity: settings.shippingOriginCity,
    shippingOriginState: settings.shippingOriginState,
    estimatedDelivery: settings.estimatedDelivery,
    ranges: ranges.map(mapShippingDistanceRangeToDomain),
  };
}
