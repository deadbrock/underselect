'use client';

import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { memo } from 'react';

import { EmptyState } from '@presentation/components/feedback';

export interface CartEmptyStateProps {
  className?: string;
}

const CartEmptyState = memo(function CartEmptyState({
  className,
}: CartEmptyStateProps) {
  const router = useRouter();

  return (
    <EmptyState
      className={className}
      icon={<ShoppingBag className="size-12" strokeWidth={1} />}
      title="Sua sacola está vazia"
      description="Explore o catálogo e adicione camisas, seleções e peças premium à sua sacola."
      action={{
        label: 'Continuar comprando',
        onClick: () => router.push('/categoria' as Route),
      }}
    />
  );
});

export { CartEmptyState };
