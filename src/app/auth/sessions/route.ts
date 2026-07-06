import { NextRequest, NextResponse } from 'next/server';
import { findSessionByRefreshToken, getUserSessions, verifyAccessToken } from '@/lib/auth-store';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('refreshToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const session = await findSessionByRefreshToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    const activeSessions = await getUserSessions(session.userId);
    const currentSessionId = session.id;
    return NextResponse.json({ sessions: activeSessions, currentSessionId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
