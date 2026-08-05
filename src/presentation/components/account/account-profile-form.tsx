'use client';

import { memo } from 'react';

import { Button, Checkbox, Label } from '@presentation/components/ui';
import {
  Form,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { toast } from '@presentation/hooks';
import {
  profileFormSchema,
  useAccountStore,
  type ProfileFormSchema,
} from '@presentation/stores/account';

import { AccountPageHeader } from './account-page-header';

export const AccountProfileForm = memo(function AccountProfileForm() {
  const user = useAccountStore((s) => s.user);
  const updateProfile = useAccountStore((s) => s.updateProfile);

  const form = useAppForm(profileFormSchema, {
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      cpf: user.cpf,
      phone: user.phone,
      birthDate: user.birthDate,
      email: user.email,
      marketingEmail: user.marketingEmail,
      marketingSms: user.marketingSms,
      newsletter: user.newsletter,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateProfile(data);
    toast.success('Dados pessoais salvos.');
  });

  return (
    <div className="max-w-2xl space-y-8">
      <AccountPageHeader
        title="Dados Pessoais"
        description="Mantenha suas informações atualizadas para uma experiência personalizada."
      />

      <Form form={form} onSubmit={onSubmit}>
        <FormSection title="Informações básicas">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput<ProfileFormSchema> name="firstName" label="Nome" />
            <FormInput<ProfileFormSchema> name="lastName" label="Sobrenome" />
          </div>
          <FormInput<ProfileFormSchema>
            name="cpf"
            label="CPF"
            inputMode="numeric"
          />
          <FormInput<ProfileFormSchema>
            name="phone"
            label="Telefone"
            type="tel"
          />
          <FormInput<ProfileFormSchema>
            name="birthDate"
            label="Data de nascimento"
            type="date"
          />
          <FormInput<ProfileFormSchema>
            name="email"
            label="E-mail"
            type="email"
          />
        </FormSection>

        <FormSection title="Preferências de comunicação">
          <PreferenceCheckbox
            id="marketingEmail"
            label="Receber ofertas por e-mail"
            checked={form.watch('marketingEmail')}
            onChange={(v) => form.setValue('marketingEmail', v)}
          />
          <PreferenceCheckbox
            id="marketingSms"
            label="Receber ofertas por SMS"
            checked={form.watch('marketingSms')}
            onChange={(v) => form.setValue('marketingSms', v)}
          />
          <PreferenceCheckbox
            id="newsletter"
            label="Assinar newsletter UNDER SELECT"
            checked={form.watch('newsletter')}
            onChange={(v) => form.setValue('newsletter', v)}
          />
        </FormSection>

        <Button type="submit" className="min-h-11 w-full sm:w-auto">
          Salvar alterações
        </Button>
      </Form>
    </div>
  );
});

function PreferenceCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}
