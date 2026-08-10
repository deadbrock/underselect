import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const CampaignFormPage = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.CampaignFormPage,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Nova Campanha',
  description: 'Criar campanha UNDER SELECT.',
  path: '/admin/marketing/campanhas/novo',
});

export default function NovaCampanhaPage() {
  return <CampaignFormPage mode="create" />;
}
