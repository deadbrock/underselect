'use client';

import { forwardRef, memo, useEffect, useState } from 'react';
import { type FieldValues } from 'react-hook-form';

import { Input, type InputProps } from '@presentation/components/ui';
import {
  formatBrlNumberInput,
  parseBrlNumber,
  sanitizeBrlDraft,
} from '@shared/utils/format';

import { FormField, type FormInputProps } from './form';

export interface CurrencyInputProps extends Omit<
  InputProps,
  'type' | 'value' | 'onChange'
> {
  value: number;
  onValueChange: (value: number) => void;
}

export const CurrencyInput = memo(
  forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
    { value, onValueChange, onFocus, onBlur, placeholder = '0,00', ...props },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const [draft, setDraft] = useState(() => formatBrlNumberInput(value));

    useEffect(() => {
      if (!focused) {
        setDraft(formatBrlNumberInput(value));
      }
    }, [value, focused]);

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={draft}
        onFocus={(event) => {
          const input = event.currentTarget;
          setFocused(true);
          setDraft(
            value ? formatBrlNumberInput(value, { emptyWhenZero: false }) : '',
          );
          requestAnimationFrame(() => {
            if (document.activeElement === input) input.select();
          });
          onFocus?.(event);
        }}
        onChange={(event) => {
          const next = sanitizeBrlDraft(event.target.value);
          if (next === null) return;

          setDraft(next);
          if (next === '' || next === ',') {
            onValueChange(0);
            return;
          }

          const parsed = parseBrlNumber(next);
          if (parsed !== null) onValueChange(parsed);
        }}
        onBlur={(event) => {
          setFocused(false);
          const parsed = parseBrlNumber(event.currentTarget.value);
          const next = parsed ?? 0;
          onValueChange(next);
          setDraft(formatBrlNumberInput(next));
          onBlur?.(event);
        }}
      />
    );
  }),
);

function FormCurrencyInputInner<T extends FieldValues>({
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
        <CurrencyInput
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

export const FormCurrencyInput = memo(
  FormCurrencyInputInner,
) as typeof FormCurrencyInputInner;
