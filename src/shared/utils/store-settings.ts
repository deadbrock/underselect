import type { AdminStoreSettings } from '@shared/types/admin-settings.types';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function buildHomeBenefits(settings: AdminStoreSettings) {
  const shippingDescription =
    settings.freeShippingMinValue > 0
      ? `Frete grátis em compras acima de ${formatCurrency(settings.freeShippingMinValue)}.`
      : 'Consulte condições de entrega no checkout.';

  return [
    {
      id: 'returns',
      title: 'Troca de tamanho',
      description: 'Facilidade para trocar camisas que não serviram.',
    },
    {
      id: 'payment',
      title: 'Parcelamento',
      description: `Até ${settings.maxInstallments}x sem juros. ${shippingDescription}`,
    },
  ] as const;
}
