import { supabase } from './supabase';

const camelToSnake = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`),
      v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date) ? camelToSnake(v) : v,
    ])
  );
};

const snakeToCamel = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, l) => l.toUpperCase()),
      v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date) ? snakeToCamel(v) : v,
    ])
  );
};

export async function getAllOrders() {
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return (data || []).map(snakeToCamel);
}

export async function getOrderById(id: string) {
  const { data } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
  return data ? snakeToCamel(data) : null;
}

export async function createOrder(order: any) {
  const dbOrder = {
    ...camelToSnake(order),
    user_info: order.user ? order.user : undefined,
    shipping_address: order.shippingAddress || order.shipping_address,
  };
  delete dbOrder.user;
  delete dbOrder.shippingAddress;
  const { data, error } = await supabase.from('orders').insert(dbOrder).select().single();
  if (error) throw new Error(error.message);
  return snakeToCamel(data);
}

export async function updateOrder(id: string, updates: any) {
  const dbUpdates: any = {};
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.cancelledAt) dbUpdates.cancelled_at = updates.cancelledAt;
  if (updates.razorpayOrderId) dbUpdates.razorpay_order_id = updates.razorpayOrderId;
  if (updates.razorpayPaymentId) dbUpdates.razorpay_payment_id = updates.razorpayPaymentId;
  const { data, error } = await supabase.from('orders').update(dbUpdates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return snakeToCamel(data);
}
