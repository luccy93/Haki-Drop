import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: products } = await supabase.from('products').select('*').order('created_at');
  return NextResponse.json(products || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, image_url } = body;
    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newProduct = {
      id: `prd-${Date.now()}`,
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image_url: image_url || null,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('products').insert(newProduct).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Product created successfully', product: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
