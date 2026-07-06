'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ChevronDown, Truck, ShieldCheck, Shirt, Ruler, Box, Image as ImageIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Product3DViewer from '@/components/Product3DViewer';

function getProductImages(product: any): string[] {
  if (product.images?.length) return product.images;
  if (product.image) return [product.image];
  if (product.image_url) return [product.image_url];
  return ['/images/cinematic-bg.png'];
}

export default function ProductDetailClient({ handle }: { handle: string }) {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const { data } = await api.get(`/api/products/${handle}`);
      return data;
    }
  });

  const productImages = useMemo(() => product ? getProductImages(product) : [], [product]);

  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [direction, setDirection] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('features');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = offset.x;
    if (swipe < -50 && activeImage < productImages.length - 1) {
      setDirection(1);
      setActiveImage(prev => prev + 1);
    } else if (swipe > 50 && activeImage > 0) {
      setDirection(-1);
      setActiveImage(prev => prev - 1);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ 
      id: product.id, 
      variantId: `${product.id}-${selectedSize}`,
      size: selectedSize,
      title: product.name, 
      price: product.price, 
      currencyCode: 'INR',
      quantity: 1, 
      image: productImages[0]
    });
  };

  const accordions = [
    {
      id: 'features',
      title: 'FEATURES & FABRIC',
      icon: <Shirt size={20} className="text-white/60" />,
      content: "Crafted from our proprietary ultra-heavyweight 400GSM cotton. Double-stitched reinforced seams ensure lifetime durability. The oversized dropped-shoulder block creates an effortless luxury drape. Pre-shrunk and silicone washed for a cashmere-like hand feel from day one."
    },
    {
      id: 'shipping',
      title: 'SHIPPING & RETURNS',
      icon: <Truck size={20} className="text-white/60" />,
      content: "Complimentary express shipping on all orders over $150. Due to the limited edition nature of these drops, please allow 2-3 business days for processing. We accept returns within 14 days of delivery for store credit only, provided the tags remain attached and the garment is unworn."
    },
    {
      id: 'care',
      title: 'CARE INSTRUCTIONS',
      icon: <ShieldCheck size={20} className="text-white/60" />,
      content: "To preserve the ultra-high density prints and luxury fabric: Machine wash cold inside-out on a delicate cycle. Do not bleach. Lay flat to dry in the shade. Do not iron directly on graphics. Dry clean recommended for maximum longevity."
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#04060c] pt-24 md:pt-32 pb-32 flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 bg-white/10 rounded-full" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#04060c] pt-24 md:pt-32 pb-32 flex items-center justify-center text-white text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#04060c] pt-24 md:pt-32 pb-32 md:pb-24 text-white font-sans selection:bg-purple-500/30">
      
      {/* Background Ambient Glow */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative z-10">
        
        {/* Animated Multi-Image Gallery Carousel */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 md:gap-6 h-[600px] md:h-[850px] md:sticky md:top-32">
          
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 w-full md:w-24 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden">
            {productImages.map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => {
                  setDirection(idx > activeImage ? 1 : -1);
                  setActiveImage(idx);
                }}
                className={`relative w-20 md:w-full h-24 md:h-32 rounded-xl overflow-hidden border transition-all duration-300 flex-shrink-0 ${activeImage === idx ? 'border-white opacity-100' : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'}`}
              >
                <div className="absolute inset-0 bg-[#0C0C0E]" />
                <img src={img} className="relative z-10 object-contain w-full h-full p-2" alt="thumbnail" />
              </button>
            ))}
          </div>

          {/* Main Hero Image or 3D Viewer */}
          <div className="flex-1 relative bg-[#0C0C0E] rounded-3xl border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center group">
            {/* View Mode Toggle */}
            <div className="absolute top-4 right-4 z-50 flex bg-black/50 backdrop-blur-md rounded-full border border-white/10 p-1">
              <button 
                onClick={() => setViewMode('2d')} 
                className={`p-2 rounded-full transition-colors ${viewMode === '2d' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                title="2D Gallery"
              >
                <ImageIcon size={18} />
              </button>
              <button 
                onClick={() => setViewMode('3d')} 
                className={`p-2 rounded-full transition-colors ${viewMode === '3d' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'}`}
                title="3D Viewer"
              >
                <Box size={18} />
              </button>
            </div>

            {viewMode === '3d' ? (
              <Product3DViewer modelUrl={product.modelUrl} />
            ) : (
              <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing relative">
                {/* Cinematic Glow Behind Product */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.03)_0%,_transparent_60%)]" />
                
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                  <motion.img
                    key={activeImage}
                    src={productImages[activeImage]}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="absolute w-[80%] max-h-[80%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                    alt="Product View"
                  />
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="lg:col-span-5 flex flex-col pt-4 md:pt-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-white/40 uppercase mb-8">
            <span className="hover:text-white transition-colors cursor-pointer">HOME</span>
            <span>/</span>
            <span className="hover:text-white transition-colors cursor-pointer">{product.category?.name || 'PRODUCTS'}</span>
            <span>/</span>
            <span className="text-white/80">{product.name.split('//')[0]}</span>
          </div>

          {/* Live Inventory Ticker */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#ff1a38]/10 border border-[#ff1a38]/30 text-[#ff1a38] px-3 py-1.5 rounded-sm font-bebas tracking-widest text-sm self-start mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a38] animate-pulse" />
            LIMITED EDITION DROP
          </motion.div>

          {/* Title & Price */}
          <h1 className="font-bebas text-5xl md:text-7xl tracking-wider uppercase leading-[0.9] mb-6 drop-shadow-xl">
            {product.name.split('//').map((part: string, i: number) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-purple-500 mx-2">//</span>}
                {part}
              </React.Fragment>
            ))}
          </h1>
          
          <p className="font-sans text-2xl md:text-3xl font-light text-white mb-10">
            ₹{product.price.toFixed(2)} <span className="text-sm text-white/40 ml-1">INR</span>
          </p>

          <p className="font-sans text-lg text-white/60 leading-relaxed font-light mb-12">
            {product.description}
          </p>

          {/* Variant Swatches */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <span className="font-bebas text-lg tracking-widest text-white/60">SELECT SIZE</span>
              <button className="flex items-center gap-1 text-white/40 text-xs hover:text-white transition-colors uppercase tracking-widest">
                <Ruler size={14} /> Size Guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 md:gap-3">
              {product.variants?.map((variant: any) => (
                <button
                  key={variant.size || variant.name}
                  onClick={() => setSelectedSize(variant.size || variant.name)}
                  className={`font-bebas text-xl md:text-2xl tracking-widest py-3 rounded-md border transition-all duration-300 ${
                    selectedSize === (variant.size || variant.name) 
                    ? 'border-white bg-white text-black' 
                    : 'border-white/20 bg-transparent text-white/70 hover:border-white hover:bg-white/5'
                  } ${variant.stock === 0 ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                  disabled={variant.stock === 0}
                >
                  {variant.size || variant.name}
                </button>
              )) || (
                // Fallback size selection if no variants returned from DB
                ['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`font-bebas text-xl md:text-2xl tracking-widest py-3 rounded-md border transition-all duration-300 ${
                      selectedSize === size
                      ? 'border-white bg-white text-black' 
                      : 'border-white/20 bg-transparent text-white/70 hover:border-white hover:bg-white/5'
                    }`}
                  >
                    {size}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-4 mb-16 hidden md:flex">
            <button
              onClick={handleAddToCart}
              className="w-full font-bebas text-2xl tracking-widest uppercase px-8 py-5 bg-white text-black hover:bg-neutral-200 transition-colors rounded-sm flex items-center justify-center gap-2"
            >
              ADD TO CART
            </button>
          </div>

          {/* Premium Accordions */}
          <div className="border-t border-white/10">
            {accordions.map((acc) => (
              <div key={acc.id} className="border-b border-white/10">
                <button 
                  onClick={() => toggleAccordion(acc.id)}
                  className="w-full py-6 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    {acc.icon}
                    <span className="font-bebas tracking-widest text-lg group-hover:text-purple-400 transition-colors">{acc.title}</span>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-white/40 transition-transform duration-300 ${openAccordion === acc.id ? 'rotate-180 text-white' : ''}`}
                  />
                </button>
                
                <AnimatePresence>
                  {openAccordion === acc.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-sm text-white/50 leading-relaxed pb-6 font-light">
                        {acc.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0f1c]/90 backdrop-blur-xl border-t border-white/10 p-4 z-50 flex items-center gap-4">
        <div className="flex flex-col flex-1">
          <span className="text-xs font-bold text-white/60 line-clamp-1">{product.name}</span>
          <span className="text-sm font-bold text-white">₹{product.price.toFixed(2)} - Size: {selectedSize}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-white text-black font-bebas tracking-widest px-6 py-3 rounded-sm whitespace-nowrap active:scale-95 transition-transform"
        >
          ADD TO CART
        </button>
      </div>

    </main>
  );
}
