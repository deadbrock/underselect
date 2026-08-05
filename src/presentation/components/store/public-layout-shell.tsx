import { Suspense } from 'react';

import { PublicFooter } from '@presentation/components/store/public-footer';
import { PublicHeader } from '@presentation/components/store/public-header';
import { CartDrawerHost } from '@presentation/components/checkout';
import { Spinner } from '@presentation/components/feedback';
import { JsonLd, createOrganizationSchema } from '@shared/seo';

interface PublicLayoutShellProps {
  children: React.ReactNode;
}

function HeaderFallback() {
  return (
    <div className="border-border bg-background h-[var(--header-height)] border-b" />
  );
}

export function PublicLayoutShell({ children }: PublicLayoutShellProps) {
  return (
    <>
      <JsonLd data={createOrganizationSchema()} />
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

export function PublicPageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
