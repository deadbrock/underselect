import { SignJWT, jwtVerify } from 'jose';

import {
  getAuthSecret,
  getAdminSessionMaxAgeSeconds,
} from '@shared/config/auth.config';

export interface AdminSessionTokenPayload {
  sub: string;
  sid: string;
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

export async function signAdminSessionToken(
  userId: string,
  sessionId: string,
): Promise<string> {
  return new SignJWT({ sid: sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${getAdminSessionMaxAgeSeconds()}s`)
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(
  token: string,
): Promise<AdminSessionTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });

    const userId = payload.sub;
    const sessionId = payload.sid;

    if (typeof userId !== 'string' || typeof sessionId !== 'string') {
      return null;
    }

    return { sub: userId, sid: sessionId };
  } catch {
    return null;
  }
}
