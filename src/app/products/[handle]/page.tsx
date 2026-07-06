import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from './ProductDetailClient';

async function getProduct(handle: string) {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .or(`handle.eq.${handle},id.eq.${handle}`)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  try {
    const { handle } = await params;
    const product = await getProduct(handle);
    if (!product) return { title: 'Product Not Found' };

    return {
      title: product.name,
      description: product.description?.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 160),
        images: [{ url: product.image || product.image_url || product.images?.[0] || '' }]
      }
    };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <ProductDetailClient handle={handle} />;
}
