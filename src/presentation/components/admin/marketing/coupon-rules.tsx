'use client';

import { memo } from 'react';

import { Input, Label, Switch } from '@presentation/components/ui';
import { ADMIN_COUPON_TYPE_LABELS } from '@shared/constants/marketing-admin.constants';
import type { CatalogCategorySlug } from '@shared/types/catalog.types';
import type { AdminCouponRules } from '@shared/types/marketing-admin.types';

interface CouponRulesPanelProps {
  rules: AdminCouponRules;
  onChange: (rules: AdminCouponRules) => void;
}

export const CouponRulesPanel = memo(function CouponRulesPanel({
  rules,
  onChange,
}: CouponRulesPanelProps) {
  const update = <K extends keyof AdminCouponRules>(
    key: K,
    value: AdminCouponRules[K],
  ) => {
    onChange({ ...rules, [key]: value });
  };

  return (
    <div className="border-border space-y-4 rounded-md border p-4">
      <p className="text-sm font-medium">Regras do cupom</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="minOrder">Valor mínimo do pedido (R$)</Label>
          <Input
            id="minOrder"
            type="number"
            value={rules.minOrderValue ?? ''}
            onChange={(e) =>
              update(
                'minOrderValue',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="minQty">Quantidade mínima</Label>
          <Input
            id="minQty"
            type="number"
            value={rules.minQuantity ?? ''}
            onChange={(e) =>
              update(
                'minQuantity',
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Categoria (slug)</Label>
          <Input
            id="category"
            value={rules.categorySlug ?? ''}
            onChange={(e) =>
              update(
                'categorySlug',
                e.target.value
                  ? (e.target.value as CatalogCategorySlug)
                  : undefined,
              )
            }
            placeholder="clubes-brasileiros"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="product">ID do produto</Label>
          <Input
            id="product"
            value={rules.productId ?? ''}
            onChange={(e) => update('productId', e.target.value || undefined)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        <RuleSwitch
          id="firstPurchase"
          label="Primeira compra"
          checked={!!rules.firstPurchaseOnly}
          onCheckedChange={(v) => update('firstPurchaseOnly', v)}
        />
        <RuleSwitch
          id="freeShipping"
          label="Frete grátis"
          checked={!!rules.freeShipping}
          onCheckedChange={(v) => update('freeShipping', v)}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        Tipos disponíveis: {Object.values(ADMIN_COUPON_TYPE_LABELS).join(', ')}.
        Combine regras conforme necessário.
      </p>
    </div>
  );
});

function RuleSwitch({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
