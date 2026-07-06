import { NextRequest, NextResponse } from 'next/server';
import { findSessionByRefreshToken, removeUserSessions, verifyAccessToken } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  await removeUserSessions(decoded.userId);
  const response = NextResponse.json({ message: 'All sessions cleared' });
  response.cookies.set('refreshToken', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
