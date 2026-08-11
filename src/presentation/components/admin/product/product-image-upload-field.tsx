'use client';

import Image from 'next/image';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Button, Label } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';
import { cn } from '@shared/utils/cn';
import { resizeImageFile } from '@shared/utils/resize-image';

const PREVIEW_MAX_WIDTH = 900;
const PREVIEW_MAX_HEIGHT = 1200;

export interface ProductImageUploadFieldProps {
  name?: keyof Pick<AdminProductFormSchema, 'imageUrl'>;
  label?: string;
  className?: string;
}

export const ProductImageUploadField = memo(function ProductImageUploadField({
  name = 'imageUrl',
  label = 'Imagem principal',
  className,
}: ProductImageUploadFieldProps) {
  const { control, setValue, watch } = useFormContext<AdminProductFormSchema>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (file: File | undefined, onChange: (value: string) => void) => {
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Selecione um arquivo de imagem válido.');
        return;
      }

      setUploading(true);

      try {
        const resized = await resizeImageFile(file, {
          maxWidth: PREVIEW_MAX_WIDTH,
          maxHeight: PREVIEW_MAX_HEIGHT,
          quality: 0.85,
          mimeType: 'image/jpeg',
        });

        const body = new FormData();
        body.append('file', resized, 'product-image.jpg');

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(
            payload.error?.message ?? 'Falha ao enviar a imagem.',
          );
        }

        onChange(payload.data.url);

        if (!watch('imageAlt')?.trim()) {
          setValue('imageAlt', file.name.replace(/\.[^.]+$/, ''), {
            shouldDirty: true,
          });
        }

        toast.success('Imagem enviada com sucesso.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Erro ao enviar a imagem.',
        );
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [setValue, watch],
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn('space-y-3', className)}>
          <Label htmlFor={`${name}-upload`}>{label}</Label>
          <p className="text-muted-foreground text-xs">
            Envie JPG, PNG ou WebP. A imagem é ajustada automaticamente ao
            quadro da loja (proporção 3:4).
          </p>

          <div className="bg-muted relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg border p-4">
            {field.value ? (
              <Image
                src={field.value}
                alt="Pré-visualização do produto"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 320px"
                unoptimized={field.value.startsWith('/uploads/')}
              />
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm">
                <ImagePlus className="size-8 opacity-60" />
                Nenhuma imagem selecionada
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              id={`${name}-upload`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(event) =>
                void handleFile(event.target.files?.[0], field.onChange)
              }
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <ImagePlus className="size-4" />
                  {field.value ? 'Trocar imagem' : 'Enviar imagem'}
                </>
              )}
            </Button>
            {field.value && (
              <Button
                type="button"
                variant="ghost"
                disabled={uploading}
                onClick={() => field.onChange('')}
              >
                <Trash2 className="size-4" />
                Remover
              </Button>
            )}
          </div>

          {fieldState.error && (
            <p className="text-destructive text-xs">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
});
