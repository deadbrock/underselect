import { notFound } from 'next/navigation';

import { AccountOrderDetail } from '@presentation/components/account';
import { getAllOrderIds, getOrderById } from '@shared/data/account.data';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

interface PedidoDetalhePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllOrderIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PedidoDetalhePageProps) {
  const { id } = await params;
  const order = getOrderById(id);

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
  const { id } = await params;
  const order = getOrderById(id);

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
