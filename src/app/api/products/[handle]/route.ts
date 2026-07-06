import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .or(`handle.eq.${handle},id.eq.${handle}`)
    .maybeSingle();

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}
