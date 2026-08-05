import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockTransfers = dynamic(
  () =>
    import('@presentation/components/admin/stock').then(
      (m) => m.StockTransfers,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Transferências',
  description: 'Transferências entre depósitos (em preparação).',
  path: '/admin/estoque/transferencias',
});

export default function EstoqueTransferenciasPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Transferências de Estoque',
            description: 'Transferências entre depósitos (em preparação).',
            path: '/admin/estoque/transferencias',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Transferências', path: '/admin/estoque/transferencias' },
          ]),
        ]}
      />
      <StockTransfers />
    </>
  );
}
