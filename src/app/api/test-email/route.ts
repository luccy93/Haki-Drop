import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email') || 'pookrish81@gmail.com';
  const testOtp = '777777';
  try {
    console.log('[TEST] SMTP_USER:', process.env.SMTP_USER ? 'set' : 'NOT SET');
    console.log('[TEST] SMTP_PASS:', process.env.SMTP_PASS ? 'set' : 'NOT SET');
    const result = await sendOTPEmail(email, testOtp);
    return NextResponse.json({ success: true, result, env: { smtpUser: !!process.env.SMTP_USER, smtpPass: !!process.env.SMTP_PASS } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack }, { status: 500 });
  }
}
