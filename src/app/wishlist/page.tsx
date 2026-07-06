'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist, WishlistItem } from '@/context/WishlistContext';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuickAdd = (product: WishlistItem) => {
    addToCart({ 
      id: product.id, 
      variantId: `${product.id}-OS`,
      size: 'OS',
      title: product.title, 
      price: product.price, 
      currencyCode: product.currencyCode, 
      quantity: 1, 
      image: product.image 
    });
    // Optional: remove from wishlist upon adding to cart
    removeFromWishlist(product.id);
  };

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }
  };

  return (
    <main className="min-h-screen bg-[#04060c] pt-32 pb-24 px-6 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="font-bangers text-5xl tracking-widest text-[#F4C430] drop-shadow-[2px_2px_0_#b3001a]">
              YOUR WISHLIST
            </h1>
            <p className="font-bebas text-xl text-white/50 tracking-widest mt-2">
              {wishlistItems.length} SAVED TREASURES
            </p>
          </div>
          <Link href="/dashboard" className="font-bebas text-lg text-white/50 hover:text-white transition-colors">
            &larr; BACK TO DASHBOARD
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-[#0a0f1c] border border-white/10 rounded-3xl"
          >
            <h2 className="font-bebas text-3xl tracking-widest text-white/50 mb-4">YOUR WISHLIST IS EMPTY</h2>
            <Link href="/collections/all">
              <button className="font-bebas text-xl tracking-widest uppercase px-6 py-3 bg-transparent text-white border-2 border-[#F4C430] hover:bg-[#F4C430] hover:text-black transition-colors rounded">
                EXPLORE COLLECTION
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {wishlistItems.map((product) => (
                <motion.div
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={product.id}
                  className="group relative bg-[#0a0f1c] rounded-2xl p-4 border border-white/10 overflow-hidden flex flex-col"
                >
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur text-white/50 hover:text-[#ff5a6e] hover:bg-black transition-colors flex items-center justify-center font-bold text-lg"
                  >
                    &times;
                  </button>

                  <Link href={`/products/${product.handle}`} className="block relative w-full h-72 bg-[#1a1f3c] rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt={product.title} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="font-bebas text-xl tracking-widest mb-1">{product.title}</h3>
                    <p className="font-sans text-[#F7D446] font-bold mb-6">
                      ₹{product.price.toFixed(2)} {product.currencyCode}
                    </p>
                    
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="mt-auto font-bebas text-lg tracking-widest uppercase px-4 py-3 bg-[#C0001A] text-white hover:bg-[#ff1a38] transition-colors rounded shadow-[0_0_15px_rgba(192,0,26,0.3)] w-full"
                    >
                      QUICK ADD TO CART
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}
