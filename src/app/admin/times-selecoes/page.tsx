import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('times-selecoes'),
);

export default function TimesSelecoesAdminPage() {
  return <AdminModulePage moduleId="times-selecoes" />;
}
