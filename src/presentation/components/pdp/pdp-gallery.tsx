'use client';

import Image from 'next/image';
import { memo, useCallback, useRef, useState } from 'react';

import { cn } from '@shared/utils/cn';
import type { ProductImage } from '@shared/types/product-detail.types';
import { shouldUnoptimizeImage } from '@shared/utils/media-src';

export interface PdpGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const PdpGallery = memo(function PdpGallery({
  images,
  productName,
  className,
}: PdpGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [mobileScale, setMobileScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = images[activeIndex];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setMobileScale((s) => (s === 1 ? 2 : 1));
  }, []);

  if (!active) return null;

  return (
    <div className={cn('flex flex-col gap-4 lg:flex-row lg:gap-6', className)}>
      {images.length > 1 && (
        <div
          className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:max-h-[640px] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto"
          role="tablist"
          aria-label="Miniaturas do produto"
        >
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ver imagem ${index + 1} de ${images.length}`}
              onClick={() => {
                setActiveIndex(index);
                setMobileScale(1);
              }}
              className={cn(
                'bg-muted relative size-16 shrink-0 overflow-hidden border-2 transition-all lg:size-20',
                index === activeIndex
                  ? 'border-foreground opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-1"
                unoptimized={shouldUnoptimizeImage(image.url)}
              />
            </button>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        className="bg-muted relative order-1 aspect-[3/4] flex-1 overflow-hidden lg:order-2"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleTouchEnd}
        role="img"
        aria-label={active.alt ?? productName}
      >
        <Image
          src={active.url}
          alt={active.alt ?? productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn(
            'object-contain p-4 transition-transform duration-300',
            isZooming && 'md:scale-110',
            mobileScale > 1 && 'scale-125',
          )}
          style={{
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
          }}
          priority
          unoptimized={shouldUnoptimizeImage(active.url)}
        />
        <span className="text-muted-foreground bg-background/80 absolute right-3 bottom-3 hidden rounded-sm px-2 py-1 text-[0.625rem] backdrop-blur-sm md:inline">
          Passe o mouse para ampliar
        </span>
        <span className="text-muted-foreground bg-background/80 absolute right-3 bottom-3 rounded-sm px-2 py-1 text-[0.625rem] backdrop-blur-sm md:hidden">
          Toque duplo para ampliar
        </span>
      </div>
    </div>
  );
});

export { PdpGallery };
