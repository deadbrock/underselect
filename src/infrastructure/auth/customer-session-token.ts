import { SignJWT, jwtVerify } from 'jose';

import {
  getAuthSecret,
  getCustomerSessionMaxAgeSeconds,
} from '@shared/config/auth.config';

export interface CustomerSessionTokenPayload {
  sub: string;
  sid: string;
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

export async function signCustomerSessionToken(
  customerId: string,
  sessionId: string,
): Promise<string> {
  return new SignJWT({ sid: sessionId, aud: 'customer' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(customerId)
    .setIssuedAt()
    .setExpirationTime(`${getCustomerSessionMaxAgeSeconds()}s`)
    .sign(getSecretKey());
}

export async function verifyCustomerSessionToken(
  token: string,
): Promise<CustomerSessionTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });

    if (payload.aud !== 'customer') {
      return null;
    }

    const customerId = payload.sub;
    const sessionId = payload.sid;

    if (typeof customerId !== 'string' || typeof sessionId !== 'string') {
      return null;
    }

    return { sub: customerId, sid: sessionId };
  } catch {
    return null;
  }
}
