import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('cupons'),
);

export default function CuponsAdminPage() {
  return <AdminModulePage moduleId="cupons" />;
}
