'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
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
  couponFormSchema,
  normalizeAlphanumericCode,
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
import { MarketingFormField } from './marketing-form-field';

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
    async (values: CouponFormValues) => {
      const input: CouponFormInput = {
        ...values,
        code: values.code.toUpperCase(),
        influencerId: values.influencerId || undefined,
        campaignId: values.campaignId || undefined,
        usageLimit: values.usageLimit || undefined,
        usageLimitPerCustomer: values.usageLimitPerCustomer || undefined,
        rules,
      };
      try {
        if (mode === 'create') {
          const created = await createCoupon(input);
          toast.success('Cupom criado.');
          router.push(`/admin/marketing/cupons/${created.id}`);
          return;
        }
        if (couponId) {
          await updateCoupon(couponId, input);
          toast.success('Cupom atualizado.');
          router.push(`/admin/marketing/cupons/${couponId}`);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Falha ao salvar cupom.',
        );
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
  const codeField = register('code');
  const discountType = watch('discountType');
  const isFixedDiscount = discountType === 'fixed';
  const isFreeShipping = discountType === 'free-shipping';
  const valueHint = isFreeShipping
    ? 'Frete grátis não usa valor de desconto. Deixe 0.'
    : isFixedDiscount
      ? 'Digite o desconto em reais. Toque no campo: o zero some sozinho para você informar o valor.'
      : 'Digite só o número da porcentagem. Exemplo: 20 para 20% de desconto. Toque no campo: o zero some sozinho.';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={mode === 'create' ? 'Novo cupom' : 'Editar cupom'}
        description="Configure desconto, regras e atribuição. Em dúvida em algum campo, toque em Como preencher."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <MarketingFormField
            label="Código"
            error={formState.errors.code?.message}
            hint="Esse é o código que o cliente digita no carrinho. Use só letras e números, sem espaço. Exemplo: DOUGLAS20. No celular, o texto já vira maiúsculo."
          >
            <Input
              {...codeField}
              className="font-mono uppercase"
              placeholder="DOUGLAS20"
              autoCapitalize="characters"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => {
                event.target.value = normalizeAlphanumericCode(
                  event.target.value,
                );
                void codeField.onChange(event);
              }}
            />
          </MarketingFormField>
          <MarketingFormField
            label="Nome"
            error={formState.errors.name?.message}
            hint="Nome só para você reconhecer o cupom no painel. O cliente não vê esse nome."
          >
            <Input {...register('name')} placeholder="Cupom Douglas 20%" />
          </MarketingFormField>
          <MarketingFormField
            label="Tipo"
            hint="Percentual tira uma % do pedido. Valor fixo tira um valor em reais. Frete grátis zera o frete. Os outros tipos combinam o desconto com regras abaixo."
          >
            <Select
              value={discountType}
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
          </MarketingFormField>
          <MarketingFormField
            label={isFixedDiscount ? 'Valor (R$)' : 'Valor (%)'}
            hint={valueHint}
          >
            {isFixedDiscount ? (
              <CurrencyInput
                value={Number(watch('value')) || 0}
                onValueChange={(value) =>
                  setValue('value', value, { shouldDirty: true })
                }
                placeholder="0,00"
              />
            ) : (
              <IntegerInput
                value={Number(watch('value')) || 0}
                onValueChange={(value) =>
                  setValue('value', value, { shouldDirty: true })
                }
                placeholder={isFreeShipping ? '0' : '20'}
                disabled={isFreeShipping}
              />
            )}
          </MarketingFormField>
          <MarketingFormField
            label="Início"
            error={formState.errors.startDate?.message}
            hint="Primeiro dia em que o cupom pode ser usado. No celular, toque no campo para abrir o calendário."
          >
            <Input type="date" {...register('startDate')} />
          </MarketingFormField>
          <MarketingFormField
            label="Fim"
            error={formState.errors.endDate?.message}
            hint="Último dia em que o cupom vale. Depois dessa data ele deixa de funcionar."
          >
            <Input type="date" {...register('endDate')} />
          </MarketingFormField>
          <MarketingFormField
            label="Limite total"
            hint="Quantas vezes o cupom pode ser usado no total, por todos os clientes. Deixe vazio se não houver limite."
          >
            <IntegerInput
              value={Number(watch('usageLimit')) || 0}
              onValueChange={(value) =>
                setValue('usageLimit', value || undefined, {
                  shouldDirty: true,
                })
              }
              placeholder="Ilimitado"
            />
          </MarketingFormField>
          <MarketingFormField
            label="Limite por cliente"
            hint="Quantas vezes a mesma pessoa pode usar este cupom. Deixe vazio se cada cliente puder usar várias vezes."
          >
            <IntegerInput
              value={Number(watch('usageLimitPerCustomer')) || 0}
              onValueChange={(value) =>
                setValue('usageLimitPerCustomer', value || undefined, {
                  shouldDirty: true,
                })
              }
              placeholder="Ilimitado"
            />
          </MarketingFormField>
          <MarketingFormField
            label="Status"
            hint="Ativo: o cupom já pode ser usado. Agendado: espera a data de início. Pausado: fica bloqueado. Expirado e esgotado são situações finais."
          >
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
          </MarketingFormField>
          <MarketingFormField
            label="Influenciador"
            hint="Opcional. Associe o cupom a um influenciador para acompanhar as vendas dele nos relatórios."
          >
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
          </MarketingFormField>
          <MarketingFormField
            label="Campanha"
            hint="Opcional. Associe o cupom a uma campanha para organizar as ações de marketing."
          >
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
          </MarketingFormField>
        </div>
        <MarketingFormField
          label="Descrição"
          hint="Opcional. Anotação interna para a equipe. O cliente não vê este texto."
        >
          <Textarea {...register('description')} rows={2} />
        </MarketingFormField>
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
