import { prisma } from '@infrastructure/database';
import {
  mapShippingDistanceRangeToDomain,
  mapStoreSettingsToShippingConfig,
} from '@infrastructure/database/mappers/shipping-config.mapper';
import { getStoreSettings } from '@infrastructure/database/repositories/store-settings.repository';
import {
  validateShippingRangesCollection,
  ShippingRangeValidationError,
} from '@application/services';
import type {
  AdminShippingConfig,
  ShippingDistanceRangeInput,
} from '@shared/types/shipping-config.types';

export { ShippingRangeValidationError };

export async function getShippingConfig(): Promise<AdminShippingConfig> {
  const [settings, ranges] = await Promise.all([
    prisma.storeSettings.findUnique({ where: { id: 'default' } }),
    prisma.shippingDistanceRange.findMany({
      orderBy: [{ sortOrder: 'asc' }, { startKm: 'asc' }],
    }),
  ]);

  if (!settings) {
    await getStoreSettings();
    return getShippingConfig();
  }

  return mapStoreSettingsToShippingConfig(settings, ranges);
}

export interface UpdateShippingConfigInput {
  shippingBaseFee: number;
  shippingPerKm: number;
  shippingMinFee: number;
  shippingMaxFee: number;
  freeShippingEnabled: boolean;
  freeShippingMinValue: number;
  distanceCalculationEnabled: boolean;
  distanceRangesEnabled: boolean;
}

export async function updateShippingConfig(
  input: UpdateShippingConfigInput,
): Promise<AdminShippingConfig> {
  await getStoreSettings();

  await prisma.storeSettings.update({
    where: { id: 'default' },
    data: {
      shippingBaseFee: input.shippingBaseFee,
      shippingPerKm: input.shippingPerKm,
      shippingMinFee: input.shippingMinFee,
      shippingMaxFee: input.shippingMaxFee,
      freeShippingEnabled: input.freeShippingEnabled,
      freeShippingMinValue: input.freeShippingMinValue,
      distanceCalculationEnabled: input.distanceCalculationEnabled,
      distanceRangesEnabled: input.distanceRangesEnabled,
    },
  });

  return getShippingConfig();
}

export async function listShippingDistanceRanges() {
  const ranges = await prisma.shippingDistanceRange.findMany({
    orderBy: [{ sortOrder: 'asc' }, { startKm: 'asc' }],
  });
  return ranges.map(mapShippingDistanceRangeToDomain);
}

export async function createShippingDistanceRange(
  input: ShippingDistanceRangeInput,
) {
  const existing = await listShippingDistanceRanges();
  validateShippingRangesCollection(existing, input);

  const created = await prisma.shippingDistanceRange.create({
    data: {
      startKm: input.startKm,
      endKm: input.endKm,
      pricePerKm: input.pricePerKm,
      additionalFee: input.additionalFee ?? 0,
      enabled: input.enabled ?? true,
      sortOrder: input.sortOrder ?? existing.length,
    },
  });

  return mapShippingDistanceRangeToDomain(created);
}

export async function updateShippingDistanceRange(
  id: string,
  input: ShippingDistanceRangeInput,
) {
  const existing = await listShippingDistanceRanges();
  validateShippingRangesCollection(existing, input, id);

  const updated = await prisma.shippingDistanceRange.update({
    where: { id },
    data: {
      startKm: input.startKm,
      endKm: input.endKm,
      pricePerKm: input.pricePerKm,
      additionalFee: input.additionalFee ?? 0,
      enabled: input.enabled ?? true,
      sortOrder: input.sortOrder,
    },
  });

  return mapShippingDistanceRangeToDomain(updated);
}

export async function deleteShippingDistanceRange(id: string) {
  await prisma.shippingDistanceRange.delete({ where: { id } });
}

export async function reorderShippingDistanceRanges(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.shippingDistanceRange.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );

  return listShippingDistanceRanges();
}
