'use client';

import Image from 'next/image';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';

import { Button } from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { resizeImageFile } from '@shared/utils/resize-image';

const PREVIEW_MAX_WIDTH = 900;
const PREVIEW_MAX_HEIGHT = 1200;

export interface CatalogMobilePhotosProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export const CatalogMobilePhotos = memo(function CatalogMobilePhotos({
  photos,
  onChange,
}: CatalogMobilePhotosProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const files = Array.from(fileList).filter((file) =>
        file.type.startsWith('image/'),
      );

      if (files.length === 0) {
        toast.error('Selecione arquivos de imagem válidos.');
        return;
      }

      setUploading(true);
      const uploaded: string[] = [];

      try {
        for (const file of files) {
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

          uploaded.push(payload.data.url as string);
        }

        onChange([...photos, ...uploaded]);
        toast.success(
          uploaded.length === 1
            ? 'Foto enviada com sucesso.'
            : `${uploaded.length} fotos enviadas.`,
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
    [onChange, photos],
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
            className="bg-muted relative aspect-[3/4] overflow-hidden rounded-lg border"
          >
            <Image
              src={url}
              alt={`Foto ${index + 1}`}
              fill
              className="object-cover"
              sizes="33vw"
              unoptimized={url.startsWith('/uploads/')}
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

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        disabled={uploading}
        onChange={(event) => void handleFiles(event.target.files)}
      />
    </div>
  );
});
