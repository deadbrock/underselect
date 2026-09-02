'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { PageHeader } from '@presentation/components/layout';
import { CurrencyInput, IntegerInput } from '@presentation/components/forms';
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
  campaignFormSchema,
  useMarketingStore,
  type CampaignFormValues,
} from '@presentation/stores/admin/marketing';
import { ADMIN_CAMPAIGN_STATUS_LABELS } from '@shared/constants/marketing-admin.constants';
import type { CatalogCategorySlug } from '@shared/types/catalog.types';
import type {
  AdminCampaign,
  CampaignFormInput,
} from '@shared/types/marketing-admin.types';

import { MarketingFormField } from './marketing-form-field';

function toFormValues(c?: AdminCampaign): CampaignFormValues {
  return {
    name: c?.name ?? '',
    description: c?.description ?? '',
    influencerId: c?.influencerId ?? '',
    couponIds: c?.couponIds ?? [],
    startDate: c?.startDate ?? '',
    endDate: c?.endDate ?? '',
    status: c?.status ?? 'planned',
    objective: c?.objective ?? '',
    notes: c?.notes ?? '',
    categorySlug: c?.categorySlug ?? '',
    productIds: c?.productIds ?? [],
    salesGoal: c?.salesGoal,
    ordersGoal: c?.ordersGoal,
  };
}

export interface CampaignFormPageProps {
  mode: 'create' | 'edit';
  campaignId?: string;
}

export const CampaignFormPage = memo(function CampaignFormPage({
  mode,
  campaignId,
}: CampaignFormPageProps) {
  const router = useRouter();
  const campaign = useMarketingStore((s) =>
    campaignId ? s.getCampaignById(campaignId) : undefined,
  );
  const influencers = useMarketingStore((s) => s.influencers);
  const coupons = useMarketingStore((s) => s.coupons);
  const createCampaign = useMarketingStore((s) => s.createCampaign);
  const updateCampaign = useMarketingStore((s) => s.updateCampaign);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: toFormValues(campaign),
  });

  const onSubmit = useCallback(
    async (values: CampaignFormValues) => {
      const input: CampaignFormInput = {
        ...values,
        categorySlug: values.categorySlug
          ? (values.categorySlug as CatalogCategorySlug)
          : undefined,
        salesGoal: values.salesGoal || undefined,
        ordersGoal: values.ordersGoal || undefined,
      };
      try {
        if (mode === 'create') {
          const created = await createCampaign(input);
          toast.success('Campanha criada.');
          router.push(`/admin/marketing/campanhas/${created.id}`);
          return;
        }
        if (campaignId) {
          await updateCampaign(campaignId, input);
          toast.success('Campanha atualizada.');
          router.push(`/admin/marketing/campanhas/${campaignId}`);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Falha ao salvar campanha.',
        );
      }
    },
    [mode, createCampaign, updateCampaign, campaignId, router],
  );

  if (mode === 'edit' && campaignId && !campaign) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Campanha não encontrada.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/marketing/campanhas">Voltar</Link>
        </Button>
      </div>
    );
  }

  const { register, handleSubmit, setValue, watch, formState } = form;
  const selectedCoupons = watch('couponIds');

  const toggleCoupon = (id: string) => {
    const next = selectedCoupons.includes(id)
      ? selectedCoupons.filter((c) => c !== id)
      : [...selectedCoupons, id];
    setValue('couponIds', next);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={mode === 'create' ? 'Nova campanha' : 'Editar campanha'}
        description="Associe influenciador, cupons e metas. Em dúvida, toque em Como preencher."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <MarketingFormField
            label="Nome"
            error={formState.errors.name?.message}
            hint="Nome da campanha para você identificar no painel. Exemplo: Black Friday Douglas."
          >
            <Input {...register('name')} />
          </MarketingFormField>
          <MarketingFormField
            label="Status"
            hint="Planejada: ainda não começou. Ativa: em andamento. Pausada: interrompida. Finalizada: encerrada."
          >
            <Select
              value={watch('status')}
              onValueChange={(v) =>
                setValue('status', v as CampaignFormValues['status'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ADMIN_CAMPAIGN_STATUS_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </MarketingFormField>
          <MarketingFormField
            label="Influenciador"
            error={formState.errors.influencerId?.message}
            hint="Escolha o parceiro desta campanha. Cadastre o influenciador antes, se ainda não existir."
          >
            <Select
              value={watch('influencerId')}
              onValueChange={(v) => setValue('influencerId', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {influencers.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </MarketingFormField>
          <MarketingFormField
            label="Data inicial"
            error={formState.errors.startDate?.message}
            hint="Primeiro dia da campanha. No celular, toque no campo para abrir o calendário."
          >
            <Input type="date" {...register('startDate')} />
          </MarketingFormField>
          <MarketingFormField
            label="Data final"
            error={formState.errors.endDate?.message}
            hint="Último dia da campanha."
          >
            <Input type="date" {...register('endDate')} />
          </MarketingFormField>
          <MarketingFormField
            label="Meta de vendas (R$)"
            hint="Opcional. Valor em reais que você espera faturar. Toque no campo: o zero some sozinho."
          >
            <CurrencyInput
              value={Number(watch('salesGoal')) || 0}
              onValueChange={(value) =>
                setValue('salesGoal', value || undefined, { shouldDirty: true })
              }
              placeholder="0,00"
            />
          </MarketingFormField>
          <MarketingFormField
            label="Meta de pedidos"
            hint="Opcional. Quantidade de pedidos que você espera nesta campanha."
          >
            <IntegerInput
              value={Number(watch('ordersGoal')) || 0}
              onValueChange={(value) =>
                setValue('ordersGoal', value || undefined, {
                  shouldDirty: true,
                })
              }
              placeholder="0"
            />
          </MarketingFormField>
        </div>
        <MarketingFormField
          label="Objetivo"
          hint="Opcional. Em uma frase, o que esta campanha deve alcançar."
        >
          <Input {...register('objective')} />
        </MarketingFormField>
        <MarketingFormField
          label="Descrição"
          hint="Opcional. Detalhes internos da campanha."
        >
          <Textarea {...register('description')} rows={2} />
        </MarketingFormField>
        <MarketingFormField
          label="Observações"
          hint="Opcional. Anotações para a equipe."
        >
          <Textarea {...register('notes')} rows={2} />
        </MarketingFormField>
        <MarketingFormField
          label="Cupons associados"
          hint="Toque nos cupons que fazem parte desta campanha. Você pode escolher mais de um."
        >
          <div className="flex flex-wrap gap-2">
            {coupons.map((c) => (
              <Button
                key={c.id}
                type="button"
                size="sm"
                variant={selectedCoupons.includes(c.id) ? 'default' : 'outline'}
                onClick={() => toggleCoupon(c.id)}
              >
                {c.code}
              </Button>
            ))}
          </div>
        </MarketingFormField>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="min-h-11 flex-1">
            {mode === 'create' ? 'Criar campanha' : 'Salvar'}
          </Button>
          <Button type="button" variant="outline" className="min-h-11" asChild>
            <Link href="/admin/marketing/campanhas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  );
});
