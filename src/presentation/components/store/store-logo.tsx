import Image from 'next/image';

import { cn } from '@shared/utils/cn';
import { STORE_LOGO } from '@shared/constants/store-navigation';

export interface StoreLogoProps {
  className?: string;
  priority?: boolean;
}

export function StoreLogo({ className, priority = false }: StoreLogoProps) {
  return (
    <Image
      src={STORE_LOGO.src}
      alt={STORE_LOGO.alt}
      width={STORE_LOGO.width}
      height={STORE_LOGO.height}
      priority={priority}
      className={cn('h-auto max-w-full object-contain', className)}
    />
  );
}
