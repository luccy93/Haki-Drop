import { NextRequest, NextResponse } from 'next/server';
import { clearCart } from '@/lib/cart-store';

export async function DELETE(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }
  const result = await clearCart(sessionId);
  return NextResponse.json(result);
}
