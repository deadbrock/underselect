'use client';

import { memo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';

import { Button } from '@presentation/components/ui';
import {
  Form,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { toast } from '@presentation/hooks';
import {
  changeCustomerPasswordApi,
  changePasswordSchema,
  type ChangePasswordSchema,
} from '@presentation/stores/account';

import { AccountPageHeader } from './account-page-header';

export const AccountPasswordForm = memo(function AccountPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm(changePasswordSchema, {
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const result = await changeCustomerPasswordApi(values);
      toast.success('Senha atualizada. Faça login novamente.');
      form.reset();

      if (result.requiresLogin) {
        router.replace('/login' as Route);
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível alterar a senha.',
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="max-w-md space-y-8">
      <AccountPageHeader
        title="Alterar Senha"
        description="Use uma senha forte com no mínimo 8 caracteres, incluindo letras e números."
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

        <Button
          type="submit"
          className="min-h-11 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Atualizando...' : 'Atualizar senha'}
        </Button>
      </Form>
    </div>
  );
});
