import { AdminTaxonomyList } from '@presentation/components/admin/admin-taxonomy-list';
import { createAdminModuleMetadata } from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('colecoes'),
);

export default function ColecoesAdminPage() {
  return (
    <AdminTaxonomyList
      title="Coleções"
      description="Organize produtos em coleções sazonais e campanhas."
      endpoint="/api/admin/collections"
      nameLabel="Coleção"
    />
  );
}
