import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { verifyAdminSessionToken } from '@infrastructure/auth/admin-session-token';
import { getAdminSessionCookieName } from '@shared/config/auth.config';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];
const PUBLIC_ADMIN_API_PATHS = ['/api/admin/auth/login'];

function isPublicAdminPath(pathname: string, method: string): boolean {
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) return true;
  if (method === 'POST' && PUBLIC_ADMIN_API_PATHS.includes(pathname)) {
    return true;
  }
  return false;
}

function getSessionToken(request: NextRequest): string | null {
  return request.cookies.get(getAdminSessionCookieName())?.value ?? null;
}

async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  const token = getSessionToken(request);
  if (!token) return false;

  const payload = await verifyAdminSessionToken(token);
  return Boolean(payload);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const isPublic = isPublicAdminPath(pathname, request.method);
  const authenticated = await hasValidAdminSession(request);

  if (pathname === '/admin/login' && authenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isPublic) {
    return NextResponse.next();
  }

  if (!authenticated) {
    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Não autorizado.' },
        },
        { status: 401 },
      );
    }

    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
