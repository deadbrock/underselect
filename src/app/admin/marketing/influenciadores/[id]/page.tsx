import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const InfluencerDetail = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.InfluencerDetail,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Perfil do Influenciador',
  description: 'Detalhes do influenciador UNDER SELECT.',
  path: '/admin/marketing/influenciadores/[id]',
});

export default async function InfluenciadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InfluencerDetail influencerId={id} />;
}
