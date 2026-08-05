import { AdminModuleList } from '@presentation/components/admin';
import { ADMIN_MODULE_META } from '@shared/constants/admin.constants';
import {
  JsonLd,
  createWebPageSchema,
  createBreadcrumbSchema,
} from '@shared/seo';
import type { AdminModuleId } from '@shared/types/admin.types';

export interface AdminModulePageProps {
  moduleId: AdminModuleId;
}

export function AdminModulePage({ moduleId }: AdminModulePageProps) {
  const meta = ADMIN_MODULE_META[moduleId];

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
      <AdminModuleList moduleId={moduleId} />
    </>
  );
}

export function createAdminModuleMetadata(moduleId: AdminModuleId) {
  const meta = ADMIN_MODULE_META[moduleId];
  return {
    title: meta.title,
    description: meta.description,
    path: meta.path,
  };
}
