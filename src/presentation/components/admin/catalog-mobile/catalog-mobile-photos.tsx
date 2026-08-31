'use client';

import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';

import { ProductImageEditorDialog } from '@presentation/components/admin/product/product-image-editor-dialog';
import { Button } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import {
  isLikelyImageFile,
  PRODUCT_IMAGE_ACCEPT,
  uploadProductImage,
} from '@shared/utils/product-image';

export interface CatalogMobilePhotosProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export const CatalogMobilePhotos = memo(function CatalogMobilePhotos({
  photos,
  onChange,
}: CatalogMobilePhotosProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).filter(isLikelyImageFile);

    if (files.length === 0) {
      toast.error('Selecione arquivos de imagem válidos.');
      return;
    }

    setQueue(files);
  }, []);

  const handleConfirm = useCallback(
    async (blob: Blob) => {
      setUploading(true);
      try {
        const url = await uploadProductImage(blob);
        onChange([...photos, url]);
        setQueue((current) => current.slice(1));
        toast.success(
          queue.length > 1
            ? 'Foto enviada. Ajuste a próxima.'
            : 'Foto enviada com sucesso.',
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Erro ao enviar as fotos.',
        );
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [onChange, photos, queue.length],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Fotos</p>
        <p className="text-muted-foreground text-xs">
          A primeira foto será a capa
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {photos.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="bg-muted relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Foto ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {index === 0 && (
              <span className="bg-background/90 absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[0.625rem] font-medium tracking-wide uppercase">
                Capa
              </span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="bg-background/80 absolute top-1 right-1 size-8"
              aria-label={`Remover foto ${index + 1}`}
              onClick={() =>
                onChange(photos.filter((_, photoIndex) => photoIndex !== index))
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="border-border text-muted-foreground hover:text-foreground flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-xs"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImagePlus className="size-5" />
          )}
          {uploading ? 'Enviando...' : 'Adicionar'}
        </button>
      </div>

      <p className="text-muted-foreground text-xs">
        JPG, PNG, WebP, HEIC, GIF, BMP e outros. Gire e ajuste o tamanho na
        pré-visualização.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={PRODUCT_IMAGE_ACCEPT}
        multiple
        className="sr-only"
        disabled={uploading}
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.currentTarget.value = '';
        }}
      />

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
});
