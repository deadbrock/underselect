import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const CustomerDashboard = dynamic(
  () =>
    import('@presentation/components/admin/customer').then(
      (m) => m.CustomerDashboard,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Clientes — Resumo',
  description: 'Dashboard CRM UNDER SELECT.',
  path: '/admin/clientes',
});

export default function ClientesDashboardPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Resumo de Clientes',
            description: 'Dashboard CRM UNDER SELECT.',
            path: '/admin/clientes',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Clientes', path: '/admin/clientes' },
          ]),
        ]}
      />
      <CustomerDashboard />
    </>
  );
}
