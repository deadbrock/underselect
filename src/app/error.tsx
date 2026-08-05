'use client';

import { useEffect } from 'react';

import { ErrorFallback } from '@presentation/components/feedback';
import { getLogger } from '@infrastructure/di';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    getLogger().error('Route error', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return <ErrorFallback reset={reset} />;
}
