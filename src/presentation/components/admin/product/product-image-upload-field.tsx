'use client';

import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Button, Label } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import type { AdminProductFormSchema } from '@presentation/stores/admin/product';
import { cn } from '@shared/utils/cn';
import {
  isLikelyImageFile,
  PRODUCT_IMAGE_ACCEPT,
  uploadProductImage,
} from '@shared/utils/product-image';

import { ProductImageEditorDialog } from './product-image-editor-dialog';

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
  const [queue, setQueue] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handlePickedFile = useCallback((file: File | undefined) => {
    if (!file) return;

    if (!isLikelyImageFile(file)) {
      toast.error('Selecione um arquivo de imagem válido.');
      return;
    }

    setQueue([file]);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleConfirm = async (blob: Blob) => {
          setUploading(true);
          try {
            const url = await uploadProductImage(blob);
            field.onChange(url);

            if (!watch('imageAlt')?.trim()) {
              const originalName = queue[0]?.name.replace(/\.[^.]+$/, '') ?? '';
              if (originalName) {
                setValue('imageAlt', originalName, { shouldDirty: true });
              }
            }

            setQueue([]);
            toast.success('Imagem enviada com sucesso.');
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Erro ao enviar a imagem.',
            );
          } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
          }
        };

        return (
          <div className={cn('space-y-3', className)}>
            <Label htmlFor={`${name}-upload`}>{label}</Label>
            <p className="text-muted-foreground text-xs">
              Aceita qualquer formato de imagem. Você pode girar, redimensionar
              e pré-visualizar antes de enviar. O quadro da loja usa proporção
              3:4.
            </p>

            <div className="bg-muted relative mx-auto flex aspect-[3/4] w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border">
              {field.value ? (
                // next/image não serve bem arquivos enviados em runtime.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={field.value}
                  alt="Pré-visualização do produto"
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 px-6 text-center text-sm">
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
                accept={PRODUCT_IMAGE_ACCEPT}
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  handlePickedFile(event.target.files?.[0]);
                  event.currentTarget.value = '';
                }}
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

            <ProductImageEditorDialog
              file={queue[0] ?? null}
              open={queue.length > 0}
              confirming={uploading}
              onOpenChange={(nextOpen) => {
                if (!nextOpen && !uploading) setQueue([]);
              }}
              onConfirm={handleConfirm}
            />
          </div>
        );
      }}
    />
  );
});
