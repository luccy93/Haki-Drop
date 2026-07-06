'use client';

import React from 'react';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/api/products');
      return data;
    }
  });
  return (
    <main className="min-h-screen bg-[#030108] pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="font-bangers text-6xl tracking-widest text-white drop-shadow-[2px_2px_0_#9333ea] text-center md:text-left uppercase">
          All Products
        </h1>
        <p className="font-sans text-neutral-400 mt-4 text-lg text-center md:text-left max-w-2xl">
          Browse the complete Haki Drop collection. Premium luxury streetwear, accessories, and collectibles.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading Skeletons
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl border border-white/10" />
            ))
          ) : (
            products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_url || product.images?.[0] || '/images/cinematic-bg.png'}
                category={product.category?.name || 'Limited Drop'}
                handle={product.handle || product.id}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
