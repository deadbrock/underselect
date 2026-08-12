import { Suspense } from 'react';

import { AccountLoginForm } from '@presentation/components/account/account-login-form';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Login',
  description: 'Acesse sua conta UNDER SELECT.',
  path: '/login',
});

export default function LoginPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Login',
            description: 'Login UNDER SELECT.',
            path: '/login',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Login', path: '/login' },
          ]),
        ]}
      />
      <Suspense
        fallback={
          <div className="text-muted-foreground py-24 text-center text-sm">
            Carregando...
          </div>
        }
      >
        <AccountLoginForm />
      </Suspense>
    </>
  );
}
