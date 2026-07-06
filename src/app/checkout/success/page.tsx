'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart upon successful landing on this page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' as const, stiffness: 200, damping: 20 }}
      >
        <CheckCircle className="w-32 h-32 text-green-500 mb-8 mx-auto" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-bangers tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4 text-center"
      >
        ORDER CONFIRMED
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-400 text-center max-w-lg mb-12"
      >
        Thank you for your purchase. We are processing your order and will email you the receipt and tracking details soon.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/collections/all" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-sm hover:bg-gray-200 transition-colors">
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}
