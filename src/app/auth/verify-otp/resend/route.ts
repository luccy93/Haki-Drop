import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, checkRateLimit } from '@/lib/auth-store';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(`resend-otp:${ip}`)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    const result = await generateOTP(email);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const emailRes = await sendOTPEmail(email, result.otp);
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({
      message: 'OTP resent successfully',
      ...(isDev && !emailRes.sent ? { devOtp: result.otp } : {}),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
