'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Loader2, Lock } from 'lucide-react';
import { memo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  Form,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { Container } from '@presentation/components/layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import {
  customerLoginApi,
  loginFormSchema,
  type LoginFormSchema,
} from '@presentation/stores/account';

export const AccountLoginForm = memo(function AccountLoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/minha-conta';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm<LoginFormSchema>(loginFormSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await customerLoginApi(values);
      toast.success('Login realizado com sucesso.');
      window.location.assign(redirectTo);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar na sua conta.',
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Container className="py-16 md:py-24">
      <Card className="mx-auto w-full max-w-md shadow-none">
        <CardHeader className="space-y-3 text-center">
          <div className="bg-brand-bronze/10 text-brand-bronze mx-auto flex size-12 items-center justify-center rounded-full">
            <Lock className="size-5" />
          </div>
          <CardTitle className="text-xl font-medium tracking-tight">
            Entrar na sua conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            <FormSection>
              <FormInput<LoginFormSchema>
                name="email"
                label="E-mail"
                type="email"
                autoComplete="username"
              />
              <FormInput<LoginFormSchema>
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

          <p className="text-muted-foreground mt-6 text-center text-sm">
            <Link
              href={'/' as Route}
              className="hover:text-foreground underline"
            >
              Voltar para a loja
            </Link>
          </p>
        </CardContent>
      </Card>
    </Container>
  );
});
