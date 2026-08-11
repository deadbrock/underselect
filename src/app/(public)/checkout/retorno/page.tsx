import { Suspense } from 'react';

import { CheckoutReturnExperience } from '@presentation/components/checkout/checkout-return-experience';

export default function CheckoutReturnPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Carregando...</div>}>
      <CheckoutReturnExperience />
    </Suspense>
  );
}
