'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import api from '@/lib/axios';

export default function ProductGrid() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/api/products');
      return data;
    }
  });

  const limitedProducts = React.useMemo(() => {
    if (!products) return [];
    
    const seenCategories = new Set();
    const diverseProducts = [];
    
    for (const product of products) {
      const catId = product.categoryId || product.category?.id || 'default';
      if (!seenCategories.has(catId)) {
        seenCategories.add(catId);
        diverseProducts.push(product);
      }
      if (diverseProducts.length === 4) break;
    }
    
    // Fill up to 4 if we don't have enough categories
    if (diverseProducts.length < 4) {
      for (const product of products) {
        if (!diverseProducts.find((p: any) => p.id === product.id)) {
          diverseProducts.push(product);
        }
        if (diverseProducts.length === 4) break;
      }
    }
    
    return diverseProducts;
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full flex flex-col gap-24">
      <div>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-12"
        >
          <h2 className="font-bangers text-5xl tracking-widest text-[#F4C430] drop-shadow-[2px_2px_0_#b3001a] text-center md:text-left">
            LIMITED EDITION DROPS
          </h2>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 min-h-[400px]"
          >
            {isLoading ? (
              // Loading skeletons
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl border border-white/10" />
              ))
            ) : (
              limitedProducts.map((product: any) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url || product.images?.[0] || '/images/cinematic-bg.png'}
                    category={product.category || 'Limited Drop'}
                    handle={product.handle || product.id}
                    backgroundImage="/images/cinematic-bg.png"
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
