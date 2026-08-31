const MAX_INPUT_BYTES = 6 * 1024 * 1024;

export async function removeBackgroundOnServer(
  buffer: Buffer,
): Promise<Buffer> {
  if (buffer.length > MAX_INPUT_BYTES) {
    throw new Error('Imagem muito grande para remover o fundo.');
  }

  const { removeBackground } = await import('@imgly/background-removal-node');
  const result = await removeBackground(buffer, {
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
