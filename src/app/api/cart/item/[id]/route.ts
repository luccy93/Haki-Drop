import { NextRequest, NextResponse } from 'next/server';
import { removeCartItem, updateCartItemQuantity } from '@/lib/cart-store';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }
    const result = await removeCartItem(sessionId, id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('DELETE /api/cart/item/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Read body as text first to avoid Next.js 16 proxy issues with .json()
    const text = await request.text();
    const { quantity, sessionId } = JSON.parse(text);
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }
    const result = await updateCartItemQuantity(sessionId, id, quantity);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('PUT /api/cart/item/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
