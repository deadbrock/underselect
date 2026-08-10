import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const CouponDetail = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.CouponDetail,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Detalhes do Cupom',
  description: 'Cupom UNDER SELECT.',
  path: '/admin/marketing/cupons/[id]',
});

export default async function CupomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CouponDetail couponId={id} />;
}
