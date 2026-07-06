'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  backgroundImage?: string; // Kept for backwards compatibility but not used
  category?: string;
  handle?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  handle
}: ProductCardProps) {
  const linkHref = handle ? `/products/${handle}` : `/products/${id}`;
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        handle: handle || id,
        title: name,
        price,
        currencyCode: 'INR',
        image
      });
    }
  };

  return (
    <Link href={linkHref} className="block group">
      <motion.div
        className="relative w-full h-[500px] md:h-[550px] bg-[#020104] rounded-[16px] border border-white/5 overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ y: -8 }}
      >
        {/* Subtle Hover Glow */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-300 pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)] transition-shadow duration-300 rounded-[16px] pointer-events-none z-20" />

        {/* WISHLIST BUTTON */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-40 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors group/btn"
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={inWishlist ? { scale: [1, 1.2, 1] } : {}}
          >
            <Heart 
              size={20} 
              className={`transition-colors duration-300 ${inWishlist ? 'fill-[#ff5a6e] text-[#ff5a6e]' : 'text-white/50 group-hover/btn:text-white'}`} 
            />
          </motion.div>
        </button>

        {/* HERO PRODUCT AREA */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-20">
          
          {/* Subtle Radial Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(255,255,255,0.03)_0%,_transparent_60%)] pointer-events-none" />

          {/* Floating Product Image */}
          <motion.div 
            className="relative z-20 w-[85%] max-w-[280px] aspect-square flex items-center justify-center mt-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <motion.img 
              src={image} 
              alt={name}
              className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] filter brightness-95 group-hover:brightness-100"
              style={{ transformOrigin: 'center bottom' }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        </div>

        {/* INFORMATION AREA */}
        <div className="absolute bottom-0 w-full p-8 pt-24 bg-gradient-to-t from-[#020104] via-[#020104]/90 to-transparent z-30 flex flex-col items-center justify-end pointer-events-none">
          
          {/* Subtitle / Category */}
          {category && (
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-2">
              {category}
            </span>
          )}

          {/* Product Title */}
          <h3 className="font-bebas text-2xl text-center text-white leading-tight tracking-wide uppercase mb-2 line-clamp-2 transition-colors duration-300">
            {name.replace('//', '\n//')}
          </h3>

          {/* Pricing */}
          <p className="font-sans text-sm tracking-wider text-neutral-400 group-hover:text-white transition-colors duration-300">
            ₹{price.toFixed(2)} INR
          </p>

        </div>

      </motion.div>
    </Link>
  );
}
