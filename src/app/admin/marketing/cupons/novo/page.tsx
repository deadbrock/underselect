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
  title: 'Novo Cupom',
  description: 'Criar cupom UNDER SELECT.',
  path: '/admin/marketing/cupons/novo',
});

export default function NovoCupomPage() {
  return <CouponFormPage mode="create" />;
}
