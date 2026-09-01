'use client';

import { forwardRef, memo, useEffect, useState } from 'react';
import { type FieldValues } from 'react-hook-form';

import { Input, type InputProps } from '@presentation/components/ui';

import { FormField, type FormInputProps } from './form';

function toIntegerDraft(value: number): string {
  if (!Number.isFinite(value) || value === 0) return '';
  return String(Math.trunc(value));
}

function sanitizeIntegerDraft(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length > 9) return null;
  return digits.replace(/^0+(?=\d)/, '');
}

function parseIntegerDraft(raw: string): number | null {
  const next = sanitizeIntegerDraft(raw);
  if (next === null || next === '') return null;
  const n = Number(next);
  return Number.isFinite(n) ? n : null;
}

export interface IntegerInputProps extends Omit<
  InputProps,
  'type' | 'value' | 'onChange'
> {
  value: number;
  onValueChange: (value: number) => void;
}

export const IntegerInput = memo(
  forwardRef<HTMLInputElement, IntegerInputProps>(function IntegerInput(
    { value, onValueChange, onFocus, onBlur, placeholder = '0', ...props },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const [draft, setDraft] = useState(() => toIntegerDraft(value));

    useEffect(() => {
      if (!focused) {
        setDraft(toIntegerDraft(value));
      }
    }, [value, focused]);

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={draft}
        onFocus={(event) => {
          const input = event.currentTarget;
          setFocused(true);
          setDraft(value ? String(Math.trunc(value)) : '');
          requestAnimationFrame(() => {
            if (document.activeElement === input) input.select();
          });
          onFocus?.(event);
        }}
        onChange={(event) => {
          const next = sanitizeIntegerDraft(event.target.value);
          if (next === null) return;

          setDraft(next);
          onValueChange(next === '' ? 0 : Number(next));
        }}
        onBlur={(event) => {
          setFocused(false);
          const parsed = parseIntegerDraft(event.currentTarget.value);
          const next = parsed ?? 0;
          onValueChange(next);
          setDraft(toIntegerDraft(next));
          onBlur?.(event);
        }}
      />
    );
  }),
);

function FormIntegerInputInner<T extends FieldValues>({
  name,
  label,
  description,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <FormField<T>
      name={name}
      label={label}
      description={description}
      render={({ field, fieldState }) => (
        <IntegerInput
          {...inputProps}
          id={String(name)}
          name={field.name}
          value={Number(field.value) || 0}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          error={!!fieldState.error}
        />
      )}
    />
  );
}

export const FormIntegerInput = memo(
  FormIntegerInputInner,
) as typeof FormIntegerInputInner;
