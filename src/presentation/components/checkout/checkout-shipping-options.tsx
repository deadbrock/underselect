'use client';

import { memo } from 'react';

import { FormSection } from '@presentation/components/forms';
import { useCartStore } from '@presentation/stores/cart';
import type { ShippingOption } from '@shared/types/cart.types';
import { cn } from '@shared/utils/cn';

export const CheckoutShippingOptions = memo(function CheckoutShippingOptions() {
  const shippingQuote = useCartStore((state) => state.shippingQuote);
  const selectShippingOption = useCartStore(
    (state) => state.selectShippingOption,
  );

  if (!shippingQuote) {
    return (
      <FormSection
        title="Método de entrega"
        description="Consulte o CEP para exibir as opções de frete."
      >
        <p className="text-muted-foreground border-border bg-muted/30 border border-dashed p-4 text-sm">
          Informe e consulte o CEP na seção Entrega para calcular o frete.
        </p>
      </FormSection>
    );
  }

  return (
    <FormSection
      title="Método de entrega"
      description="Escolha como deseja receber seu pedido."
    >
      <fieldset className="space-y-3">
        <legend className="sr-only">Opções de entrega</legend>
        {shippingQuote.options.map((option) => (
          <ShippingOptionCard
            key={option.id}
            option={option}
            selected={shippingQuote.selectedOptionId === option.id}
            onSelect={() => selectShippingOption(option.id)}
          />
        ))}
      </fieldset>
    </FormSection>
  );
});

function ShippingOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: ShippingOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'border-border hover:border-foreground/40 flex w-full items-center justify-between border p-4 text-left transition-all',
        selected && 'border-foreground bg-muted/30 ring-foreground/10 ring-1',
      )}
    >
      <span>
        <span className="block text-sm font-medium">{option.label}</span>
        <span className="text-muted-foreground text-xs">{option.days}</span>
      </span>
      <span className="text-sm font-medium tabular-nums">
        {option.price === 0
          ? 'Grátis'
          : new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(option.price)}
      </span>
    </button>
  );
}
