'use client';

import React, { useLayoutEffect, useRef, use, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import api from '@/lib/axios';

gsap.registerPlugin(ScrollTrigger);

const HoloFoilCard = ({ children, className }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-200, 200], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-200, 200], [-15, 15]);

  const handleMouse = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className={`${className} perspective-[1000px]`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="w-full h-full relative z-0">
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)`,
            x: useTransform(mouseXSpring, [-200, 200], [-50, 50]),
            y: useTransform(mouseYSpring, [-200, 200], [-50, 50])
          }}
        />
        {children}
      </div>
    </motion.div>
  );
};

const PhysicsWrapper = ({ collection, children, className }: { collection: string, children: React.ReactNode, className?: string }) => {
  if (collection === 'cards') {
    return <HoloFoilCard className={className}>{children}</HoloFoilCard>;
  }
  if (collection === 'stickers') {
    return (
      <motion.div 
        drag 
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
        dragElastic={0.8}
        className={`${className} cursor-grab active:cursor-grabbing shadow-[0_5px_15px_rgba(0,0,0,0.5)]`}
      >
        {children}
      </motion.div>
    );
  }
  if (collection === 'toys') {
    return (
      <motion.div 
        whileHover={{ scale: 1.06, rotate: 3, y: -5 }} 
        transition={{ type: 'spring' as const, stiffness: 120, damping: 14 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
  
  // default (tees & hoodies)
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring' as const, stiffness: 120, damping: 14 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const headerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  
  // Filter States
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  useLayoutEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        const data = res.data;
        // Map local API product structure to match UI expectations
        const catToSlug: Record<string, string> = {
          'Tees': 'tees', 'Hoodies & Outerwear': 'hoodies',
          'Stickers & Decals': 'stickers', 'Trading Cards': 'cards',
          'Toys & Figures': 'toys'
        }
        const formattedProducts = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0] || '/images/cinematic-bg.png',
          collection: catToSlug[p.category] || 'tees',
          handle: p.handle || p.id,
          status: 'AVAILABLE',
          tags: ['NEW'],
          tier: 'SS',
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        }));
          
          if (handle === 'all') {
            setProducts(formattedProducts);
          } else {
            setProducts(formattedProducts.filter((p: any) => p.collection === handle));
          }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    
    fetchProducts();
  }, [handle]);

  const isAll = handle === 'all';
  const categories = isAll 
    ? ['tees', 'hoodies', 'stickers', 'cards', 'toys']
    : [handle];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Dynamic sorting header levitation on scroll
      gsap.to(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top top',
          end: '+=200',
          scrub: true,
        },
        y: 20,
        backgroundColor: 'rgba(4, 6, 12, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '24px',
        paddingTop: '24px',
      });
    });
    return () => ctx.revert();
  }, []);

  // Apply Filters & Sorting
  const filteredProducts = products.filter(p => {
    if (minPrice && p.rawPrice < Number(minPrice)) return false;
    if (maxPrice && p.rawPrice > Number(maxPrice)) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some(s => p.sizes.includes(s))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.rawPrice - b.rawPrice;
    if (sortBy === 'price-desc') return b.rawPrice - a.rawPrice;
    return 0; // featured
  });

  return (
    <main className="min-h-screen bg-[#04060c] pt-32 pb-24 px-6 text-white font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 relative">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-32 flex flex-col gap-8 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8 pr-2 custom-scrollbar">
            <div>
              <h2 className="font-bangers text-4xl tracking-widest text-[#F4C430] mb-6">FILTERS</h2>
              
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-bebas tracking-widest text-lg mb-3 text-white/80">CATEGORY</h3>
                  <div className="flex flex-col gap-2">
                    {['All', 'Tees', 'Hoodies', 'Stickers', 'Cards', 'Toys'].map(cat => {
                      const isActive = handle === cat.toLowerCase();
                      return (
                        <Link 
                          key={cat} 
                          href={`/collections/${cat.toLowerCase()}`} 
                          className={`text-sm py-1 font-sans transition-colors ${isActive ? 'text-[#F4C430] font-bold' : 'text-neutral-400 hover:text-white'}`}
                        >
                          {cat}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-bebas tracking-widest text-lg mb-3 text-white/80">PRICE</h3>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#F4C430] focus:outline-none transition-colors" 
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#F4C430] focus:outline-none transition-colors" 
                    />
                  </div>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-bebas tracking-widest text-lg mb-3 text-white/80">SIZE</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button 
                          key={size} 
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSizes(selectedSizes.filter(s => s !== size));
                            } else {
                              setSelectedSizes([...selectedSizes, size]);
                            }
                          }}
                          className={`border rounded py-2 text-sm transition-colors ${isSelected ? 'bg-[#F4C430] text-black border-[#F4C430] font-bold' : 'bg-white/5 border-white/10 hover:border-[#F4C430] hover:bg-white/10 text-white'}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Dynamic Sorting Header */}
          <div ref={headerRef} className="sticky top-20 z-20 flex justify-between items-center mb-8 pb-4 -mx-6 px-6 md:mx-0 md:px-0">
            <h1 className="font-bangers text-5xl tracking-widest uppercase drop-shadow-[2px_2px_0_#b3001a]">
              {handle.replace('-', ' ')}
            </h1>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#F4C430] cursor-pointer appearance-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex flex-col gap-16">
            {isAll && sortBy === 'featured' ? (
              categories.map(category => {
                const categoryProducts = filteredProducts.filter(p => p.collection === category);
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category}>
                    <h2 className="font-bebas text-3xl tracking-widest text-[#F4C430] mb-8 border-b border-white/10 pb-4 uppercase">
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryProducts.map((product) => (
                        <Link key={product.id} href={`/products/${product.handle}`}>
                          <PhysicsWrapper
                            collection={product.collection}
                            className="group relative bg-[#0a0f1c] rounded-2xl p-4 border border-white/10 overflow-hidden flex flex-col items-center text-center h-full"
                          >
                            <div className="w-full h-80 bg-[#1a1f3c] rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                              <img src={product.image || '/images/cinematic-bg.png'} alt={product.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="font-bebas text-xl tracking-widest mb-1 mt-auto">{product.name}</h3>
                            <p className="font-sans text-[#F7D446] font-bold mt-2">
                              ₹{product.price?.toFixed(2)} INR
                            </p>
                          </PhysicsWrapper>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.handle}`}>
                    <PhysicsWrapper
                      collection={product.collection || product.category}
                      className="group relative bg-[#0a0f1c] rounded-2xl p-4 border border-white/10 overflow-hidden flex flex-col items-center text-center h-full"
                    >
                      <div className="w-full h-80 bg-[#1a1f3c] rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                        <img src={product.image || '/images/cinematic-bg.png'} alt={product.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-bebas text-xl tracking-widest mb-1 mt-auto">{product.name}</h3>
                      <p className="font-sans text-[#F7D446] font-bold mt-2">
                        {product.price}
                      </p>
                    </PhysicsWrapper>
                  </Link>
                ))}
              </div>
            )}
            
            {filteredProducts.length === 0 && products.length > 0 && (
              <div className="text-center py-24 border border-white/10 rounded-2xl bg-white/5">
                <h3 className="font-bangers text-3xl tracking-widest text-neutral-500">NO MATCHES</h3>
                <p className="text-neutral-600 mt-2">Try adjusting your filters.</p>
              </div>
            )}
            
            {products.length === 0 && (
              <div className="text-center py-24 border border-white/10 rounded-2xl bg-white/5">
                <h3 className="font-bangers text-3xl tracking-widest text-neutral-500">NO PRODUCTS FOUND</h3>
                <p className="text-neutral-600 mt-2">Add products to your store via the Admin Control Center.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
