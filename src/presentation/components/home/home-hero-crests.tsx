import Image from 'next/image';
import { memo } from 'react';

import type { HomeHeroCrest } from '@shared/mocks/home.data';

interface HomeHeroCrestsProps {
  crests: HomeHeroCrest[];
}

export const HomeHeroCrests = memo(function HomeHeroCrests({
  crests,
}: HomeHeroCrestsProps) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-x-3 gap-y-2.5 px-4 py-10 opacity-[0.18] sm:gap-x-4 sm:gap-y-3 md:gap-x-5 md:gap-y-4 md:py-12 md:opacity-[0.22] lg:gap-x-6 lg:px-10 lg:opacity-25"
    >
      {crests.map((crest) => (
        <div
          key={crest.id}
          className="relative size-12 shrink-0 rounded-full bg-white/95 p-1.5 shadow-sm sm:size-14 md:size-16 lg:size-[4.75rem] lg:p-2"
        >
          <Image
            src={crest.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 56px, 76px"
            className="object-contain p-1"
          />
        </div>
      ))}
    </div>
  );
});
