import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const OrderList = dynamic(
  () => import('@presentation/components/admin/order').then((m) => m.OrderList),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Pedidos — Listagem',
  description: 'Listagem completa de pedidos.',
  path: '/admin/pedidos/lista',
});

export default function PedidosListaPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Todos os Pedidos',
            description: 'Listagem completa de pedidos.',
            path: '/admin/pedidos/lista',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Pedidos', path: '/admin/pedidos' },
            { name: 'Todos os Pedidos', path: '/admin/pedidos/lista' },
          ]),
        ]}
      />
      <OrderList />
    </>
  );
}
