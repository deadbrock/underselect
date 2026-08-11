'use client';

import { memo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';

import {
  Form,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { Button } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { changeAdminPasswordApi } from '@presentation/stores/admin/auth';
import {
  adminChangePasswordSchema,
  type AdminChangePasswordSchema,
} from '@presentation/stores/admin/settings';

export const AdminPasswordForm = memo(function AdminPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm<AdminChangePasswordSchema>(
    adminChangePasswordSchema,
    {
      defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    },
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const result = await changeAdminPasswordApi(values);
      toast.success('Senha atualizada. Faça login novamente.');
      form.reset();

      if (result.requiresLogin) {
        router.replace('/admin/login' as Route);
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
    <Form form={form} onSubmit={onSubmit} className="space-y-6">
      <FormSection>
        <FormInput<AdminChangePasswordSchema>
          name="currentPassword"
          label="Senha atual"
          type="password"
          autoComplete="current-password"
        />
        <FormInput<AdminChangePasswordSchema>
          name="newPassword"
          label="Nova senha"
          type="password"
          autoComplete="new-password"
        />
        <FormInput<AdminChangePasswordSchema>
          name="confirmPassword"
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
        />
      </FormSection>

      <p className="text-muted-foreground text-xs">
        Use no mínimo 8 caracteres, incluindo letras e números. Por segurança,
        todas as sessões serão encerradas após a alteração.
      </p>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Atualizando...' : 'Atualizar senha'}
      </Button>
    </Form>
  );
});
