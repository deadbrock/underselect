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
        description="Associe influenciador, cupons e metas."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" error={formState.errors.name?.message}>
            <Input {...register('name')} />
          </Field>
          <Field label="Status">
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
          </Field>
          <Field
            label="Influenciador"
            error={formState.errors.influencerId?.message}
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
          </Field>
          <Field
            label="Data inicial"
            error={formState.errors.startDate?.message}
          >
            <Input type="date" {...register('startDate')} />
          </Field>
          <Field label="Data final" error={formState.errors.endDate?.message}>
            <Input type="date" {...register('endDate')} />
          </Field>
          <Field label="Meta de vendas (R$)">
            <Input type="number" {...register('salesGoal')} />
          </Field>
          <Field label="Meta de pedidos">
            <Input type="number" {...register('ordersGoal')} />
          </Field>
        </div>
        <Field label="Objetivo">
          <Input {...register('objective')} />
        </Field>
        <Field label="Descrição">
          <Textarea {...register('description')} rows={2} />
        </Field>
        <Field label="Observações">
          <Textarea {...register('notes')} rows={2} />
        </Field>
        <div className="space-y-2">
          <Label>Cupons associados</Label>
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
        </div>
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
