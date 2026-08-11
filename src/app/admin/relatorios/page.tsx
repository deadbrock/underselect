import { redirect } from 'next/navigation';

import { createAdminModuleMetadata } from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('relatorios'),
);

export default function RelatoriosAdminPage() {
  redirect('/admin/estoque/relatorios');
}
