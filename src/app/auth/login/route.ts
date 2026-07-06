import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession, generateAccessToken, findUserByEmail, generateOTP, checkRateLimit } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(`login:${ip}`)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    const user = await findUserByEmail(email);
    if (user && !user.emailVerified) {
      const otpResult = await generateOTP(email);
      if (!('error' in otpResult)) {
        return NextResponse.json({
          error: 'Please verify your email before logging in',
          needsOTP: true,
          email,
        }, { status: 403 });
      }
      return NextResponse.json({ error: 'Please verify your email before logging in', needsOTP: true, email }, { status: 403 });
    }
    const result = await authenticateUser(email, password);
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
