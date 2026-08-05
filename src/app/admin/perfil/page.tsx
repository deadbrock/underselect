import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('perfil'),
);

export default function PerfilAdminPage() {
  return <AdminModulePage moduleId="perfil" />;
}
