'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, initiateCheckout } = useCart();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0f1c] z-50 shadow-2xl border-l border-white/10 flex flex-col text-white"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-bangers text-3xl tracking-widest text-[#F4C430]">YOUR CART</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="font-bebas text-xl text-white/50 hover:text-white transition-colors"
              >
                CLOSE [X]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 overflow-x-hidden">
              {cartItems.length === 0 ? (
                <div className="text-center text-white/50 font-cormorant italic mt-10">
                  Your cart is as empty as the Void Century.
                </div>
              ) : (
                <motion.ul 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-6"
                >
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.li 
                        key={item.variantId} 
                        variants={itemVariants}
                        layout
                        exit="exit"
                        className="flex gap-4 items-center bg-[#1a1f3c] p-4 rounded-xl relative group"
                      >
                        <Link href={`/products/${item.handle}`} onClick={() => setIsCartOpen(false)} className="w-16 h-20 bg-black/50 rounded-lg overflow-hidden shrink-0 block">
                           {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80" />}
                        </Link>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <Link href={`/products/${item.handle}`} onClick={() => setIsCartOpen(false)} className="font-bebas tracking-widest text-lg leading-tight pr-4 hover:text-[#F4C430] transition-colors">{item.title}</Link>
                            {item.size && <span className="text-[#F4C430] font-sans text-xs bg-black/40 px-2 py-1 rounded">{item.size}</span>}
                          </div>
                          <div className="text-[#F7D446] font-bold text-sm mt-1">₹{item.price.toFixed(2)}</div>
                          <div className="flex items-center gap-3 mt-3">
                            <button 
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white/10 rounded hover:bg-white/20"
                            ><Minus size={14} /></button>
                            <span className="font-sans text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white/10 rounded hover:bg-white/20"
                            ><Plus size={14} /></button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.variantId)}
                          className="text-white/30 hover:text-[#ff5a6e] transition-colors p-2 absolute right-2 top-2 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#060a14]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bebas text-xl tracking-widest text-white/70">SUBTOTAL</span>
                  <span className="font-bangers text-3xl text-[#F4C430]">₹{cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => initiateCheckout()}
                  disabled={cartItems.length === 0}
                  className="w-full font-bebas text-xl tracking-widest uppercase px-6 py-4 bg-[#F4C430] text-black hover:bg-[#ffe066] transition-colors rounded-lg disabled:opacity-50"
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
