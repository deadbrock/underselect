'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Loader2, Lock } from 'lucide-react';
import { memo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Form,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { adminLoginApi } from '@presentation/stores/admin/auth';
import {
  adminLoginSchema,
  type AdminLoginSchema,
} from '@presentation/stores/admin/settings';

export const AdminLoginForm = memo(function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/admin/dashboard';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm<AdminLoginSchema>(adminLoginSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await adminLoginApi(values);
      toast.success('Login realizado com sucesso.');
      router.replace(redirectTo as Route);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar no painel.',
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="w-full max-w-md shadow-none">
      <CardHeader className="space-y-3 text-center">
        <div className="bg-brand-bronze/10 text-brand-bronze mx-auto flex size-12 items-center justify-center rounded-full">
          <Lock className="size-5" />
        </div>
        <CardTitle className="text-xl font-medium tracking-tight">
          Painel administrativo
        </CardTitle>
        <CardDescription>
          Acesse com suas credenciais para gerenciar a UNDER SELECT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={onSubmit} className="space-y-6">
          <FormSection>
            <FormInput<AdminLoginSchema>
              name="email"
              label="E-mail"
              type="email"
              autoComplete="username"
            />
            <FormInput<AdminLoginSchema>
              name="password"
              label="Senha"
              type="password"
              autoComplete="current-password"
            />
          </FormSection>

          <Button
            type="submit"
            variant="bronze"
            className="min-h-11 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </Form>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          <Link href={'/' as Route} className="hover:text-foreground underline">
            Voltar para a loja
          </Link>
        </p>
      </CardContent>
    </Card>
  );
});
