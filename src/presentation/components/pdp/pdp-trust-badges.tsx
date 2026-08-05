import { ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface PdpTrustBadgesProps {
  estimatedDelivery: string;
  className?: string;
}

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Entrega estimada',
    getDescription: (delivery: string) => delivery,
  },
  {
    icon: Lock,
    title: 'Pagamento seguro',
    getDescription: () => 'Checkout criptografado e protegido',
  },
  {
    icon: ShieldCheck,
    title: 'Compra protegida',
    getDescription: () => 'Garantia de autenticidade UNDER SELECT',
  },
  {
    icon: RefreshCw,
    title: 'Troca facilitada',
    getDescription: () => '30 dias para trocas e devoluções',
  },
] as const;

const PdpTrustBadges = memo(function PdpTrustBadges({
  estimatedDelivery,
  className,
}: PdpTrustBadgesProps) {
  return (
    <ul
      className={cn(
        'border-border grid gap-4 border-t pt-6 sm:grid-cols-2',
        className,
      )}
      aria-label="Benefícios da compra"
    >
      {TRUST_ITEMS.map(({ icon: Icon, title, getDescription }) => (
        <li key={title} className="flex gap-3">
          <Icon
            className="text-muted-foreground mt-0.5 size-5 shrink-0"
            aria-hidden
          />
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {getDescription(estimatedDelivery)}
            </p>
          </div>
        </li>
      ))}
      <li className="flex gap-3 sm:col-span-2">
        <Truck
          className="text-muted-foreground mt-0.5 size-5 shrink-0"
          aria-hidden
        />
        <div>
          <p className="text-sm font-medium">Frete</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Cálculo de frete disponível na próxima fase do checkout.
          </p>
        </div>
      </li>
    </ul>
  );
});

export { PdpTrustBadges };
