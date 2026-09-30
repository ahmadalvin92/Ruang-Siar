import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_SESSION_COOKIE = 'ruang_siar_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const adminUsername = () => process.env.ADMIN_USERNAME || 'admin';
const adminPassword = () => process.env.ADMIN_PASSWORD || 'admin';
const sessionSecret = () =>
  process.env.ADMIN_SESSION_SECRET || 'ganti-rahasia-ini-sebelum-produksi';

function sign(value: string) {
  return crypto.createHmac('sha256', sessionSecret()).update(value).digest('hex');
}

export function credentialsAreValid(username: string, password: string) {
  return username === adminUsername() && password === adminPassword();
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `${adminUsername()}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(token?: string) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [username, expiresAt, signature] = parts;
  const payload = `${username}.${expiresAt}`;
  const expectedSignature = sign(payload);
  const signatureMatches =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  return (
    signatureMatches &&
    username === adminUsername() &&
    Number(expiresAt) > Math.floor(Date.now() / 1000)
  );
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect('/login');
  }
}

export const adminSessionMaxAge = SESSION_MAX_AGE_SECONDS;
