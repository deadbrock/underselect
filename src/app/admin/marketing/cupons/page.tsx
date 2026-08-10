import dynamic from 'next/dynamic';
import { createPrivatePageMetadata } from '@shared/seo';

const CouponList = dynamic(
  () =>
    import('@presentation/components/admin/marketing').then(
      (m) => m.CouponList,
    ),
  { loading: () => null },
);

export const metadata = createPrivatePageMetadata({
  title: 'Cupons',
  description: 'Cupons de desconto UNDER SELECT.',
  path: '/admin/marketing/cupons',
});

export default function CuponsPage() {
  return <CouponList />;
}
