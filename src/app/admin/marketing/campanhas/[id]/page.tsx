import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const CampaignDetail = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.CampaignDetail,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Detalhes da Campanha',
  description: 'Campanha UNDER SELECT.',
  path: '/admin/marketing/campanhas/[id]',
});

export default async function CampanhaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignDetail campaignId={id} />;
}
