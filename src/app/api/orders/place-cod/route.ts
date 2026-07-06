import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/order-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, userId, userEmail } = body;
    const total = (items || []).reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0), 0);

    const email = userEmail || shippingAddress?.email || 'guest@example.com';
    const name = shippingAddress?.name || (email === 'guest@example.com' ? 'Guest' : email.split('@')[0]);

    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId: userId || null,
      customer: email,
      user: { name, email },
      shippingAddress,
      status: 'COD - Pending Payment',
      totalAmount: total,
      amount: total.toString(),
      items: items || [],
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      paymentMethod: 'Cash on Delivery',
    };

    const order = await createOrder(newOrder);
    return NextResponse.json({ success: true, orderId: order.id, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
