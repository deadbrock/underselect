'use client';

import { memo, useEffect, useId, useState } from 'react';

import { Label } from '@presentation/components/ui';

export interface MarketingFormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export const MarketingFormField = memo(function MarketingFormField({
  label,
  error,
  hint,
  children,
}: MarketingFormFieldProps) {
  const hintId = useId();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (error) setShowHint(true);
  }, [error]);

  return (
    <div className="space-y-1.5">
      <div className="flex min-h-11 items-center justify-between gap-2">
        <Label>{label}</Label>
        {hint ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground min-h-11 shrink-0 text-xs underline-offset-2 hover:underline"
            aria-expanded={showHint}
            aria-controls={hintId}
            onClick={() => setShowHint((current) => !current)}
          >
            {showHint ? 'Ocultar dica' : 'Como preencher'}
          </button>
        ) : null}
      </div>
      {children}
      {hint && showHint ? (
        <p
          id={hintId}
          className="text-muted-foreground text-xs leading-relaxed"
        >
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
