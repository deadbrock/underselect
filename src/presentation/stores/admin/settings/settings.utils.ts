import {
  DEFAULT_ADMIN_ACCESS_PROFILE,
  DEFAULT_ADMIN_STORE_SETTINGS,
} from '@shared/constants/admin-settings.constants';
import type {
  AdminAccessProfile,
  AdminStoreSettings,
} from '@shared/types/admin-settings.types';

export function getAvatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function mergeAccessProfile(
  partial?: Partial<AdminAccessProfile> | null,
): AdminAccessProfile {
  const name = partial?.name?.trim() || DEFAULT_ADMIN_ACCESS_PROFILE.name;

  return {
    id: partial?.id ?? 'default',
    role: partial?.role ?? DEFAULT_ADMIN_ACCESS_PROFILE.role,
    name,
    email: partial?.email?.trim() ?? DEFAULT_ADMIN_ACCESS_PROFILE.email,
    phone: partial?.phone?.trim() ?? DEFAULT_ADMIN_ACCESS_PROFILE.phone,
    avatarInitials: partial?.avatarInitials ?? getAvatarInitials(name),
  };
}

export function mergeStoreSettings(
  partial?: Partial<AdminStoreSettings> | null,
): AdminStoreSettings {
  return {
    ...DEFAULT_ADMIN_STORE_SETTINGS,
    ...partial,
  };
}
