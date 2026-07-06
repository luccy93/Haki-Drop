import { NextRequest, NextResponse } from 'next/server';
import { getCart } from '@/lib/cart-store';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }
  const cart = await getCart(sessionId);
  return NextResponse.json(cart);
}
