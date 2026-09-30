import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({ name: ADMIN_SESSION_COOKIE, value: '', path: '/', maxAge: 0 });
  return response;
}
