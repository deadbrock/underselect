import { AdminDashboard } from '@presentation/components/admin';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';

export const metadata = createPrivatePageMetadata({
  title: 'Dashboard',
  description: 'Painel executivo UNDER SELECT.',
  path: '/admin/dashboard',
});

export default function AdminDashboardPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: 'Dashboard Admin',
            description: 'Dashboard administrativo UNDER SELECT.',
            path: '/admin/dashboard',
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: 'Dashboard', path: '/admin/dashboard' },
          ]),
        ]}
      />
      <AdminDashboard />
    </>
  );
}
