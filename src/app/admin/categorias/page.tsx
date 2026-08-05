import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('categorias'),
);

export default function CategoriasAdminPage() {
  return <AdminModulePage moduleId="categorias" />;
}
