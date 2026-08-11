export function generateOrderId(): string {
  return `US-${Date.now().toString(36).toUpperCase()}`;
}
