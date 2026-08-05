import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('configuracoes'),
);

export default function ConfiguracoesAdminPage() {
  return <AdminModulePage moduleId="configuracoes" />;
}
