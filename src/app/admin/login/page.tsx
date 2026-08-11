import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AdminLoginForm } from '@presentation/components/admin/auth';

export const metadata: Metadata = {
  title: 'Login — Admin UNDER SELECT',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-muted-foreground text-sm">Carregando...</div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
