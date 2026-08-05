import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('colecoes'),
);

export default function ColecoesAdminPage() {
  return <AdminModulePage moduleId="colecoes" />;
}
