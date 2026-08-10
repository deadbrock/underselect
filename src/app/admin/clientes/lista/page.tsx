import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

const CustomerList = dynamic(
  () =>
    import('@presentation/components/admin/customer').then(
      (m) => m.CustomerList,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Clientes — Listagem',
  description: 'Listagem completa de clientes.',
  path: '/admin/clientes/lista',
});

export default function ClientesListaPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Todos os Clientes',
            description: 'Listagem CRM de clientes.',
            path: '/admin/clientes/lista',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Clientes', path: '/admin/clientes' },
            { name: 'Todos os Clientes', path: '/admin/clientes/lista' },
          ]),
        ]}
      />
      <CustomerList />
    </>
  );
}
