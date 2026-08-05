'use client';

import { Star } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@shared/utils/cn';
import type { ProductReviews } from '@shared/mocks/product-detail.types';

export interface PdpReviewsProps {
  reviews: ProductReviews;
  className?: string;
}

function StarRating({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: 'sm' | 'lg';
}) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} de 5 estrelas`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            size === 'lg' ? 'size-5' : 'size-3.5',
            i < Math.round(rating)
              ? 'fill-[var(--brand-bronze)] text-[var(--brand-bronze)]'
              : 'text-muted-foreground/30',
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

const PdpReviews = memo(function PdpReviews({
  reviews,
  className,
}: PdpReviewsProps) {
  const maxCount = Math.max(...reviews.distribution.map((d) => d.count), 1);

  return (
    <section className={className} aria-labelledby="reviews-heading">
      <h2
        id="reviews-heading"
        className="text-xl font-medium tracking-tight md:text-2xl"
      >
        Avaliações
      </h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <span className="text-4xl font-medium tabular-nums">
              {reviews.averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating rating={reviews.averageRating} size="lg" />
              <p className="text-muted-foreground mt-1 text-sm">
                {reviews.totalCount} avaliações
              </p>
            </div>
          </div>

          <ul className="space-y-2" aria-label="Distribuição por estrelas">
            {reviews.distribution.map(({ stars, count }) => (
              <li key={stars} className="flex items-center gap-3 text-sm">
                <span className="w-8 tabular-nums">{stars}★</span>
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[var(--brand-bronze)] transition-all"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-8 text-right tabular-nums">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {reviews.comments.map((comment) => (
            <article
              key={comment.id}
              className="border-border border-b pb-6 last:border-0"
            >
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={comment.rating} />
                <span className="text-sm font-medium">{comment.author}</span>
                {comment.verified && (
                  <span className="text-luxury text-[var(--brand-bronze)]">
                    Compra verificada
                  </span>
                )}
                <time
                  className="text-muted-foreground text-xs"
                  dateTime={comment.date}
                >
                  {new Date(comment.date).toLocaleDateString('pt-BR')}
                </time>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {comment.text}
              </p>
            </article>
          ))}

          {reviews.customerPhotosReady && (
            <div
              className="border-border bg-muted/30 border border-dashed p-6 text-center"
              aria-label="Fotos de clientes — em breve"
            >
              <p className="text-label text-muted-foreground">
                Fotos de clientes
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Estrutura preparada para exibir fotos reais dos clientes.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export { PdpReviews };
