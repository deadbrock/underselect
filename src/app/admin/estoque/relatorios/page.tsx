import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockReports = dynamic(
  () =>
    import('@presentation/components/admin/stock').then((m) => m.StockReports),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Relatórios',
  description: 'Relatórios e gráficos de estoque.',
  path: '/admin/estoque/relatorios',
});

export default function EstoqueRelatoriosPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Relatórios de Estoque',
            description: 'Relatórios e gráficos de estoque.',
            path: '/admin/estoque/relatorios',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
            { name: 'Relatórios', path: '/admin/estoque/relatorios' },
          ]),
        ]}
      />
      <StockReports />
    </>
  );
}
