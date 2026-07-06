import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, generatePasswordResetToken, checkRateLimit } from '@/lib/auth-store';
import { sendResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(`forgot-password:${ip}`)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent' });
    }
    const token = await generatePasswordResetToken(email);
    if (!token) {
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent' });
    }
    const emailRes = await sendResetEmail(email, token);
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({
      message: 'If that email exists, a reset link has been sent',
      ...(isDev && !emailRes.sent ? { devToken: token } : {}),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
