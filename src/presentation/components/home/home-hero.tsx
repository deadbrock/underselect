import Link from 'next/link';
import type { Route } from 'next';

import { Container } from '@presentation/components/layout';
import { Button } from '@presentation/components/ui';
import { HomeHeroCrests } from '@presentation/components/home/home-hero-crests';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import { HOME_HERO, HOME_HERO_CRESTS } from '@shared/mocks/home.data';

export function HomeHero() {
  const hero = HOME_HERO;

  return (
    <section aria-label="Destaque principal" className="border-border border-b">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black md:aspect-[21/9]">
        <HomeHeroCrests crests={HOME_HERO_CRESTS} />
        <div className="absolute inset-0 bg-gradient-to-t from-black from-35% via-black/55 to-black/20" />
        <div className="absolute inset-0 max-w-2xl bg-gradient-to-r from-black/90 via-black/45 to-transparent" />

        <Container className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-16">
          <MotionReveal className="max-w-xl space-y-5">
            <p className="text-luxury text-brand-bronze-light">
              {hero.eyebrow}
            </p>
            <h1 className="text-3xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/80 md:text-base">
              {hero.subtitle}
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button variant="bronze" size="lg" asChild>
                <Link href={hero.ctaPrimary.href as Route}>
                  {hero.ctaPrimary.label}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black"
                asChild
              >
                <Link href={hero.ctaSecondary.href as Route}>
                  {hero.ctaSecondary.label}
                </Link>
              </Button>
            </div>
          </MotionReveal>
        </Container>
      </div>
    </section>
  );
}
