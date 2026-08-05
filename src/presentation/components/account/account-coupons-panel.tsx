'use client';

import { memo } from 'react';

import {
  Badge,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@presentation/components/ui';
import { MOCK_ACCOUNT_COUPONS } from '@shared/mocks/account.data';
import type { CouponAccountStatus } from '@shared/types/account.types';
import { formatDate } from '@shared/utils/format';

import { AccountPageHeader } from './account-page-header';

const TAB_LABELS: Record<CouponAccountStatus, string> = {
  available: 'Disponíveis',
  used: 'Utilizados',
  expired: 'Expirados',
};

function CouponList({ status }: { status: CouponAccountStatus }) {
  const coupons = MOCK_ACCOUNT_COUPONS.filter((c) => c.status === status);

  if (coupons.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Nenhum cupom nesta categoria.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2" role="list">
      {coupons.map((coupon) => (
        <li key={coupon.code}>
          <Card className="shadow-none">
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-medium">
                  {coupon.code}
                </span>
                <Badge
                  variant={status === 'available' ? 'default' : 'secondary'}
                >
                  {TAB_LABELS[status]}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">{coupon.label}</p>
              {coupon.expiresAt && status !== 'used' && (
                <p className="text-muted-foreground text-xs">
                  Validade: {formatDate(coupon.expiresAt)}
                </p>
              )}
              {coupon.usedAt && (
                <p className="text-muted-foreground text-xs">
                  Utilizado em {formatDate(coupon.usedAt)}
                </p>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export const AccountCouponsPanel = memo(function AccountCouponsPanel() {
  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="Cupons"
        description="Aproveite descontos exclusivos na UNDER SELECT."
      />

      <Tabs defaultValue="available">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="used">Utilizados</TabsTrigger>
          <TabsTrigger value="expired">Expirados</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <CouponList status="available" />
        </TabsContent>
        <TabsContent value="used">
          <CouponList status="used" />
        </TabsContent>
        <TabsContent value="expired">
          <CouponList status="expired" />
        </TabsContent>
      </Tabs>
    </div>
  );
});
