'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  reset?: () => void;
  className?: string;
}

const ErrorFallback = memo(function ErrorFallback({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Tente novamente.',
  reset,
  className,
}: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center',
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center border">
        <AlertCircle className="text-destructive size-8" strokeWidth={1} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-medium tracking-tight">{title}</h2>
        <p className="text-muted-foreground max-w-md text-sm">{message}</p>
      </div>
      {reset && (
        <Button onClick={reset} variant="outline">
          Tentar novamente
        </Button>
      )}
    </motion.div>
  );
});

export { ErrorFallback };
