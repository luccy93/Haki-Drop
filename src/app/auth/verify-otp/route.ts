import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, markEmailVerified, clearOTP, findUserByEmail, createSession, generateAccessToken, checkRateLimit } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(`verify-otp:${ip}`)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    const result = await verifyOTP(email, otp);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    await markEmailVerified(email);
    await clearOTP(email);
    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const ua = request.headers.get('user-agent') || 'unknown';
    const session = await createSession(user.id, ua, ip);
    const accessToken = generateAccessToken(user.id, user.role);
    const response = NextResponse.json({
      message: 'Email verified successfully',
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
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
