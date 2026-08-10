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
  title: 'Editar Campanha',
  description: 'Editar campanha UNDER SELECT.',
  path: '/admin/marketing/campanhas/[id]/editar',
});

export default async function EditarCampanhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignFormPage mode="edit" campaignId={id} />;
}
