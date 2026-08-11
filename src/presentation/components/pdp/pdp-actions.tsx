'use client';

import { Bell, Heart, Share2, Zap } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

import { AddToCartButton } from '@presentation/components/product';
import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface PdpActionsProps {
  inStock: boolean;
  canPurchase: boolean;
  onBuyNow?: () => void;
  onAddToCart?: () => void;
  className?: string;
  compact?: boolean;
}

const PdpActions = memo(function PdpActions({
  inStock,
  canPurchase,
  onBuyNow,
  onAddToCart,
  className,
  compact = false,
}: PdpActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);

  const handleShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      });
      return;
    }
    await navigator.clipboard?.writeText(window.location.href);
  }, []);

  const unavailable = !inStock || !canPurchase;

  return (
    <div className={cn('space-y-3', className)}>
      <div className={cn('flex flex-col gap-2', compact ? 'sm:flex-row' : '')}>
        <Button
          variant="bronze"
          size="lg"
          className={cn('w-full', unavailable && 'opacity-70')}
          aria-disabled={unavailable}
          onClick={onBuyNow}
          aria-label="Comprar agora"
        >
          <Zap className="mr-2 size-4" aria-hidden />
          Comprar agora
        </Button>
        <AddToCartButton
          label="Adicionar ao carrinho"
          className={unavailable ? 'opacity-70' : undefined}
          onClick={onAddToCart}
        />
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFavorite((v) => !v)}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
            }
          >
            <Heart
              className={cn('mr-2 size-4', isFavorite && 'fill-current')}
              aria-hidden
            />
            {isFavorite ? 'Favoritado' : 'Favoritar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            aria-label="Compartilhar produto"
          >
            <Share2 className="mr-2 size-4" aria-hidden />
            Compartilhar
          </Button>
        </div>
      )}

      {!inStock && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={notifyRequested}
          onClick={() => setNotifyRequested(true)}
          aria-label="Avise-me quando chegar"
        >
          <Bell className="mr-2 size-4" aria-hidden />
          {notifyRequested ? 'Você será avisado' : 'Avise-me quando chegar'}
        </Button>
      )}
    </div>
  );
});

export { PdpActions };
