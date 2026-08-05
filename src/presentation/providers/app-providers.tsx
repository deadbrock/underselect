'use client';

import { memo } from 'react';

import { Toaster } from '@presentation/components/feedback';
import { TooltipProvider } from '@presentation/components/ui';

import { ThemeProvider } from './theme-provider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = memo(function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={300}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </TooltipProvider>
    </ThemeProvider>
  );
});
