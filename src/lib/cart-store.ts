import { supabase } from './supabase';

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    images: string[];
    handle: string;
  };
}

interface Cart {
  items: CartItem[];
  updatedAt: string;
}

function rowToItem(row: any): CartItem {
  return {
    id: row.id,
    productId: row.productId,
    variantId: row.variantId || '',
    quantity: row.quantity,
    product: {
      name: row.productName,
      price: Number(row.productPrice),
      images: row.productImages || [],
      handle: row.productHandle,
    },
  };
}

function generateId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

async function findProduct(productId: string) {
  const { data } = await supabase.from('products').select('*').eq('id', productId).maybeSingle();
  return data || null;
}

export async function getCart(sessionId: string): Promise<Cart> {
  const { data } = await supabase.from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  const items: CartItem[] = (data || []).map(rowToItem);
  return { items, updatedAt: new Date().toISOString() };
}

export async function addToCart(sessionId: string, productId: string, variantId: string, quantity: number) {
  const product = await findProduct(productId);
  if (!product) {
    return { error: 'Product not found', status: 404 };
  }

  // Check for existing item
  const { data: existing } = await supabase.from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId)
    .eq('variant_id', variantId || '')
    .maybeSingle();

  if (existing) {
    // Update quantity
    const newQty = existing.quantity + quantity;
    await supabase.from('cart_items')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    // Insert new item
    const item = {
      id: generateId(),
      session_id: sessionId,
      user_id: null,
      product_id: productId,
      variant_id: variantId || '',
      quantity,
      product_name: product.name,
      product_price: Number(product.price),
      product_images: product.images?.length ? JSON.stringify(product.images) : '[]',
      product_handle: product.handle || product.id,
    };
    await supabase.from('cart_items').insert(item);
  }

  const cart = await getCart(sessionId);
  return { items: cart.items };
}

export async function removeCartItem(sessionId: string, itemId: string) {
  await supabase.from('cart_items').delete().eq('id', itemId).eq('session_id', sessionId);
  const cart = await getCart(sessionId);
  return { items: cart.items };
}

export async function updateCartItemQuantity(sessionId: string, itemId: string, quantity: number) {
  const { data: existing } = await supabase.from('cart_items')
    .select('*')
    .eq('id', itemId)
    .eq('session_id', sessionId)
    .maybeSingle();

  if (!existing) {
    return { error: 'Item not found', status: 404 };
  }

  await supabase.from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', itemId);

  const cart = await getCart(sessionId);
  return { items: cart.items };
}

export async function clearCart(sessionId: string) {
  await supabase.from('cart_items').delete().eq('session_id', sessionId);
  return { items: [] };
}

export async function mergeCart(sessionId: string) {
  const cart = await getCart(sessionId);
  return { items: cart.items };
}
