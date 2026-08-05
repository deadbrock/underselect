'use client';

import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Checkbox, Label } from '@presentation/components/ui';
import { FormInput, FormSection } from '@presentation/components/forms';
import type { CheckoutFormSchema } from '@presentation/stores/checkout';

export const CheckoutCustomerForm = memo(function CheckoutCustomerForm() {
  const { watch, setValue } = useFormContext<CheckoutFormSchema>();
  const createAccount = watch('createAccount');

  return (
    <FormSection
      title="Identificação"
      description="Informe seus dados para acompanhar o pedido."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput<CheckoutFormSchema>
          name="firstName"
          label="Nome"
          autoComplete="given-name"
          placeholder="Seu nome"
        />
        <FormInput<CheckoutFormSchema>
          name="lastName"
          label="Sobrenome"
          autoComplete="family-name"
          placeholder="Seu sobrenome"
        />
      </div>

      <FormInput<CheckoutFormSchema>
        name="cpf"
        label="CPF"
        inputMode="numeric"
        placeholder="000.000.000-00"
        autoComplete="off"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput<CheckoutFormSchema>
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
        />
        <FormInput<CheckoutFormSchema>
          name="phone"
          label="Telefone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
        />
      </div>

      <div className="flex items-start gap-3 pt-2">
        <Checkbox
          id="createAccount"
          checked={createAccount}
          onCheckedChange={(checked) =>
            setValue('createAccount', checked === true)
          }
          aria-describedby="create-account-help"
        />
        <div className="space-y-1">
          <Label htmlFor="createAccount" className="text-sm font-normal">
            Criar conta automaticamente após a compra
          </Label>
          <p id="create-account-help" className="text-muted-foreground text-xs">
            Estrutura preparada — você receberá acesso por e-mail na próxima
            fase.
          </p>
        </div>
      </div>
    </FormSection>
  );
});
