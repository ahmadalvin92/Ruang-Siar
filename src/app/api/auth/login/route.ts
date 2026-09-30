import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  adminSessionMaxAge,
  createAdminSession,
  credentialsAreValid,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!credentialsAreValid(String(username || ''), String(password || ''))) {
    return NextResponse.json({ success: false, error: 'Username atau password salah.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: adminSessionMaxAge,
  });
  return response;
}
