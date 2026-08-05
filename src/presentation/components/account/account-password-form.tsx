'use client';

import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import {
  Form,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { toast } from '@presentation/hooks';
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from '@presentation/stores/account';

import { AccountPageHeader } from './account-page-header';

export const AccountPasswordForm = memo(function AccountPasswordForm() {
  const form = useAppForm(changePasswordSchema, {
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success('Senha alterada (mock). Integração com backend preparada.');
    form.reset();
  });

  return (
    <div className="max-w-md space-y-8">
      <AccountPageHeader
        title="Alterar Senha"
        description="Use uma senha forte com no mínimo 8 caracteres."
      />

      <Form form={form} onSubmit={onSubmit}>
        <FormSection>
          <FormInput<ChangePasswordSchema>
            name="currentPassword"
            label="Senha atual"
            type="password"
            autoComplete="current-password"
          />
          <FormInput<ChangePasswordSchema>
            name="newPassword"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
          />
          <FormInput<ChangePasswordSchema>
            name="confirmPassword"
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
          />
        </FormSection>

        <Button type="submit" className="min-h-11 w-full sm:w-auto">
          Atualizar senha
        </Button>
      </Form>
    </div>
  );
});
