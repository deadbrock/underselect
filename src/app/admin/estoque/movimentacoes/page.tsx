import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockMovementsList = dynamic(
  () =>
    import('@presentation/components/admin/stock').then(
      (m) => m.StockMovementsList,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Movimentações',
  description: 'Histórico de movimentações de estoque.',
  path: '/admin/estoque/movimentacoes',
});

export default function EstoqueMovimentacoesPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Movimentações de Estoque',
            description: 'Histórico de movimentações de estoque.',
            path: '/admin/estoque/movimentacoes',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Movimentações', path: '/admin/estoque/movimentacoes' },
          ]),
        ]}
      />
      <StockMovementsList />
    </>
  );
}
