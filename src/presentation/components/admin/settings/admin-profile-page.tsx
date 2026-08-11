'use client';

import { memo, useEffect, useMemo, useState } from 'react';

import {
  Form,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { PageHeader } from '@presentation/components/layout';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { updateAdminProfileApi } from '@presentation/stores/admin/auth';
import {
  adminAccessProfileSchema,
  getAvatarInitials,
  useSettingsStore,
  type AdminAccessProfileSchema,
} from '@presentation/stores/admin/settings';
import { ADMIN_MODULE_META } from '@shared/constants/admin.constants';

import { AdminPasswordForm } from './admin-password-form';

export const AdminProfilePage = memo(function AdminProfilePage() {
  const meta = ADMIN_MODULE_META.perfil;
  const profile = useSettingsStore((s) => s.profile);
  const syncProfileFromSession = useSettingsStore(
    (s) => s.syncProfileFromSession,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm<AdminAccessProfileSchema>(adminAccessProfileSchema, {
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    },
  });

  useEffect(() => {
    form.reset({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    });
  }, [form, profile]);

  const roleLabel = profile.role === 'admin' ? 'Administrador' : profile.role;
  const watchedName = form.watch('name');
  const avatarInitials = useMemo(
    () => getAvatarInitials(watchedName || profile.name),
    [watchedName, profile.name],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const { user } = await updateAdminProfileApi({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });

      syncProfileFromSession({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        role: user.role,
        avatarInitials: getAvatarInitials(user.name),
      });

      toast.success('Perfil atualizado.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o perfil.',
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title={meta.title}
        description="Gerencie seus dados de acesso ao painel administrativo."
      />

      <Card className="max-w-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Perfil de acesso
          </CardTitle>
          <CardDescription>
            Dados exibidos no menu superior e vinculados à sua conta admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{watchedName || profile.name}</p>
              <p className="text-muted-foreground text-sm">{roleLabel}</p>
            </div>
          </div>

          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            <FormSection>
              <div className="grid gap-4">
                <FormInput name="name" label="Nome completo" />
                <FormInput name="email" label="E-mail de acesso" type="email" />
                <FormInput
                  name="phone"
                  label="Telefone (opcional)"
                  type="tel"
                  placeholder="(00) 00000-0000"
                />
                <div className="space-y-2">
                  <Label htmlFor="profile-role">Função</Label>
                  <Input
                    id="profile-role"
                    value={roleLabel}
                    readOnly
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </FormSection>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar perfil'}
            </Button>
          </Form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-medium">Segurança</CardTitle>
          <CardDescription>
            Altere sua senha de acesso. Todas as sessões ativas serão
            encerradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
});
