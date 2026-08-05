'use client';

import { useEffect, useState } from 'react';

type MediaQueryCallback = (matches: boolean) => void;

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler: MediaQueryCallback = (value) => setMatches(value);
    mediaQuery.addEventListener('change', (e) => handler(e.matches));
    return () =>
      mediaQuery.removeEventListener('change', (e) => handler(e.matches));
  }, [query]);

  return matches;
}

export function useIsMobile(breakpoint = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop(breakpoint = 1024): boolean {
  return useMediaQuery(`(min-width: ${breakpoint}px)`);
}
