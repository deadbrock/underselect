const MAX_INPUT_BYTES = 6 * 1024 * 1024;

function sniffImageMime(
  buffer: Buffer,
  declaredType = '',
): 'image/jpeg' | 'image/png' | 'image/webp' {
  const declared = declaredType.toLowerCase().trim();
  if (declared === 'image/jpg' || declared === 'image/pjpeg') {
    return 'image/jpeg';
  }
  if (
    declared === 'image/jpeg' ||
    declared === 'image/png' ||
    declared === 'image/webp'
  ) {
    return declared;
  }

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return 'image/jpeg';
}

export async function removeBackgroundOnServer(
  buffer: Buffer,
  declaredType = '',
): Promise<Buffer> {
  if (buffer.length > MAX_INPUT_BYTES) {
    throw new Error('Imagem muito grande para remover o fundo.');
  }

  const mimeType = sniffImageMime(buffer, declaredType);
  const input = new Blob([new Uint8Array(buffer)], { type: mimeType });

  const { removeBackground } = await import('@imgly/background-removal-node');
  const result = await removeBackground(input, {
    model: 'small',
    output: {
      format: 'image/png',
      quality: 0.9,
    },
  });

  if (Buffer.isBuffer(result)) {
    return result;
  }

  if (result instanceof Uint8Array) {
    return Buffer.from(result);
  }

  if (
    typeof result === 'object' &&
    result !== null &&
    'arrayBuffer' in result
  ) {
    const blob = result as Blob;
    return Buffer.from(await blob.arrayBuffer());
  }

  throw new Error('Não foi possível processar a remoção de fundo.');
}
