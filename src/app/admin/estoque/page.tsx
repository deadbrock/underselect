import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const StockDashboard = dynamic(
  () =>
    import('@presentation/components/admin/stock').then(
      (m) => m.StockDashboard,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Estoque — Resumo',
  description: 'Dashboard de gestão de estoque UNDER SELECT.',
  path: '/admin/estoque',
});

export default function EstoqueDashboardPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Resumo do Estoque',
            description: 'Dashboard WMS UNDER SELECT.',
            path: '/admin/estoque',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Estoque', path: '/admin/estoque' },
          ]),
        ]}
      />
      <StockDashboard />
    </>
  );
}
