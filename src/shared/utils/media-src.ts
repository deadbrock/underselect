export function shouldUnoptimizeImage(src: string): boolean {
  return (
    src.startsWith('/uploads/') ||
    src.startsWith('/api/media/') ||
    src.startsWith('blob:') ||
    src.startsWith('data:')
  );
}
