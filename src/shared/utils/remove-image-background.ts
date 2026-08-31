import {
  canvasSourceToPngBlob,
  flattenImageOnWhite,
  type LoadedProductImage,
} from './product-image';

export async function removeImageBackground(
  image: LoadedProductImage,
  onProgress?: (message: string) => void,
): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('A remoção de fundo só funciona no navegador.');
  }

  const { removeBackground } = await import('@imgly/background-removal');
  const input = await canvasSourceToPngBlob(image);

  const cutout = await removeBackground(input, {
    model: 'isnet_quint8',
    device: 'cpu',
    output: {
      format: 'image/png',
      quality: 1,
    },
    progress: (key, current, total) => {
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
  return flattenImageOnWhite(cutout);
}
