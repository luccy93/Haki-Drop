import { NextResponse } from 'next/server';
import { getOrderById, updateOrder, getAllOrders } from '@/lib/order-store';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const cancellable = ['Pending', 'Confirmed', 'PROCESSING', 'COD - Pending Payment'];
    if (body.action === 'cancel') {
      if (!cancellable.includes(order.status)) {
        return NextResponse.json({ error: 'Order cannot be cancelled at this stage' }, { status: 400 });
      }
      const updated = await updateOrder(id, { status: 'Cancelled', cancelledAt: new Date().toISOString() });
      return NextResponse.json({ success: true, order: updated });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
