import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('banners'),
);

export default function BannersAdminPage() {
  return <AdminModulePage moduleId="banners" />;
}
