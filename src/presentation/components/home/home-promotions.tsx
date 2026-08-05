import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

import { Container } from '@presentation/components/layout';
import { Badge, Button } from '@presentation/components/ui';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import { HomeSectionHeader } from '@presentation/components/home/home-section-header';
import { HOME_PROMOTIONS } from '@shared/mocks/home.data';

export function HomePromotions() {
  return (
    <section aria-labelledby="home-promotions-title" className="py-12 md:py-16">
      <Container>
        <MotionReveal>
          <HomeSectionHeader
            eyebrow="Promoções"
            title="Ofertas selecionadas"
            description="Benefícios exclusivos por tempo limitado."
            href="/categoria"
            linkLabel="Ver promoções"
          />
        </MotionReveal>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {HOME_PROMOTIONS.map((promo, index) => (
            <MotionReveal key={promo.id} delay={index * 0.1}>
              <Link
                href={promo.href as Route}
                className="group border-border relative block overflow-hidden border"
              >
                <div className="relative aspect-[16/9] md:aspect-[2/1]">
                  <Image
                    src={promo.imageUrl}
                    alt={promo.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    {promo.badge ? (
                      <Badge variant="bronze" className="mb-3 w-fit">
                        {promo.badge}
                      </Badge>
                    ) : null}
                    <h3
                      id={index === 0 ? 'home-promotions-title' : undefined}
                      className="text-2xl font-medium tracking-tight text-white md:text-3xl"
                    >
                      {promo.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-white/80">
                      {promo.subtitle}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-fit border-white text-white hover:bg-white hover:text-black"
                      tabIndex={-1}
                      aria-hidden
                    >
                      Saiba mais
                    </Button>
                  </div>
                </div>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
