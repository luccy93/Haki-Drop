import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  let totalRevenue = 0;
  let pendingOrders = 0;
  let lowStockCount = 0;

  const { data: orders } = await supabase.from('orders').select('*');
  if (orders) {
    pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;
    totalRevenue = orders.reduce((sum: number, o: any) => {
      const amt = parseFloat(String(o.total_amount || o.amount || '0').replace(/,/g, ''));
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }

  const { data: products } = await supabase.from('products').select('*');
  if (products) {
    lowStockCount = products.filter((p: any) => p.stock !== undefined && p.stock < 10).length;
  }

  return NextResponse.json({
    metrics: {
      totalRevenue,
      pendingOrders,
      totalCustomers: 0,
      lowStockCount,
    },
  });
}
