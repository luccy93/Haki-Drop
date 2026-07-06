import { NextRequest, NextResponse } from 'next/server';
import { removeSession } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (refreshToken) {
    await removeSession(refreshToken);
  }
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('refreshToken', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
