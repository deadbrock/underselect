import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('relatorios'),
);

export default function RelatoriosAdminPage() {
  return <AdminModulePage moduleId="relatorios" />;
}
