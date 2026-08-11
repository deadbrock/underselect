export interface ResizeImageOptions {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp';
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível carregar a imagem.'));
    };
    image.src = url;
  });
}

function fitInside(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

export async function resizeImageFile(
  file: File,
  options: ResizeImageOptions,
): Promise<Blob> {
  const image = await loadImageFromFile(file);
  const { width, height } = fitInside(
    image.naturalWidth,
    image.naturalHeight,
    options.maxWidth,
    options.maxHeight,
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Não foi possível processar a imagem.');
  }

  context.drawImage(image, 0, 0, width, height);

  const mimeType = options.mimeType ?? 'image/jpeg';
  const quality = options.quality ?? 0.85;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Não foi possível otimizar a imagem.'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}
