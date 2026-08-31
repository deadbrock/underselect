'use client';

import { Eraser, Loader2, RotateCcw, RotateCw, Undo2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { cn } from '@shared/utils/cn';
import {
  drawEditedImage,
  exportEditedImage,
  getContainScale,
  loadImageFromBlob,
  loadImageFromFile,
  type LoadedProductImage,
} from '@shared/utils/product-image';
import { removeImageBackground } from '@shared/utils/remove-image-background';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeRotation(value: number): number {
  const rounded = Math.round(value);
  return ((rounded % 360) + 360) % 360;
}

function EditorRange({
  id,
  label,
  value,
  min,
  max,
  step,
  valueLabel,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueLabel: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-muted-foreground text-xs tabular-nums">
          {valueLabel}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-primary h-11 w-full cursor-pointer disabled:opacity-40"
      />
    </div>
  );
}

export interface ProductImageEditorDialogProps {
  file: File | null;
  open: boolean;
  confirming?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (blob: Blob) => void | Promise<void>;
}

export const ProductImageEditorDialog = memo(function ProductImageEditorDialog({
  file,
  open,
  confirming = false,
  onOpenChange,
  onConfirm,
}: ProductImageEditorDialogProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<LoadedProductImage | null>(null);
  const originalImageRef = useRef<LoadedProductImage | null>(null);
  const removalRequestRef = useRef(0);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchStartRef = useRef<{ distance: number; size: number } | null>(null);
  const panStartRef = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [sizePercent, setSizePercent] = useState(100);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [frameSize, setFrameSize] = useState({ width: 280, height: 373 });
  const [isExporting, setIsExporting] = useState(false);
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [removalProgress, setRemovalProgress] = useState('');

  const hasImage = imageSize.width > 0 && !loadError && !isLoading;

  const baseScale = useMemo(() => {
    if (!imageSize.width || !imageSize.height) return 1;
    return getContainScale(
      imageSize.width,
      imageSize.height,
      frameSize.width,
      frameSize.height,
      rotation,
    );
  }, [
    imageSize.width,
    imageSize.height,
    frameSize.width,
    frameSize.height,
    rotation,
  ]);

  const scale = baseScale * (sizePercent / 100);

  const resetAdjustments = useCallback(() => {
    setRotation(0);
    setSizePercent(100);
    setOffset({ x: 0, y: 0 });
  }, []);

  const releaseImages = useCallback(() => {
    const current = imageRef.current;
    const original = originalImageRef.current;
    if (current && current !== original) current.close();
    original?.close();
    imageRef.current = null;
    originalImageRef.current = null;
  }, []);

  useEffect(() => {
    if (!open || !file) {
      removalRequestRef.current += 1;
      releaseImages();
      setImageSize({ width: 0, height: 0 });
      setLoadError(null);
      setIsLoading(false);
      setBackgroundRemoved(false);
      setIsRemovingBackground(false);
      setRemovalProgress('');
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setImageSize({ width: 0, height: 0 });
    setBackgroundRemoved(false);
    resetAdjustments();

    void loadImageFromFile(file)
      .then((loaded) => {
        if (cancelled) {
          loaded.close();
          return;
        }
        releaseImages();
        imageRef.current = loaded;
        originalImageRef.current = loaded;
        setImageSize({ width: loaded.width, height: loaded.height });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        releaseImages();
        setImageSize({ width: 0, height: 0 });
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar a imagem.',
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [file, open, releaseImages, resetAdjustments]);

  useEffect(() => {
    return () => {
      releaseImages();
    };
  }, [releaseImages]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateSize = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return;
      setFrameSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [open, isLoading, loadError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const loaded = imageRef.current;
    if (!canvas || !loaded) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(frameSize.width * dpr);
    canvas.height = Math.round(frameSize.height * dpr);

    const context = canvas.getContext('2d');
    if (!context) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawEditedImage(
      context,
      loaded,
      frameSize.width,
      frameSize.height,
      {
        rotation,
        scale,
        offsetX: offset.x,
        offsetY: offset.y,
      },
      backgroundRemoved ? '#ffffff' : '#f4f4f5',
    );
  }, [
    backgroundRemoved,
    imageSize.width,
    imageSize.height,
    frameSize.width,
    frameSize.height,
    rotation,
    scale,
    offset.x,
    offset.y,
  ]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pointersRef.current.size === 1) {
        panStartRef.current = {
          x: event.clientX,
          y: event.clientY,
          offsetX: offset.x,
          offsetY: offset.y,
        };
        pinchStartRef.current = null;
        return;
      }

      if (pointersRef.current.size === 2) {
        const points = [...pointersRef.current.values()];
        const first = points[0];
        const second = points[1];
        if (!first || !second) return;
        const distance = Math.hypot(second.x - first.x, second.y - first.y);
        pinchStartRef.current = { distance, size: sizePercent };
        panStartRef.current = null;
      }
    },
    [offset.x, offset.y, sizePercent],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!pointersRef.current.has(event.pointerId)) return;
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pointersRef.current.size === 2 && pinchStartRef.current) {
        const points = [...pointersRef.current.values()];
        const first = points[0];
        const second = points[1];
        if (!first || !second || pinchStartRef.current.distance <= 0) return;
        const distance = Math.hypot(second.x - first.x, second.y - first.y);
        const nextSize =
          (distance / pinchStartRef.current.distance) *
          pinchStartRef.current.size;
        setSizePercent(clamp(nextSize, 50, 250));
        return;
      }

      const panStart = panStartRef.current;
      if (pointersRef.current.size !== 1 || !panStart) return;

      setOffset({
        x: panStart.offsetX + (event.clientX - panStart.x),
        y: panStart.offsetY + (event.clientY - panStart.y),
      });
    },
    [],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      pointersRef.current.delete(event.pointerId);
      if (pointersRef.current.size < 2) pinchStartRef.current = null;
      if (pointersRef.current.size === 0) panStartRef.current = null;
    },
    [],
  );

  const handleConfirm = useCallback(async () => {
    const loaded = imageRef.current;
    if (!loaded) return;

    setIsExporting(true);
    try {
      const blob = await exportEditedImage(
        loaded,
        {
          rotation,
          scale,
          offsetX: offset.x,
          offsetY: offset.y,
        },
        frameSize.width,
        frameSize.height,
      );
      await onConfirm(blob);
    } finally {
      setIsExporting(false);
    }
  }, [
    frameSize.height,
    frameSize.width,
    offset.x,
    offset.y,
    onConfirm,
    rotation,
    scale,
  ]);

  const handleToggleBackground = useCallback(async () => {
    if (backgroundRemoved) {
      const original = originalImageRef.current;
      if (!original) return;
      if (imageRef.current && imageRef.current !== original) {
        imageRef.current.close();
      }
      imageRef.current = original;
      setImageSize({ width: original.width, height: original.height });
      setBackgroundRemoved(false);
      return;
    }

    const current = imageRef.current;
    if (!current) return;

    const requestId = ++removalRequestRef.current;
    setIsRemovingBackground(true);
    setRemovalProgress('Preparando a remoção de fundo…');

    try {
      const blob = await removeImageBackground(current, setRemovalProgress);
      if (requestId !== removalRequestRef.current) return;
      const next = await loadImageFromBlob(blob);
      if (requestId !== removalRequestRef.current) {
        next.close();
        return;
      }
      if (imageRef.current && imageRef.current !== originalImageRef.current) {
        imageRef.current.close();
      }
      imageRef.current = next;
      setImageSize({ width: next.width, height: next.height });
      setBackgroundRemoved(true);
      toast.success('Fundo removido e substituído por branco.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível remover o fundo. Tente novamente.',
      );
    } finally {
      setIsRemovingBackground(false);
      setRemovalProgress('');
    }
  }, [backgroundRemoved]);

  const busy = confirming || isExporting || isRemovingBackground;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[100dvh] w-[calc(100%-1rem)] max-w-lg flex-col overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Ajustar imagem</DialogTitle>
          <DialogDescription>
            Pré-visualize, gire, redimensione e remova o fundo antes de enviar.
            Arraste para posicionar. No celular, use dois dedos para o zoom.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={frameRef}
          className={cn(
            'relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-lg border sm:max-w-[320px]',
            backgroundRemoved ? 'bg-white' : 'bg-muted',
          )}
        >
          {isLoading ? (
            <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2 text-sm">
              <Loader2 className="size-6 animate-spin" />
              Carregando pré-visualização...
            </div>
          ) : loadError ? (
            <div className="text-destructive flex h-full w-full items-center justify-center p-4 text-center text-sm">
              {loadError}
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
              style={{ width: '100%', height: '100%' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          )}
          {isRemovingBackground && (
            <div className="bg-background/80 absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-sm">
              <Loader2 className="size-6 animate-spin" />
              <p>{removalProgress || 'Removendo o fundo…'}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasImage || busy}
              onClick={() =>
                setRotation((value) => normalizeRotation(value - 90))
              }
            >
              <RotateCcw className="size-4" />
              -90°
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasImage || busy}
              onClick={() =>
                setRotation((value) => normalizeRotation(value + 90))
              }
            >
              <RotateCw className="size-4" />
              +90°
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!hasImage || busy}
              onClick={resetAdjustments}
            >
              Redefinir
            </Button>
            <Button
              type="button"
              variant={backgroundRemoved ? 'outline' : 'default'}
              size="sm"
              disabled={!hasImage || busy}
              onClick={() => void handleToggleBackground()}
            >
              {isRemovingBackground ? (
                <Loader2 className="size-4 animate-spin" />
              ) : backgroundRemoved ? (
                <Undo2 className="size-4" />
              ) : (
                <Eraser className="size-4" />
              )}
              {backgroundRemoved ? 'Restaurar fundo' : 'Remover fundo'}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            {backgroundRemoved
              ? 'O fundo original foi removido e o sistema aplicou branco automaticamente.'
              : 'A primeira remoção de fundo baixa um modelo de IA (cerca de 40 MB) e pode levar um pouco. Depois fica mais rápido. O fundo será branco.'}
          </p>

          <EditorRange
            id="product-image-rotation"
            label="Ângulo"
            min={0}
            max={360}
            step={1}
            value={rotation}
            valueLabel={`${rotation}°`}
            disabled={!hasImage || busy}
            onChange={(value) => setRotation(normalizeRotation(value))}
          />
          <EditorRange
            id="product-image-size"
            label="Tamanho"
            min={50}
            max={250}
            step={1}
            value={sizePercent}
            valueLabel={`${Math.round(sizePercent)}%`}
            disabled={!hasImage || busy}
            onChange={setSizePercent}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="min-h-11"
            disabled={!hasImage || busy}
            onClick={() => void handleConfirm()}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Usar esta foto'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
