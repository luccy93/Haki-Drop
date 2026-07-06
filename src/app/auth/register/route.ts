import { NextRequest, NextResponse } from 'next/server';
import { registerUser, generateOTP, checkRateLimit, findUserByEmail } from '@/lib/auth-store';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(`register:${ip}`)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    const existing = await findUserByEmail(email);
    if (existing && existing.emailVerified) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    if (!existing) {
      const result = await registerUser(email, password, name);
      if ('error' in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
    }
    const otpResult = await generateOTP(email);
    if ('error' in otpResult) {
      return NextResponse.json({ error: otpResult.error }, { status: otpResult.status });
    }
    const emailRes = await sendOTPEmail(email, otpResult.otp);
    if (!emailRes.sent) {
      console.log(`[DEV] OTP for ${email}: ${otpResult.otp}`);
    }
    return NextResponse.json({
      message: existing ? 'OTP resent. Please verify your email.' : 'Account created. Please verify your email.',
      email,
      devOtp: !emailRes.sent ? otpResult.otp : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
