'use client';

import Image from 'next/image';
import { memo, useState } from 'react';

import { cn } from '@shared/utils/cn';

export interface ProductGalleryProps {
  images: { url: string; alt?: string }[];
  className?: string;
}

const ProductGallery = memo(function ProductGallery({
  images,
  className,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (!active) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="bg-muted relative aspect-[3/4] overflow-hidden">
        <Image
          src={active.url}
          alt={active.alt ?? 'Produto'}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'bg-muted relative size-16 shrink-0 overflow-hidden border-2 transition-colors',
                index === activeIndex
                  ? 'border-foreground'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
              aria-label={`Imagem ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt ?? ''}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export { ProductGallery };
