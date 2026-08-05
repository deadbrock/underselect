import type { Route } from 'next';

import { Container } from '@presentation/components/layout';
import { ProductGrid } from '@presentation/components/product';
import { MotionReveal } from '@presentation/components/home/motion-reveal';
import { HomeSectionHeader } from '@presentation/components/home/home-section-header';
import type { ProductCardData } from '@presentation/components/product';

export interface HomeProductSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  products: ProductCardData[];
  href?: Route | string;
}

export function HomeProductSection({
  eyebrow,
  title,
  description,
  products,
  href = '/categoria',
}: HomeProductSectionProps) {
  return (
    <section aria-label={title} className="py-12 md:py-16">
      <Container>
        <MotionReveal>
          <HomeSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
          />
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <ProductGrid products={products} columns={4} />
        </MotionReveal>
      </Container>
    </section>
  );
}
