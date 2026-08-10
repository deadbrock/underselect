'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { PageHeader } from '@presentation/components/layout';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import {
  influencerFormSchema,
  useMarketingStore,
  type InfluencerFormValues,
} from '@presentation/stores/admin/marketing';
import { ADMIN_INFLUENCER_STATUS_LABELS } from '@shared/constants/marketing-admin.constants';
import type { AdminInfluencer } from '@shared/types/marketing-admin.types';

function toFormValues(inf?: AdminInfluencer): InfluencerFormValues {
  return {
    name: inf?.name ?? '',
    username: inf?.username ?? '',
    email: inf?.email ?? '',
    phone: inf?.phone ?? '',
    instagram: inf?.instagram ?? '',
    tiktok: inf?.tiktok ?? '',
    youtube: inf?.youtube ?? '',
    identifierCode: inf?.identifierCode ?? '',
    status: inf?.status ?? 'active',
    notes: inf?.notes ?? '',
  };
}

export interface InfluencerFormPageProps {
  mode: 'create' | 'edit';
  influencerId?: string;
}

export const InfluencerFormPage = memo(function InfluencerFormPage({
  mode,
  influencerId,
}: InfluencerFormPageProps) {
  const router = useRouter();
  const influencer = useMarketingStore((s) =>
    influencerId ? s.getInfluencerById(influencerId) : undefined,
  );
  const createInfluencer = useMarketingStore((s) => s.createInfluencer);
  const updateInfluencer = useMarketingStore((s) => s.updateInfluencer);

  const form = useForm<InfluencerFormValues>({
    resolver: zodResolver(influencerFormSchema),
    defaultValues: toFormValues(influencer),
  });

  const onSubmit = useCallback(
    (values: InfluencerFormValues) => {
      const input = {
        ...values,
        identifierCode: values.identifierCode.toUpperCase(),
      };
      if (mode === 'create') {
        const created = createInfluencer(input);
        toast.success('Influenciador cadastrado.');
        router.push(`/admin/marketing/influenciadores/${created.id}`);
        return;
      }
      if (influencerId) {
        updateInfluencer(influencerId, input);
        toast.success('Influenciador atualizado.');
        router.push(`/admin/marketing/influenciadores/${influencerId}`);
      }
    },
    [mode, createInfluencer, updateInfluencer, influencerId, router],
  );

  if (mode === 'edit' && influencerId && !influencer) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Influenciador não encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/marketing/influenciadores">Voltar</Link>
        </Button>
      </div>
    );
  }

  const { register, handleSubmit, setValue, watch, formState } = form;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={
          mode === 'create' ? 'Novo influenciador' : 'Editar influenciador'
        }
        description="Cadastro de parceiro — sem acesso ao painel."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" error={formState.errors.name?.message}>
            <Input {...register('name')} aria-required />
          </Field>
          <Field label="Usuário" error={formState.errors.username?.message}>
            <Input {...register('username')} placeholder="@usuario" />
          </Field>
          <Field label="E-mail" error={formState.errors.email?.message}>
            <Input type="email" {...register('email')} />
          </Field>
          <Field label="Telefone" error={formState.errors.phone?.message}>
            <Input {...register('phone')} />
          </Field>
          <Field label="Instagram">
            <Input {...register('instagram')} placeholder="@instagram" />
          </Field>
          <Field label="TikTok">
            <Input {...register('tiktok')} placeholder="@tiktok" />
          </Field>
          <Field label="YouTube">
            <Input {...register('youtube')} placeholder="@youtube" />
          </Field>
          <Field
            label="Código identificador"
            error={formState.errors.identifierCode?.message}
          >
            <Input
              {...register('identifierCode')}
              className="uppercase"
              placeholder="DOUGLAS20"
            />
          </Field>
          <Field label="Status">
            <Select
              value={watch('status')}
              onValueChange={(v) =>
                setValue('status', v as InfluencerFormValues['status'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ADMIN_INFLUENCER_STATUS_LABELS).map(
                  ([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Observações">
          <Textarea {...register('notes')} rows={3} />
        </Field>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="min-h-11 flex-1">
            {mode === 'create' ? 'Cadastrar' : 'Salvar'}
          </Button>
          <Button type="button" variant="outline" className="min-h-11" asChild>
            <Link href="/admin/marketing/influenciadores">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  );
});

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
