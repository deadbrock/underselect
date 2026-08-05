import { AccountOrdersList } from '@presentation/components/account';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Meus Pedidos',
  description: 'Acompanhe o histórico e status dos seus pedidos UNDER SELECT.',
  path: '/pedidos',
});

export default function PedidosPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Meus Pedidos',
            description: 'Histórico de pedidos UNDER SELECT.',
            path: '/pedidos',
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Pedidos', path: '/pedidos' },
          ]),
        ]}
      />
      <AccountOrdersList />
    </>
  );
}
