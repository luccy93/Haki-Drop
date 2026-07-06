import { NextRequest, NextResponse } from 'next/server';
import { addToCart } from '@/lib/cart-store';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, productId, variantId, quantity } = await request.json();
    if (!sessionId || !productId) {
      return NextResponse.json({ error: 'sessionId and productId are required' }, { status: 400 });
    }
    const result = await addToCart(sessionId, productId, variantId || '', quantity || 1);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
