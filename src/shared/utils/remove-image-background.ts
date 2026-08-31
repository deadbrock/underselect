import {
  flattenImageOnWhite,
  imageToLimitedBlob,
  type LoadedProductImage,
} from './product-image';

const MOBILE_MAX_EDGE = 768;
const DESKTOP_MAX_EDGE = 1024;
const REQUEST_TIMEOUT_MS = 90_000;

function isConstrainedDevice(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent;
  const isIOS = /iP(hone|od|ad)/.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const smallScreen = window.matchMedia('(max-width: 768px)').matches;

  return isIOS || isAndroid || coarsePointer || smallScreen;
}

function yieldToUi(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 40);
  });
}

export async function removeImageBackground(
  image: LoadedProductImage,
  onProgress?: (message: string) => void,
): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('A remoção de fundo só funciona no navegador.');
  }

  const constrained = isConstrainedDevice();
  const maxEdge = constrained ? MOBILE_MAX_EDGE : DESKTOP_MAX_EDGE;

  onProgress?.(
    constrained ? 'Preparando a foto no celular…' : 'Preparando a foto…',
  );
  await yieldToUi();

  const input = await imageToLimitedBlob(image, maxEdge, {
    mimeType: 'image/jpeg',
    quality: 0.85,
  });

  onProgress?.('Enviando para o servidor…');

  const body = new FormData();
  body.append('file', input, 'product-image.jpg');

  const controller = new AbortController();
  const startedAt = Date.now();
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );
  const heartbeat = window.setInterval(() => {
    const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    onProgress?.(
      constrained
        ? `O servidor está removendo o fundo… ${seconds}s`
        : `Removendo o fundo no servidor… ${seconds}s`,
    );
  }, 1000);

  try {
    const response = await fetch('/api/admin/remove-background', {
      method: 'POST',
      body,
      credentials: 'same-origin',
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') ?? '';

    if (!response.ok) {
      if (contentType.includes('application/json')) {
        const payload = await response.json();
        throw new Error(
          payload.error?.message ?? 'Não foi possível remover o fundo.',
        );
      }

      if (response.status === 401) {
        throw new Error('Sessão expirada. Entre novamente no admin.');
      }

      throw new Error('Não foi possível remover o fundo.');
    }

    onProgress?.('Aplicando fundo branco…');
    await yieldToUi();
    return flattenImageOnWhite(await response.blob());
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(
        'A remoção de fundo demorou demais. Tente novamente com uma foto mais leve.',
      );
    }

    throw error instanceof Error
      ? error
      : new Error('Não foi possível remover o fundo. Tente novamente.');
  } finally {
    window.clearTimeout(timeout);
    window.clearInterval(heartbeat);
  }
}
