import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { verifyAdminSessionToken } from '@infrastructure/auth/admin-session-token';
import { verifyCustomerSessionToken } from '@infrastructure/auth/customer-session-token';
import {
  getAdminSessionCookieName,
  getCustomerSessionCookieName,
  isAccountProtectedPath,
} from '@shared/config/auth.config';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];
const PUBLIC_ADMIN_API_PATHS = [
  '/api/admin/auth/login',
  '/api/admin/auth/logout',
];
const PUBLIC_CUSTOMER_PATHS = ['/login', '/cadastro'];
const PUBLIC_CUSTOMER_API_PATHS = ['/api/auth/login'];

function isPublicAdminPath(pathname: string, method: string): boolean {
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) return true;
  if (method === 'POST' && PUBLIC_ADMIN_API_PATHS.includes(pathname)) {
    return true;
  }
  return false;
}

function isPublicCustomerPath(pathname: string, method: string): boolean {
  if (PUBLIC_CUSTOMER_PATHS.includes(pathname)) return true;
  if (method === 'POST' && PUBLIC_CUSTOMER_API_PATHS.includes(pathname)) {
    return true;
  }
  return false;
}

async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAdminSessionCookieName())?.value;
  if (!token) return false;
  const payload = await verifyAdminSessionToken(token);
  return Boolean(payload);
}

async function hasValidCustomerSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getCustomerSessionCookieName())?.value;
  if (!token) return false;
  const payload = await verifyCustomerSessionToken(token);
  return Boolean(payload);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isCustomerApi = pathname.startsWith('/api/auth');
  const isAccountPage = isAccountProtectedPath(pathname);

  if (isAdminPage || isAdminApi) {
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

  if (isCustomerApi || isAccountPage || pathname === '/login') {
    const isPublic = isPublicCustomerPath(pathname, request.method);
    const authenticated = await hasValidCustomerSession(request);

    if (pathname === '/login' && authenticated) {
      return NextResponse.redirect(new URL('/minha-conta', request.url));
    }

    if (isPublic) {
      return NextResponse.next();
    }

    if (!authenticated) {
      if (isCustomerApi) {
        return NextResponse.json(
          {
            success: false,
            error: { message: 'Não autorizado.' },
          },
          { status: 401 },
        );
      }

      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/login',
    '/cadastro',
    '/minha-conta',
    '/minha-conta/:path*',
    '/pedidos',
    '/pedidos/:path*',
    '/enderecos',
    '/dados-pessoais',
    '/alterar-senha',
    '/favoritos',
    '/lista-desejos',
    '/cupons',
    '/configuracoes',
    '/api/auth/:path*',
  ],
};
