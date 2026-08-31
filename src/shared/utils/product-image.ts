export const PRODUCT_IMAGE_ACCEPT =
  'image/*,image/heic,image/heif,.avif,.bmp,.gif,.heic,.heif,.ico,.jfif,.jpg,.jpeg,.png,.svg,.tif,.tiff,.webp';

export const PRODUCT_IMAGE_OUTPUT_WIDTH = 900;
export const PRODUCT_IMAGE_OUTPUT_HEIGHT = 1200;

const IMAGE_EXTENSIONS =
  /\.(avif|bmp|gif|hei[cf]|ico|jfif|jpe?g|png|svg|tiff?|webp)$/i;

export interface LoadedProductImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

export interface ImageEditTransform {
  rotation: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type === 'image/heic' || type === 'image/heif') return true;
  return /\.hei[cf]$/i.test(file.name);
}

export function isLikelyImageFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type.startsWith('image/')) return true;
  if (!type || type === 'application/octet-stream') {
    return IMAGE_EXTENSIONS.test(file.name);
  }
  return false;
}

function loadViaImageElement(file: File): Promise<LoadedProductImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.decoding = 'async';

    const fail = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          isHeicFile(file)
            ? 'Fotos HEIC do iPhone podem não abrir neste navegador. Salve como JPG ou abra no Safari.'
            : 'Não foi possível carregar esta imagem. Tente outro arquivo.',
        ),
      );
    };

    image.onload = () => {
      const finish = () => {
        if (!image.naturalWidth || !image.naturalHeight) {
          fail();
          return;
        }
        resolve({
          source: image,
          width: image.naturalWidth,
          height: image.naturalHeight,
          close: () => URL.revokeObjectURL(url),
        });
      };

      if (typeof image.decode === 'function') {
        void image.decode().then(finish).catch(fail);
        return;
      }

      finish();
    };
    image.onerror = fail;
    image.src = url;
  });
}

export async function loadImageFromFile(
  file: File,
): Promise<LoadedProductImage> {
  if (!isLikelyImageFile(file)) {
    throw new Error('Selecione um arquivo de imagem válido.');
  }

  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
      } as ImageBitmapOptions);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      // Alguns formatos (HEIC no Chrome, TIFF) caem no elemento <img>.
    }
  }

  return loadViaImageElement(file);
}

export function getContainScale(
  imageWidth: number,
  imageHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  rotation: number,
): number {
  const radians = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const rotatedWidth = imageWidth * cos + imageHeight * sin;
  const rotatedHeight = imageWidth * sin + imageHeight * cos;

  if (!rotatedWidth || !rotatedHeight) return 1;

  return Math.min(viewportWidth / rotatedWidth, viewportHeight / rotatedHeight);
}

export async function loadImageFromBlob(
  blob: Blob,
): Promise<LoadedProductImage> {
  const isPng = blob.type.includes('png') || blob.type === '';
  const file = new File(
    [blob],
    isPng ? 'product-image.png' : 'product-image.jpg',
    { type: blob.type || 'image/png' },
  );
  return loadImageFromFile(file);
}

export async function flattenImageOnWhite(blob: Blob): Promise<Blob> {
  const image = await loadImageFromBlob(blob);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  if (!context) {
    image.close();
    return Promise.reject(new Error('Não foi possível processar a imagem.'));
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image.source, 0, 0, image.width, image.height);
  image.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('Não foi possível gerar a imagem.'));
          return;
        }
        resolve(result);
      },
      'image/jpeg',
      0.95,
    );
  });
}

export function canvasSourceToPngBlob(
  image: LoadedProductImage,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  if (!context) {
    return Promise.reject(new Error('Não foi possível processar a imagem.'));
  }

  context.drawImage(image.source, 0, 0, image.width, image.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Não foi possível gerar a imagem.'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
}

export function drawEditedImage(
  context: CanvasRenderingContext2D,
  image: LoadedProductImage,
  viewportWidth: number,
  viewportHeight: number,
  transform: ImageEditTransform,
  background = '#f4f4f5',
) {
  if (background === 'transparent') {
    context.clearRect(0, 0, viewportWidth, viewportHeight);
  } else {
    context.fillStyle = background;
    context.fillRect(0, 0, viewportWidth, viewportHeight);
  }
  context.save();
  context.translate(
    viewportWidth / 2 + transform.offsetX,
    viewportHeight / 2 + transform.offsetY,
  );
  context.rotate((transform.rotation * Math.PI) / 180);
  context.scale(transform.scale, transform.scale);
  context.drawImage(
    image.source,
    -image.width / 2,
    -image.height / 2,
    image.width,
    image.height,
  );
  context.restore();
}

export function exportEditedImage(
  image: LoadedProductImage,
  transform: ImageEditTransform,
  viewportWidth: number,
  viewportHeight: number,
): Promise<Blob> {
  const outputWidth = PRODUCT_IMAGE_OUTPUT_WIDTH;
  const outputHeight = PRODUCT_IMAGE_OUTPUT_HEIGHT;
  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    return Promise.reject(new Error('Não foi possível processar a imagem.'));
  }

  const scaleX = outputWidth / viewportWidth;
  const scaleY = outputHeight / viewportHeight;
  const exportTransform: ImageEditTransform = {
    rotation: transform.rotation,
    scale: transform.scale * scaleX,
    offsetX: transform.offsetX * scaleX,
    offsetY: transform.offsetY * scaleY,
  };

  drawEditedImage(
    context,
    image,
    outputWidth,
    outputHeight,
    exportTransform,
    '#ffffff',
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Não foi possível gerar a imagem.'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      0.9,
    );
  });
}

export async function uploadProductImage(blob: Blob): Promise<string> {
  const isPng = blob.type === 'image/png';
  const file = new File(
    [blob],
    isPng ? 'product-image.png' : 'product-image.jpg',
    { type: isPng ? 'image/png' : 'image/jpeg' },
  );
  const body = new FormData();
  body.append('file', file);

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body,
  });
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Falha ao enviar a imagem.');
  }

  return payload.data.url as string;
}
