import { AccountDashboard } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Minha Conta',
  description: 'Gerencie seus dados, pedidos e preferências na UNDER SELECT.',
  path: '/minha-conta',
});

export default function MinhaContaPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Minha Conta',
            description: 'Área do cliente UNDER SELECT.',
            path: '/minha-conta',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
          ]),
        ]}
      />
      <AccountDashboard />
    </>
  );
}
