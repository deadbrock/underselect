import {
  AdminModulePage,
  createAdminModuleMetadata,
} from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('influenciadores'),
);

export default function InfluenciadoresAdminPage() {
  return <AdminModulePage moduleId="influenciadores" />;
}
