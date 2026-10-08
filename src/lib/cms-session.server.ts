import { useSession, getRequestUrl } from '@tanstack/react-start/server';
import { createHash, timingSafeEqual } from 'node:crypto';

export async function cmsSession() {
  const password = process.env['CMS_SESSION_SECRET'];
  if (!password) throw new Error('CMS session configuration missing');
  return useSession<{ admin?: boolean }>({
    password,
    name: 'cms-admin-session',
    maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, secure: getRequestUrl().protocol === 'https:', sameSite: 'lax', path: '/' },
  });
}

export function matchesSecret(input: string, expected: string) {
  return timingSafeEqual(
    createHash('sha256').update(input).digest(),
    createHash('sha256').update(expected).digest(),
  );
}