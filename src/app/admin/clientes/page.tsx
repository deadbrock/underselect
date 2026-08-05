import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('clientes'),
);

export default function ClientesAdminPage() {
  return <AdminModulePage moduleId="clientes" />;
}
