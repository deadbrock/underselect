'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
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
  couponFormSchema,
  useMarketingStore,
  type CouponFormValues,
} from '@presentation/stores/admin/marketing';
import {
  ADMIN_COUPON_STATUS_LABELS,
  ADMIN_COUPON_TYPE_LABELS,
} from '@shared/constants/marketing-admin.constants';
import type {
  AdminCoupon,
  AdminCouponRules,
  CouponFormInput,
} from '@shared/types/marketing-admin.types';

import { CouponRulesPanel } from './coupon-rules';

function toFormValues(c?: AdminCoupon): CouponFormValues {
  return {
    code: c?.code ?? '',
    name: c?.name ?? '',
    description: c?.description ?? '',
    discountType: c?.discountType ?? 'percent',
    value: c?.value ?? 0,
    startDate: c?.startDate ?? '',
    endDate: c?.endDate ?? '',
    usageLimit: c?.usageLimit,
    usageLimitPerCustomer: c?.usageLimitPerCustomer,
    status: c?.status ?? 'active',
    influencerId: c?.influencerId ?? '',
    campaignId: c?.campaignId ?? '',
    rules: c?.rules ?? {},
  };
}

export interface CouponFormPageProps {
  mode: 'create' | 'edit';
  couponId?: string;
}

export const CouponFormPage = memo(function CouponFormPage({
  mode,
  couponId,
}: CouponFormPageProps) {
  const router = useRouter();
  const coupon = useMarketingStore((s) =>
    couponId ? s.getCouponById(couponId) : undefined,
  );
  const influencers = useMarketingStore((s) => s.influencers);
  const campaigns = useMarketingStore((s) => s.campaigns);
  const createCoupon = useMarketingStore((s) => s.createCoupon);
  const updateCoupon = useMarketingStore((s) => s.updateCoupon);
  const [rules, setRules] = useState<AdminCouponRules>(coupon?.rules ?? {});

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: toFormValues(coupon),
  });

  const onSubmit = useCallback(
    (values: CouponFormValues) => {
      const input: CouponFormInput = {
        ...values,
        code: values.code.toUpperCase(),
        influencerId: values.influencerId || undefined,
        campaignId: values.campaignId || undefined,
        usageLimit: values.usageLimit || undefined,
        usageLimitPerCustomer: values.usageLimitPerCustomer || undefined,
        rules,
      };
      if (mode === 'create') {
        const created = createCoupon(input);
        toast.success('Cupom criado.');
        router.push(`/admin/marketing/cupons/${created.id}`);
        return;
      }
      if (couponId) {
        updateCoupon(couponId, input);
        toast.success('Cupom atualizado.');
        router.push(`/admin/marketing/cupons/${couponId}`);
      }
    },
    [mode, createCoupon, updateCoupon, couponId, router, rules],
  );

  if (mode === 'edit' && couponId && !coupon) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Cupom não encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/marketing/cupons">Voltar</Link>
        </Button>
      </div>
    );
  }

  const { register, handleSubmit, setValue, watch, formState } = form;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={mode === 'create' ? 'Novo cupom' : 'Editar cupom'}
        description="Configure desconto, regras e atribuição."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Código" error={formState.errors.code?.message}>
            <Input
              {...register('code')}
              className="font-mono uppercase"
              placeholder="DOUGLAS20"
            />
          </Field>
          <Field label="Nome" error={formState.errors.name?.message}>
            <Input {...register('name')} />
          </Field>
          <Field label="Tipo">
            <Select
              value={watch('discountType')}
              onValueChange={(v) =>
                setValue('discountType', v as CouponFormValues['discountType'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ADMIN_COUPON_TYPE_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Valor">
            <Input type="number" {...register('value')} />
          </Field>
          <Field label="Início">
            <Input type="date" {...register('startDate')} />
          </Field>
          <Field label="Fim">
            <Input type="date" {...register('endDate')} />
          </Field>
          <Field label="Limite total">
            <Input type="number" {...register('usageLimit')} />
          </Field>
          <Field label="Limite por cliente">
            <Input type="number" {...register('usageLimitPerCustomer')} />
          </Field>
          <Field label="Status">
            <Select
              value={watch('status')}
              onValueChange={(v) =>
                setValue('status', v as CouponFormValues['status'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ADMIN_COUPON_STATUS_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Influenciador">
            <Select
              value={watch('influencerId') || 'none'}
              onValueChange={(v) =>
                setValue('influencerId', v === 'none' ? '' : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Opcional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {influencers.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Campanha">
            <Select
              value={watch('campaignId') || 'none'}
              onValueChange={(v) =>
                setValue('campaignId', v === 'none' ? '' : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Opcional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Descrição">
          <Textarea {...register('description')} rows={2} />
        </Field>
        <CouponRulesPanel rules={rules} onChange={setRules} />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="min-h-11 flex-1">
            {mode === 'create' ? 'Criar cupom' : 'Salvar'}
          </Button>
          <Button type="button" variant="outline" className="min-h-11" asChild>
            <Link href="/admin/marketing/cupons">Cancelar</Link>
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
