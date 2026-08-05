import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('campanhas'),
);

export default function CampanhasAdminPage() {
  return <AdminModulePage moduleId="campanhas" />;
}
