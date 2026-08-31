import {
  flattenImageOnWhite,
  imageToLimitedBlob,
  type LoadedProductImage,
} from './product-image';

const MOBILE_MAX_EDGE = 640;
const DESKTOP_MAX_EDGE = 1024;

function isConstrainedDevice(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent;
  const isIOS = /iP(hone|od|ad)/.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const smallScreen = window.matchMedia('(max-width: 768px)').matches;
  const deviceMemory = (
    navigator as Navigator & {
      deviceMemory?: number;
    }
  ).deviceMemory;

  return (
    isIOS ||
    isAndroid ||
    coarsePointer ||
    smallScreen ||
    (typeof deviceMemory === 'number' && deviceMemory <= 4)
  );
}

function yieldToUi(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 40);
  });
}

function toFriendlyRemovalError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (
    lower.includes('memory') ||
    lower.includes('allocation') ||
    lower.includes('out of') ||
    lower.includes('wasm') ||
    lower.includes('aborted')
  ) {
    return new Error(
      'O aparelho ficou sem memória ao remover o fundo. Tente uma foto mais leve ou use o computador.',
    );
  }

  return error instanceof Error
    ? error
    : new Error('Não foi possível remover o fundo. Tente novamente.');
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
    quality: 0.82,
  });

  onProgress?.(
    constrained ? 'Carregando a IA. Não saia desta tela…' : 'Carregando a IA…',
  );
  await yieldToUi();

  let lastUpdate = Date.now();
  const startedAt = Date.now();
  const heartbeat = window.setInterval(() => {
    if (Date.now() - lastUpdate < 2000) return;
    const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    onProgress?.(
      constrained
        ? `Processando no celular… ${seconds}s. Não feche a tela.`
        : `Processando… ${seconds}s`,
    );
  }, 1000);

  try {
    const { removeBackground } = await import('@imgly/background-removal');
    lastUpdate = Date.now();

    const cutout = await removeBackground(input, {
      model: 'isnet_quint8',
      device: 'cpu',
      proxyToWorker: true,
      output: {
        format: 'image/png',
        quality: 0.9,
      },
      progress: (key, current, total) => {
        lastUpdate = Date.now();
        const percent = total > 0 ? Math.round((current / total) * 100) : 0;
        const downloading = key.includes('fetch') || key.includes('model');
        onProgress?.(
          downloading
            ? `Baixando o modelo de IA… ${percent}%`
            : `Removendo o fundo… ${percent}%`,
        );
      },
    });

    onProgress?.('Aplicando fundo branco…');
    await yieldToUi();
    return await flattenImageOnWhite(cutout);
  } catch (error) {
    throw toFriendlyRemovalError(error);
  } finally {
    window.clearInterval(heartbeat);
  }
}
