'use client';

import { CreditCard, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';

import { Container } from '@presentation/components/layout';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import { HomeSectionHeader } from '@presentation/components/home/home-section-header';
import { useStoreSettings } from '@presentation/contexts/store-settings-context';
import { buildHomeBenefits } from '@shared/utils/store-settings';

const benefitIcons = {
  returns: RefreshCw,
  payment: CreditCard,
} as const;

export function HomeBenefits() {
  const settings = useStoreSettings();
  const benefits = useMemo(() => buildHomeBenefits(settings), [settings]);

  return (
    <section aria-labelledby="home-benefits-title" className="py-12 md:py-16">
      <Container>
        <MotionReveal>
          <HomeSectionHeader
            eyebrow="Benefícios"
            title="Compre com confiança"
            description="Tudo pensado para quem compra camisa de time."
          />
        </MotionReveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit, index) => {
            const Icon =
              benefitIcons[benefit.id as keyof typeof benefitIcons] ??
              RefreshCw;

            return (
              <MotionReveal key={benefit.id} delay={index * 0.08}>
                <div className="border-border space-y-4 border p-6">
                  <Icon
                    className="text-brand-bronze size-6"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <div className="space-y-2">
                    <h3
                      id={index === 0 ? 'home-benefits-title' : undefined}
                      className="text-sm font-medium tracking-wide"
                    >
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
