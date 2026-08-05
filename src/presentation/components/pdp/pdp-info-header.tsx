import { Badge } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';
import type { ProductDetail } from '@shared/mocks/product-detail.types';

export interface PdpInfoHeaderProps {
  product: ProductDetail;
  className?: string;
}

export function PdpInfoHeader({ product, className }: PdpInfoHeaderProps) {
  const entity = product.team ?? product.selection;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{product.categoryLabel}</Badge>
        {product.isNew && <Badge variant="bronze">Novo</Badge>}
        {product.badge && <Badge variant="outline">{product.badge}</Badge>}
        {!product.inStock && <Badge variant="secondary">Esgotado</Badge>}
      </div>

      <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
        {product.name}
      </h1>

      <dl className="text-muted-foreground grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {entity && (
          <div>
            <dt className="text-label text-foreground/70">
              {product.team ? 'Time' : 'Seleção'}
            </dt>
            <dd>{entity}</dd>
          </div>
        )}
        <div>
          <dt className="text-label text-foreground/70">Marca</dt>
          <dd>{product.brand}</dd>
        </div>
        <div>
          <dt className="text-label text-foreground/70">Coleção</dt>
          <dd>{product.collection}</dd>
        </div>
        <div>
          <dt className="text-label text-foreground/70">SKU</dt>
          <dd className="font-mono text-xs">{product.sku}</dd>
        </div>
        <div>
          <dt className="text-label text-foreground/70">Disponibilidade</dt>
          <dd className={product.inStock ? 'text-foreground' : ''}>
            {product.inStock ? 'Em estoque' : 'Indisponível'}
          </dd>
        </div>
      </dl>
    </div>
  );
}
