'use client';

import { memo, useState } from 'react';

import { Button, Input, Label } from '@presentation/components/ui';
import {
  formatCep,
  normalizeCep,
  useCartStore,
} from '@presentation/stores/cart';
import type { ShippingQuote } from '@shared/types/cart.types';
import { cn } from '@shared/utils/cn';

export interface CartShippingFormProps {
  cep: string;
  quote: ShippingQuote | null;
  onCepChange: (cep: string) => void;
  onCalculate: (cep: string) => Promise<void>;
  onSelectOption: (optionId: string) => void;
  className?: string;
}

const CartShippingForm = memo(function CartShippingForm({
  cep,
  quote,
  onCepChange,
  onCalculate,
  onSelectOption,
  className,
}: CartShippingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const shippingLoading = useCartStore((state) => state.shippingLoading);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = normalizeCep(cep);
    if (normalized.length !== 8) {
      setError('Informe um CEP válido com 8 dígitos.');
      return;
    }

    setError(null);

    try {
      await onCalculate(normalized);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível calcular o frete.',
      );
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Label htmlFor="cart-cep">Calcular frete</Label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          id="cart-cep"
          inputMode="numeric"
          value={formatCep(cep)}
          onChange={(e) => onCepChange(e.target.value)}
          placeholder="00000-000"
          aria-describedby={error ? 'shipping-error' : undefined}
        />
        <Button type="submit" variant="outline" disabled={shippingLoading}>
          {shippingLoading ? 'Calculando...' : 'Calcular'}
        </Button>
      </form>

      {error && (
        <p
          id="shipping-error"
          className="text-destructive text-sm"
          role="alert"
        >
          {error}
        </p>
      )}

      {quote && (
        <fieldset className="space-y-2">
          <legend className="text-label mb-2">Opções de entrega</legend>
          {quote.originCity && quote.originState ? (
            <p className="text-muted-foreground mb-2 text-xs">
              Envio de {quote.originCity}/{quote.originState}
            </p>
          ) : null}
          {quote.options.map((option) => (
            <label
              key={option.id}
              className={cn(
                'border-border flex cursor-pointer items-center justify-between border p-3 transition-colors',
                quote.selectedOptionId === option.id &&
                  'border-foreground bg-muted/30',
              )}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping-option"
                  checked={quote.selectedOptionId === option.id}
                  onChange={() => onSelectOption(option.id)}
                  className="accent-foreground"
                />
                <span>
                  <span className="block text-sm font-medium">
                    {option.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {option.days}
                  </span>
                </span>
              </span>
              <span className="text-sm tabular-nums">
                {option.price === 0
                  ? 'Grátis'
                  : new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(option.price)}
              </span>
            </label>
          ))}
        </fieldset>
      )}

      {!quote && !shippingLoading && (
        <p className="text-muted-foreground text-xs">
          Informe seu CEP para ver prazos e valores de entrega a partir do
          endereço de origem da loja.
        </p>
      )}
    </div>
  );
});

export { CartShippingForm };
