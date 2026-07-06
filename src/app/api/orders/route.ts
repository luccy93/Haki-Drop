import { NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/order-store';

export async function GET() {
  const orders = await getAllOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, amount } = body;
    if (!customer || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      status: 'Pending',
      amount: amount.toString(),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const order = await createOrder(newOrder);
    return NextResponse.json({ message: 'Order created successfully', order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
