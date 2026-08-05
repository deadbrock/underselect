'use client';

import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface AddToCartButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const AddToCartButton = memo(function AddToCartButton({
  onClick,
  loading = false,
  disabled = false,
  label = 'Adicionar à sacola',
  className,
}: AddToCartButtonProps) {
  return (
    <Button
      variant="default"
      size="lg"
      className={cn('w-full', className)}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Adicionando...' : label}
    </Button>
  );
});

export { AddToCartButton };
