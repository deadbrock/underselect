import { AdminTaxonomyList } from '@presentation/components/admin/admin-taxonomy-list';
import { createAdminModuleMetadata } from '@presentation/components/admin/admin-module-page';
import { createPrivatePageMetadata } from '@shared/seo';

export const metadata = createPrivatePageMetadata(
  createAdminModuleMetadata('times-selecoes'),
);

export default function TimesSelecoesAdminPage() {
  return (
    <div className="space-y-10">
      <AdminTaxonomyList
        title="Times"
        description="Cadastre os times disponíveis na classificação de produtos."
        endpoint="/api/admin/teams"
        nameLabel="Time"
      />
      <AdminTaxonomyList
        title="Seleções"
        description="Cadastre as seleções disponíveis na classificação de produtos."
        endpoint="/api/admin/selections"
        nameLabel="Seleção"
        showPageHeader={false}
      />
    </div>
  );
}
