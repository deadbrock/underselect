import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

import { Container } from '@presentation/components/layout';
import { Button } from '@presentation/components/ui';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import { HOME_INSTITUTIONAL } from '@shared/mocks/home.data';

export function HomeInstitutionalBanner() {
  const data = HOME_INSTITUTIONAL;

  return (
    <section
      aria-label="Sobre a UNDER SELECT"
      className="border-border bg-brand-gray-100 dark:bg-brand-gray-900 border-y"
    >
      <Container className="py-12 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <MotionReveal className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-black md:aspect-[3/4]">
            <Image
              src={data.imageUrl}
              alt={data.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8 md:p-12"
            />
          </MotionReveal>

          <MotionReveal delay={0.15} className="space-y-6">
            <p className="text-luxury text-brand-bronze">{data.eyebrow}</p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
              {data.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {data.description}
            </p>
            <Button variant="outline" asChild>
              <Link href={data.cta.href as Route}>{data.cta.label}</Link>
            </Button>
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}
