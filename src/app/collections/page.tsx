'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const collections = [
  { name: 'Tees', handle: 'tees', image: '/images/products/drums-of-liberation-oversized-tee-1.png' },
  { name: 'Hoodies & Outerwear', handle: 'hoodies', image: '/images/products/nika-liberator-heavyweight-hoodie-1.jpg' },
  { name: 'Stickers & Decals', handle: 'stickers', image: '/images/products/gear-5-reveal-holographic-sticker-1.jpg' },
  { name: 'Trading Cards', handle: 'cards', image: '/images/products/nika-the-sun-god-gold-foil-art-print-1.jpg' },
  { name: 'Toys & Figures', handle: 'toys', image: '/images/products/gear-5-vinyl-designer-toy-1.jpg' },
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#030108] pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="font-bangers text-6xl tracking-widest text-white drop-shadow-[2px_2px_0_#9333ea] text-center md:text-left uppercase">
          Collections
        </h1>
        <p className="font-sans text-neutral-400 mt-4 text-lg text-center md:text-left max-w-2xl">
          Explore by category to find exactly what you're looking for.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <Link key={col.handle} href={`/collections/${col.handle}`} className="block group">
              <motion.div
                className="relative w-full h-[400px] bg-[#020104] rounded-[16px] border border-white/5 overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -8 }}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-300 z-10 pointer-events-none" />
                
                {/* Background Image / Placeholder */}
                <div className="absolute inset-0 z-0">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(255,255,255,0.03)_0%,_transparent_60%)]" />
                   {/* In a real app we would show a nice lifestyle image. For now, we center a product image. */}
                   <div className="w-full h-full flex items-center justify-center pt-8">
                      <img 
                        src={col.image} 
                        alt={col.name} 
                        className="w-[60%] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100" 
                      />
                   </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#020104] via-[#020104]/80 to-transparent z-10 pointer-events-none" />

                <div className="absolute bottom-0 w-full p-8 z-20 flex flex-col items-center pointer-events-none">
                  <h3 className="font-bebas text-4xl text-white tracking-widest uppercase mb-2 group-hover:text-purple-400 transition-colors duration-300">
                    {col.name}
                  </h3>
                  <span className="font-sans text-sm font-bold tracking-widest text-[#F4C430]">
                    VIEW COLLECTION
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
