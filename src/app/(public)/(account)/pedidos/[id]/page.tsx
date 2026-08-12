import { notFound, redirect } from 'next/navigation';

import { getCustomerSessionUser } from '@application/services';
import { AccountOrderDetail } from '@presentation/components/account';
import { getCustomerOrderById } from '@infrastructure/database/repositories/order.repository';
import { dynamic } from '@shared/config/data-page.config';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export { dynamic };

interface PedidoDetalhePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PedidoDetalhePageProps) {
  const user = await getCustomerSessionUser();
  if (!user) {
    return createPrivatePageMetadata({
      title: 'Pedido',
      description: 'Pedido UNDER SELECT.',
      path: '/pedidos',
    });
  }

  const { id } = await params;
  const order = await getCustomerOrderById(user.id, id);

  if (!order) {
    return createPrivatePageMetadata({
      title: 'Pedido não encontrado',
      description: 'Pedido UNDER SELECT.',
      path: `/pedidos/${id}`,
    });
  }

  return createPrivatePageMetadata({
    title: `Pedido ${order.number}`,
    description: `Detalhes do pedido ${order.number} na UNDER SELECT.`,
    path: `/pedidos/${id}`,
  });
}

export default async function PedidoDetalhePage({
  params,
}: PedidoDetalhePageProps) {
  const user = await getCustomerSessionUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const order = await getCustomerOrderById(user.id, id);
  if (!order) notFound();

  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: `Pedido ${order.number}`,
            description: 'Detalhes do pedido UNDER SELECT.',
            path: `/pedidos/${id}`,
          }),
          createBreadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Minha Conta', path: '/minha-conta' },
            { name: 'Pedidos', path: '/pedidos' },
            { name: order.number, path: `/pedidos/${id}` },
          ]),
        ]}
      />
      <AccountOrderDetail order={order} />
    </>
  );
}
