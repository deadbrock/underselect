import { Container } from '@presentation/components/layout';
import { NewsletterForm } from '@presentation/components/store';
import { MotionReveal } from '@presentation/components/home/motion-reveal';

export function HomeNewsletter() {
  return (
    <section
      aria-label="Newsletter"
      className="border-border bg-foreground text-background border-t py-12 md:py-16"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <MotionReveal className="space-y-6">
            <div className="space-y-2">
              <p className="text-luxury text-brand-bronze-light">Newsletter</p>
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
                Fique por dentro
              </h2>
              <p className="text-background/70 text-sm leading-relaxed">
                Lançamentos exclusivos, convites para eventos privados e
                editorial de moda direto no seu e-mail.
              </p>
            </div>
            <NewsletterForm className="[&_input]:border-background/20 [&_input]:bg-background/10 [&_input]:text-background [&_input]:placeholder:text-background/50 text-left" />
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}
