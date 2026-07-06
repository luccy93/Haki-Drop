import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingMethod, gateway } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const { data: products } = await supabase.from('products').select('*');
    let subtotal = 0;
    for (const item of items) {
      const product = (products || []).find((p: any) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      }
      subtotal += Number(product.price) * (item.quantity || 1);
    }

    const shippingFee = shippingMethod === 'EXPRESS' ? 2500 : shippingMethod === 'STORE_PICKUP' ? 0 : 1000;
    const taxAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + shippingFee + taxAmount;

    return NextResponse.json({
      clientSecret: 'mock_client_secret_123',
      paymentIntentId: `pi_mock_${Date.now()}`,
      subtotal,
      taxAmount,
      shippingFee,
      totalAmount,
      metadata: { items, subtotal, shippingFee, taxAmount, totalAmount, shippingMethod, gateway },
      amount: totalAmount,
      currency: 'INR',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
