import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const CouponFormPage = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.CouponFormPage,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Editar Cupom',
  description: 'Editar cupom UNDER SELECT.',
  path: '/admin/marketing/cupons/[id]/editar',
});

export default async function EditarCupomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CouponFormPage mode="edit" couponId={id} />;
}
