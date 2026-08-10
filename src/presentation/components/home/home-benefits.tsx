import { CreditCard, Headphones, RefreshCw, Truck } from 'lucide-react';

import { Container } from '@presentation/components/layout';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import { HomeSectionHeader } from '@presentation/components/home/home-section-header';
import { HOME_BENEFITS } from '@shared/mocks/home.data';

const benefitIcons = {
  shipping: Truck,
  returns: RefreshCw,
  payment: CreditCard,
  service: Headphones,
} as const;

export function HomeBenefits() {
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_BENEFITS.map((benefit, index) => {
            const Icon =
              benefitIcons[benefit.id as keyof typeof benefitIcons] ?? Truck;

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
