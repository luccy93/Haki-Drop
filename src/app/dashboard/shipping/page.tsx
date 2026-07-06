'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Map, Box } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">SHIPPING & FULFILLMENT</h1>
        <p className="text-neutral-400 text-sm">Manage shipping zones, rates, and 3PL integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
          <h2 className="font-bebas text-2xl tracking-widest text-white mb-6">SHIPPING ZONES</h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-white/10 rounded-xl bg-white/[0.01] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg"><Map className="w-6 h-6 text-blue-400" /></div>
                <div>
                  <h3 className="text-white font-medium">Domestic (Thailand)</h3>
                  <p className="text-sm text-neutral-500">Standard & Express Shipping available</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm">Edit Rates</button>
            </div>

            <div className="p-4 border border-white/10 rounded-xl bg-white/[0.01] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg"><Map className="w-6 h-6 text-purple-400" /></div>
                <div>
                  <h3 className="text-white font-medium">International (Global)</h3>
                  <p className="text-sm text-neutral-500">DHL Express & FedEx</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm">Edit Rates</button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4C430]/10 flex items-center justify-center mb-6">
            <Box className="w-8 h-8 text-[#F4C430]" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Automated Fulfillment</h3>
          <p className="text-neutral-400 mb-6 text-sm">Connect your 3PL warehouse to automatically route orders for fulfillment.</p>
          <button className="px-6 py-2 bg-[#C0001A] hover:bg-[#ff1a38] text-white rounded-lg transition-colors w-full">Connect 3PL</button>
        </motion.div>
      </div>
    </div>
  );
}
