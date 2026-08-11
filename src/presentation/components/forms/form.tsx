'use client';

import { memo } from 'react';
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
  type FieldValues,
  type UseFormProps,
  type ControllerProps,
  type Path,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

import { Label, Input, type InputProps } from '@presentation/components/ui';
import { cn } from '@shared/utils/cn';

export function useAppForm<T extends FieldValues>(
  schema: ZodType<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>,
) {
  return useForm<T>({
    ...options,
    resolver: zodResolver(schema),
  });
}

export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  className?: string;
  render: ControllerProps<T>['render'];
}

function FormFieldInner<T extends FieldValues>({
  name,
  label,
  description,
  className,
  render,
}: FormFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={(props) => (
        <div className={cn('space-y-2', className)}>
          {label && <Label htmlFor={name}>{label}</Label>}
          {render(props)}
          {props.fieldState.error && (
            <p className="text-destructive text-xs">
              {props.fieldState.error.message}
            </p>
          )}
          {description && !props.fieldState.error && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      )}
    />
  );
}

export const FormField = memo(FormFieldInner) as typeof FormFieldInner;

export interface FormInputProps<T extends FieldValues> extends Omit<
  InputProps,
  'name'
> {
  name: Path<T>;
  label?: string;
  description?: string;
}

function FormInputInner<T extends FieldValues>({
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
        <Input
          {...field}
          {...inputProps}
          value={field.value ?? ''}
          error={!!fieldState.error}
        />
      )}
    />
  );
}

export const FormInput = memo(FormInputInner) as typeof FormInputInner;

export interface FormProps<
  T extends FieldValues,
> extends React.FormHTMLAttributes<HTMLFormElement> {
  form: ReturnType<typeof useForm<T>>;
}

function FormInner<T extends FieldValues>({
  form,
  children,
  className,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form className={cn('space-y-6', className)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

export const Form = memo(FormInner) as typeof FormInner;

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = memo(function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <fieldset className={cn('space-y-4', className)}>
      {(title || description) && (
        <legend className="mb-4 block w-full space-y-1">
          {title && <span className="text-sm font-medium">{title}</span>}
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </legend>
      )}
      {children}
    </fieldset>
  );
});

export { FormProvider, Controller, useForm };
