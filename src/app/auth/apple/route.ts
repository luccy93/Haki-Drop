import { NextRequest, NextResponse } from 'next/server';
import { authenticateWithProvider, createSession, generateAccessToken, checkRateLimit } from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const { idToken, user: appleUser } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'Apple identity token is required' }, { status: 400 });
    }
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(`apple-auth:${ip}`)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    const appleRes = await fetch(`https://appleid.apple.com/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID || '',
        client_secret: process.env.APPLE_CLIENT_SECRET || '',
        id_token: idToken,
        grant_type: 'authorization_code',
      }),
    });
    if (!appleRes.ok) {
      return NextResponse.json({ error: 'Invalid Apple token' }, { status: 401 });
    }
    const appleData = await appleRes.json();
    const jwtPayload = JSON.parse(Buffer.from(appleData.id_token.split('.')[1], 'base64url').toString());
    const appleId = jwtPayload.sub;
    const email = jwtPayload.email || appleUser?.email || `apple-${appleId}@private.appleid.com`;
    const name = appleUser?.name?.firstName
      ? `${appleUser.name.firstName} ${appleUser.name.lastName || ''}`.trim()
      : 'Apple User';
    const result = await authenticateWithProvider('apple', appleId, email, name);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const ua = request.headers.get('user-agent') || 'unknown';
    const ipAddr = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const session = await createSession(result.user.id, ua, ipAddr);
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
