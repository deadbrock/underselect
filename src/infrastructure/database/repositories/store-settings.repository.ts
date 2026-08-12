import { prisma } from '@infrastructure/database';
import { isDatabaseConfigured } from '@infrastructure/database/runtime';

import {
  mapStoreSettingsToCreateInput,
  mapStoreSettingsToDomain,
  mapStoreSettingsToUpdateInput,
} from '../mappers/store-settings.mapper';
import type { AdminStoreSettings } from '@shared/types/admin-settings.types';
import { DEFAULT_ADMIN_STORE_SETTINGS } from '@shared/constants/admin-settings.constants';

export async function getStoreSettings(): Promise<AdminStoreSettings> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_ADMIN_STORE_SETTINGS;
  }

  const existing = await prisma.storeSettings.findUnique({
    where: { id: 'default' },
  });

  if (existing) {
    return mapStoreSettingsToDomain(existing);
  }

  const created = await prisma.storeSettings.create({
    data: mapStoreSettingsToCreateInput(),
  });

  return mapStoreSettingsToDomain(created);
}

export async function updateStoreSettings(
  settings: AdminStoreSettings,
): Promise<AdminStoreSettings> {
  const updated = await prisma.storeSettings.upsert({
    where: { id: 'default' },
    create: mapStoreSettingsToCreateInput(settings),
    update: mapStoreSettingsToUpdateInput(settings),
  });

  return mapStoreSettingsToDomain(updated);
}

export async function resetStoreSettings(): Promise<AdminStoreSettings> {
  const { DEFAULT_ADMIN_STORE_SETTINGS } =
    await import('@shared/constants/admin-settings.constants');

  return updateStoreSettings(DEFAULT_ADMIN_STORE_SETTINGS);
}
