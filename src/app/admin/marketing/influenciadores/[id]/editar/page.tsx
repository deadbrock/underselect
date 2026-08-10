import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const InfluencerFormPage = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.InfluencerFormPage,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Editar Influenciador',
  description: 'Editar influenciador UNDER SELECT.',
  path: '/admin/marketing/influenciadores/[id]/editar',
});

export default async function EditarInfluenciadorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InfluencerFormPage mode="edit" influencerId={id} />;
}
