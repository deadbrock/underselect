import dynamic from 'next/dynamic';
import {
  JsonLd,
  createPrivatePageMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';
import { ADMIN_MODULE_META } from '@shared/constants/admin.constants';

const AdminSettingsPage = dynamic(
  () =>
    import('@presentation/components/admin/settings').then(
      (m) => m.AdminSettingsPage,
    ),
  { loading: () => null },
);

const meta = ADMIN_MODULE_META.configuracoes;

export const metadata = createPrivatePageMetadata({
  title: meta.title,
  description: meta.description,
  path: meta.path,
});

export default function ConfiguracoesAdminPage() {
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
      <AdminSettingsPage />
    </>
  );
}
