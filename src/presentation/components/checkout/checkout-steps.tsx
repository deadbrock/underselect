import { memo } from 'react';

import { cn } from '@shared/utils/cn';

export interface CheckoutStep {
  id: string;
  label: string;
}

export interface CheckoutStepsProps {
  steps: CheckoutStep[];
  currentStep: number;
  className?: string;
}

const CheckoutSteps = memo(function CheckoutSteps({
  steps,
  currentStep,
  className,
}: CheckoutStepsProps) {
  return (
    <nav aria-label="Progresso do checkout" className={cn('w-full', className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                'flex flex-1 items-center',
                index < steps.length - 1 &&
                  'after:bg-border after:mx-2 after:h-px after:flex-1 after:content-[""]',
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    'flex size-8 items-center justify-center border text-xs tabular-nums transition-colors',
                    isActive &&
                      'border-foreground bg-foreground text-background',
                    isCompleted &&
                      'border-brand-bronze bg-brand-bronze text-brand-white',
                    !isActive &&
                      !isCompleted &&
                      'border-border text-muted-foreground',
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    'text-luxury hidden sm:block',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export { CheckoutSteps };
