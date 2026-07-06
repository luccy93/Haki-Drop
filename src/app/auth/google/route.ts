import { NextRequest, NextResponse } from 'next/server';
import { authenticateWithProvider, createSession, generateAccessToken, checkRateLimit } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(`google-auth:${ip}`)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!googleRes.ok) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }
    const googleData = await googleRes.json();
    const { sub: googleId, email, name, picture } = googleData;
    if (!email) {
      return NextResponse.json({ error: 'Google account has no email' }, { status: 400 });
    }
    const result = await authenticateWithProvider('google', googleId, email, name || 'Google User', picture);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const ua = request.headers.get('user-agent') || 'unknown';
    const session = await createSession(result.user.id, ua, ip);
    const accessToken = generateAccessToken(result.user.id, result.user.role);
    const response = NextResponse.json({
      user: result.user,
      accessToken,
      sessionId: session.id,
    });
    response.cookies.set('refreshToken', session.refreshToken, {
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
