import Image from 'next/image';
import { memo } from 'react';

import type { HomePromotionFlag } from '@shared/mocks/home.data';
import { cn } from '@shared/utils/cn';

interface HomePromotionFlagsProps {
  flags: HomePromotionFlag[];
  display?: 'banner' | 'crest';
}

export const HomePromotionFlags = memo(function HomePromotionFlags({
  flags,
  display = 'banner',
}: HomePromotionFlagsProps) {
  const isCrest = display === 'crest';

  return (
    <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-end justify-center gap-3 px-6 md:gap-8">
      {flags.map((flag) => (
        <div
          key={flag.id}
          className={cn(
            'relative overflow-hidden shadow-xl',
            isCrest
              ? cn(
                  'rounded-full bg-white/95 p-2',
                  flag.featured ? 'size-20 md:size-28' : 'size-16 md:size-24',
                )
              : cn(
                  'border-background/20 rounded-sm border',
                  flag.featured
                    ? 'h-16 w-24 md:h-24 md:w-36'
                    : 'h-12 w-20 md:h-16 md:w-24',
                ),
          )}
        >
          <Image
            src={flag.imageUrl}
            alt={flag.imageAlt}
            fill
            sizes={flag.featured ? '112px' : '88px'}
            className={cn(isCrest ? 'object-contain p-1.5' : 'object-cover')}
          />
        </div>
      ))}
    </div>
  );
});
