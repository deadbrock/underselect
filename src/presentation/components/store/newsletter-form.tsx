'use client';

import { memo, useState } from 'react';

import { Button, Input } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export interface NewsletterFormProps {
  className?: string;
}

export const NewsletterForm = memo(function NewsletterForm({
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');

  return (
    <form
      className={cn('space-y-3', className)}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      aria-label="Newsletter"
    >
      <p className="text-label text-muted-foreground">Newsletter</p>
      <p className="text-sm leading-relaxed">
        Receba novidades, lançamentos e convites exclusivos.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="E-mail para newsletter"
          className="flex-1"
        />
        <Button type="submit" variant="bronze" className="shrink-0">
          Inscrever
        </Button>
      </div>
    </form>
  );
});
