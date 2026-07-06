import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrder } from '@/lib/order-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, metadata, items, shippingAddress, userId, userEmail } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing Razorpay parameters' }, { status: 400 });
    }
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret';
    const expectedSig = crypto.createHmac('sha256', secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    const isValid = expectedSig === razorpay_signature;

    if (isValid) {
      const m = metadata || {};
      const total = m.totalAmount || 0;
      const email = userEmail || shippingAddress?.email || 'guest@example.com';
      const name = shippingAddress?.name || (email === 'guest@example.com' ? 'Guest' : email.split('@')[0]);

      const newOrder = {
        id: `ORD-RAZOR-${Date.now()}`,
        userId: userId || null,
        customer: email,
        user: { name, email },
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        shippingAddress: shippingAddress || {},
        status: 'Confirmed',
        totalAmount: total,
        amount: total.toString(),
        items: items || m.items || [],
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        paymentMethod: 'Razorpay',
      };

      const order = await createOrder(newOrder);
      return NextResponse.json({ success: true, verified: true, order }, { status: 201 });
    }

    return NextResponse.json({ verified: false, error: 'Invalid signature' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
