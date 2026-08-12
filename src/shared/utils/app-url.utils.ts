export function resolveAppBaseUrl(request?: Request): string {
  const envUrl =
    process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';

    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '');
    }

    const host = request.headers.get('host');
    if (host) {
      const isLocal =
        host.startsWith('localhost') ||
        host.startsWith('127.0.0.1') ||
        /^\d+\.\d+\.\d+\.\d+(:\d+)?$/.test(host);
      const proto = isLocal ? 'http' : 'https';
      return `${proto}://${host}`.replace(/\/$/, '');
    }
  }

  return 'http://localhost:3000';
}
