'use client';

import { Search } from 'lucide-react';
import { memo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button, Checkbox, Label } from '@presentation/components/ui';
import { FormInput, FormSection } from '@presentation/components/forms';
import { toast } from '@presentation/hooks';
import { normalizeCep } from '@presentation/stores/cart';
import { fetchCepLookup } from '@presentation/stores/shipping/shipping.api';
import type { AddressFormSchema } from '@presentation/stores/account';

export const AccountAddressForm = memo(function AccountAddressForm() {
  const { setValue, getValues, watch } = useFormContext<AddressFormSchema>();
  const [isLookingUp, setIsLookingUp] = useState(false);
  const isDefault = watch('isDefault');

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

      toast.success('Endereço preenchido automaticamente.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'CEP não encontrado.',
      );
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <FormSection title="Endereço" description="Preencha os dados de entrega.">
      <FormInput<AddressFormSchema>
        name="label"
        label="Identificação"
        placeholder="Casa, Trabalho..."
      />

      <div className="flex gap-2">
        <FormInput<AddressFormSchema>
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

      <FormInput<AddressFormSchema>
        name="street"
        label="Rua"
        placeholder="Rua"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput<AddressFormSchema> name="number" label="Número" />
        <FormInput<AddressFormSchema>
          name="complement"
          label="Complemento"
          placeholder="Opcional"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput<AddressFormSchema> name="neighborhood" label="Bairro" />
        <FormInput<AddressFormSchema>
          name="city"
          label="Cidade"
          autoComplete="address-level2"
        />
      </div>
      <FormInput<AddressFormSchema>
        name="state"
        label="Estado"
        placeholder="SP"
        maxLength={2}
        autoComplete="address-level1"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        className="uppercase"
        valueTransform={(value) =>
          value.replace(/[^a-zA-Z]/g, '').toUpperCase()
        }
      />
      <FormInput<AddressFormSchema>
        name="reference"
        label="Referência"
        placeholder="Opcional"
      />

      <div className="flex items-start gap-3">
        <Checkbox
          id="address-default"
          checked={isDefault ?? false}
          onCheckedChange={(checked) => setValue('isDefault', checked === true)}
        />
        <Label htmlFor="address-default" className="text-sm font-normal">
          Definir como endereço principal
        </Label>
      </div>
    </FormSection>
  );
});
