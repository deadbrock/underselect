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
  normalizeAlphanumericCode,
  useMarketingStore,
  type InfluencerFormValues,
} from '@presentation/stores/admin/marketing';
import { ADMIN_INFLUENCER_STATUS_LABELS } from '@shared/constants/marketing-admin.constants';
import type { AdminInfluencer } from '@shared/types/marketing-admin.types';

import { MarketingFormField } from './marketing-form-field';

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
    async (values: InfluencerFormValues) => {
      const input = {
        ...values,
        identifierCode: values.identifierCode.toUpperCase(),
      };
      try {
        if (mode === 'create') {
          const created = await createInfluencer(input);
          toast.success('Influenciador cadastrado.');
          router.push(`/admin/marketing/influenciadores/${created.id}`);
          return;
        }
        if (influencerId) {
          await updateInfluencer(influencerId, input);
          toast.success('Influenciador atualizado.');
          router.push(`/admin/marketing/influenciadores/${influencerId}`);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Falha ao salvar influenciador.',
        );
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
  const identifierCodeField = register('identifierCode');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={
          mode === 'create' ? 'Novo influenciador' : 'Editar influenciador'
        }
        description="Cadastro de parceiro — sem acesso ao painel. Em dúvida, toque em Como preencher."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <MarketingFormField
            label="Nome"
            error={formState.errors.name?.message}
            hint="Nome completo do influenciador, como você o identifica na loja."
          >
            <Input {...register('name')} aria-required />
          </MarketingFormField>
          <MarketingFormField
            label="Usuário"
            error={formState.errors.username?.message}
            hint="Apelido ou @ do parceiro. Serve para achar o cadastro depois."
          >
            <Input {...register('username')} placeholder="@usuario" />
          </MarketingFormField>
          <MarketingFormField
            label="E-mail"
            error={formState.errors.email?.message}
            hint="E-mail de contato. Não libera acesso ao painel."
          >
            <Input type="email" {...register('email')} />
          </MarketingFormField>
          <MarketingFormField
            label="Telefone"
            error={formState.errors.phone?.message}
            hint="DDD + número, com ou sem pontuação. Exemplo: 81999999999."
          >
            <Input {...register('phone')} inputMode="tel" />
          </MarketingFormField>
          <MarketingFormField
            label="Instagram"
            hint="Opcional. Informe o @ do Instagram, se houver."
          >
            <Input {...register('instagram')} placeholder="@instagram" />
          </MarketingFormField>
          <MarketingFormField
            label="TikTok"
            hint="Opcional. Informe o @ do TikTok, se houver."
          >
            <Input {...register('tiktok')} placeholder="@tiktok" />
          </MarketingFormField>
          <MarketingFormField
            label="YouTube"
            hint="Opcional. Informe o @ ou o nome do canal, se houver."
          >
            <Input {...register('youtube')} placeholder="@youtube" />
          </MarketingFormField>
          <MarketingFormField
            label="Código identificador"
            error={formState.errors.identifierCode?.message}
            hint="Código único do parceiro, só com letras e números. Exemplo: DOUGLAS20. No celular, o texto já vira maiúsculo."
          >
            <Input
              {...identifierCodeField}
              className="uppercase"
              placeholder="DOUGLAS20"
              autoCapitalize="characters"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => {
                event.target.value = normalizeAlphanumericCode(
                  event.target.value,
                );
                void identifierCodeField.onChange(event);
              }}
            />
          </MarketingFormField>
          <MarketingFormField
            label="Status"
            hint="Ativo: o influenciador entra nos relatórios. Inativo: o cadastro fica guardado, sem uso."
          >
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
          </MarketingFormField>
        </div>
        <MarketingFormField
          label="Observações"
          hint="Opcional. Anotações internas sobre o parceiro. Ele não vê este texto."
        >
          <Textarea {...register('notes')} rows={3} />
        </MarketingFormField>

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
