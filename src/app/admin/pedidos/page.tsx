import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const OrderDashboard = dynamic(
  () =>
    import('@presentation/components/admin/order').then(
      (m) => m.OrderDashboard,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Pedidos — Resumo',
  description: 'Dashboard OMS UNDER SELECT.',
  path: '/admin/pedidos',
});

export default function PedidosDashboardPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Resumo de Pedidos',
            description: 'Dashboard OMS UNDER SELECT.',
            path: '/admin/pedidos',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Pedidos', path: '/admin/pedidos' },
          ]),
        ]}
      />
      <OrderDashboard />
    </>
  );
}
