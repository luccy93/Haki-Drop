import { NextRequest, NextResponse } from 'next/server';
import { findSessionByRefreshToken, findUserById, createSession, removeSession, generateAccessToken } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }
    const session = await findSessionByRefreshToken(refreshToken);
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }
    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    await removeSession(refreshToken);
    const ua = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const newSession = await createSession(user.id, ua, ip);
    const accessToken = generateAccessToken(user.id, user.role);
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
      accessToken,
    });
    response.cookies.set('refreshToken', newSession.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
