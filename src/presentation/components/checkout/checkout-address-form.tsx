'use client';

import { Search } from 'lucide-react';
import { memo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@presentation/components/ui';
import { FormInput, FormSection } from '@presentation/components/forms';
import { toast } from '@presentation/hooks';
import { normalizeCep, useCartStore } from '@presentation/stores/cart';
import { fetchCepLookup } from '@presentation/stores/shipping/shipping.api';
import { type CheckoutFormSchema } from '@presentation/stores/checkout';

export interface CheckoutAddressFormProps {
  onCepResolved?: (cep: string) => void;
}

export const CheckoutAddressForm = memo(function CheckoutAddressForm({
  onCepResolved,
}: CheckoutAddressFormProps) {
  const { setValue, getValues } = useFormContext<CheckoutFormSchema>();
  const [isLookingUp, setIsLookingUp] = useState(false);
  const calculateShipping = useCartStore((state) => state.calculateShipping);
  const setShippingCep = useCartStore((state) => state.setShippingCep);

  const handleLookupCep = async () => {
    const cep = getValues('cep');
    const normalized = normalizeCep(cep);

    if (normalized.length !== 8) {
      toast.error('Informe um CEP válido com 8 dígitos.');
      return;
    }

    setIsLookingUp(true);

    try {
      const result = await fetchCepLookup(normalized);

      setValue('cep', normalized, { shouldValidate: true });
      setValue('street', result.street, { shouldValidate: true });
      setValue('neighborhood', result.neighborhood, { shouldValidate: true });
      setValue('city', result.city, { shouldValidate: true });
      setValue('state', result.state, { shouldValidate: true });
      if (result.complement) {
        setValue('complement', result.complement, { shouldValidate: true });
      }

      setShippingCep(normalized);

      try {
        await calculateShipping(normalized);
        toast.success('Endereço e frete atualizados.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Endereço encontrado, mas não foi possível calcular o frete.',
        );
      }

      onCepResolved?.(normalized);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'CEP não encontrado.',
      );
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <FormSection
      title="Entrega"
      description="Informe o endereço de entrega. O CEP é consultado automaticamente."
    >
      <div className="flex gap-2">
        <FormInput<CheckoutFormSchema>
          name="cep"
          label="CEP"
          inputMode="numeric"
          placeholder="00000-000"
          autoComplete="postal-code"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          className="mt-7 shrink-0"
          onClick={handleLookupCep}
          disabled={isLookingUp}
          aria-label="Consultar CEP"
        >
          <Search className="mr-2 size-4" aria-hidden />
          Consultar
        </Button>
      </div>

      <FormInput<CheckoutFormSchema>
        name="street"
        label="Rua"
        autoComplete="address-line1"
        placeholder="Nome da rua"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput<CheckoutFormSchema>
          name="number"
          label="Número"
          placeholder="123"
        />
        <FormInput<CheckoutFormSchema>
          name="complement"
          label="Complemento"
          placeholder="Apto, bloco (opcional)"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput<CheckoutFormSchema>
          name="neighborhood"
          label="Bairro"
          placeholder="Bairro"
        />
        <FormInput<CheckoutFormSchema>
          name="city"
          label="Cidade"
          autoComplete="address-level2"
          placeholder="Cidade"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput<CheckoutFormSchema>
          name="state"
          label="Estado"
          placeholder="SP"
          maxLength={2}
        />
        <FormInput<CheckoutFormSchema>
          name="reference"
          label="Referência"
          placeholder="Ponto de referência (opcional)"
        />
      </div>
    </FormSection>
  );
});
