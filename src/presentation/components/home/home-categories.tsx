import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

import { Container } from '@presentation/components/layout';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import { HomeSectionHeader } from '@presentation/components/home/home-section-header';
import { HOME_CATEGORIES } from '@shared/mocks/home.data';

export function HomeCategories() {
  return (
    <section aria-labelledby="home-categories-title" className="py-12 md:py-16">
      <Container>
        <MotionReveal>
          <HomeSectionHeader
            eyebrow="Categorias"
            title="Explore por estilo"
            description="Curadoria premium para cada ocasião."
            href="/categoria"
          />
        </MotionReveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {HOME_CATEGORIES.map((category, index) => (
            <MotionReveal key={category.id} delay={index * 0.08}>
              <Link
                href={category.href as Route}
                className="group relative block overflow-hidden"
              >
                <div className="bg-muted relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={category.imageUrl}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <p className="text-luxury text-brand-bronze-light mb-1">
                      {category.description}
                    </p>
                    <h3
                      id={index === 0 ? 'home-categories-title' : undefined}
                      className="text-lg font-medium tracking-wide text-white md:text-xl"
                    >
                      {category.name}
                    </h3>
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
