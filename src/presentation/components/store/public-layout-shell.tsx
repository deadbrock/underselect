'use client';

import { Suspense } from 'react';

import { CartDrawerHost } from '@presentation/components/checkout';
import { Spinner } from '@presentation/components/feedback';
import { MaintenancePage } from '@presentation/components/store/maintenance-page';
import { PublicFooter } from '@presentation/components/store/public-footer';
import { PublicHeader } from '@presentation/components/store/public-header';
import {
  StoreSettingsProvider,
  useStoreSettings,
} from '@presentation/contexts/store-settings-context';
import { JsonLd, createOrganizationSchema } from '@shared/seo';
import type { AdminStoreSettings } from '@shared/types/admin-settings.types';

interface PublicLayoutShellProps {
  children: React.ReactNode;
  settings: AdminStoreSettings;
}

function HeaderFallback() {
  return (
    <div className="border-border bg-background h-[var(--header-height)] border-b" />
  );
}

function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const settings = useStoreSettings();

  if (settings.maintenanceMode) {
    return (
      <>
        <JsonLd
          data={createOrganizationSchema({
            name: settings.storeName,
            instagramUrl: settings.instagramUrl,
          })}
        />
        <div className="flex min-h-screen flex-col">
          <MaintenancePage />
        </div>
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={createOrganizationSchema({
          name: settings.storeName,
          instagramUrl: settings.instagramUrl,
        })}
      />
      <div className="flex min-h-screen flex-col">
        <Suspense fallback={<HeaderFallback />}>
          <PublicHeader />
        </Suspense>
        <CartDrawerHost />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </>
  );
}

export function PublicLayoutShell({
  children,
  settings,
}: PublicLayoutShellProps) {
  return (
    <StoreSettingsProvider settings={settings}>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </StoreSettingsProvider>
  );
}

export function PublicPageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
