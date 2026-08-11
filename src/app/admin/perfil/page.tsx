import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';
import { ADMIN_MODULE_META } from '@shared/constants/admin.constants';

const AdminProfilePage = dynamic(
  () =>
    import('@presentation/components/admin/settings').then(
      (m) => m.AdminProfilePage,
    ),
  { loading: () => null },
);

const meta = ADMIN_MODULE_META.perfil;

export const metadata = createPrivatePageMetadata({
  title: meta.title,
  description: meta.description,
  path: meta.path,
});

export default function PerfilAdminPage() {
  return (
    <>
      <JsonLd
        data={[
          createWebPageSchema({
            name: meta.title,
            description: meta.description,
            path: meta.path,
          }),
          createBreadcrumbSchema([
            { name: 'Admin', path: '/admin/dashboard' },
            { name: meta.title, path: meta.path },
          ]),
        ]}
      />
      <AdminProfilePage />
    </>
  );
}
