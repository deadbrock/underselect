'use client';

import { memo } from 'react';

import { CurrencyInput, IntegerInput } from '@presentation/components/forms';
import { useClassificationOptions } from '@presentation/hooks/use-classification-options';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@presentation/components/ui';
import { CATALOG_CATEGORIES } from '@shared/constants/catalog.constants';
import type { CatalogCategorySlug } from '@shared/types/catalog.types';
import type { AdminCouponRules } from '@shared/types/marketing-admin.types';

import { MarketingFormField } from './marketing-form-field';

interface CouponRulesPanelProps {
  rules: AdminCouponRules;
  onChange: (rules: AdminCouponRules) => void;
}

export const CouponRulesPanel = memo(function CouponRulesPanel({
  rules,
  onChange,
}: CouponRulesPanelProps) {
  const { categories } = useClassificationOptions();
  const categoryOptions =
    categories.length > 0
      ? categories
      : CATALOG_CATEGORIES.map((category) => ({
          slug: category.slug,
          label: category.label,
        }));

  const update = <K extends keyof AdminCouponRules>(
    key: K,
    value: AdminCouponRules[K],
  ) => {
    onChange({ ...rules, [key]: value });
  };

  return (
    <div className="border-border space-y-4 rounded-md border p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">Regras do cupom</p>
        <p className="text-muted-foreground text-xs">
          Opcional. Use só o que fizer sentido para este cupom. Em dúvida, toque
          em Como preencher.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MarketingFormField
          label="Valor mínimo do pedido"
          hint="O pedido precisa atingir esse valor em reais para o cupom valer. Deixe vazio se não houver mínimo. Toque no campo: o zero some sozinho."
        >
          <CurrencyInput
            id="minOrder"
            value={rules.minOrderValue ?? 0}
            onValueChange={(value) =>
              update('minOrderValue', value || undefined)
            }
            placeholder="0,00"
          />
        </MarketingFormField>
        <MarketingFormField
          label="Quantidade mínima"
          hint="Quantidade mínima de itens no carrinho. Deixe vazio se não houver mínimo."
        >
          <IntegerInput
            id="minQty"
            value={rules.minQuantity ?? 0}
            onValueChange={(value) => update('minQuantity', value || undefined)}
            placeholder="Ilimitado"
          />
        </MarketingFormField>
        <MarketingFormField
          label="Categoria"
          hint="Se o desconto for só para uma categoria, escolha aqui. Caso contrário, deixe em Nenhuma."
        >
          <Select
            value={rules.categorySlug || 'none'}
            onValueChange={(value) =>
              update(
                'categorySlug',
                value === 'none' ? undefined : (value as CatalogCategorySlug),
              )
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Nenhuma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </MarketingFormField>
        <MarketingFormField
          label="ID do produto"
          hint="Só preencha se o cupom for de um produto específico. Copie o ID na ficha do produto. Caso contrário, deixe vazio."
        >
          <Input
            id="product"
            value={rules.productId ?? ''}
            onChange={(event) =>
              update('productId', event.target.value || undefined)
            }
            placeholder="Opcional"
          />
        </MarketingFormField>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        <RuleSwitch
          id="firstPurchase"
          label="Primeira compra"
          hint="Ative se o cupom só puder ser usado no primeiro pedido do cliente."
          checked={!!rules.firstPurchaseOnly}
          onCheckedChange={(value) => update('firstPurchaseOnly', value)}
        />
        <RuleSwitch
          id="freeShipping"
          label="Frete grátis"
          hint="Ative para zerar o frete junto com as outras regras deste cupom."
          checked={!!rules.freeShipping}
          onCheckedChange={(value) => update('freeShipping', value)}
        />
      </div>
    </div>
  );
});

function RuleSwitch({
  id,
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <MarketingFormField label={label} hint={hint}>
      <div className="flex min-h-11 items-center gap-2">
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </MarketingFormField>
  );
}
