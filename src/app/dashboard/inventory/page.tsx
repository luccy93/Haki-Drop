'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">INVENTORY INTELLIGENCE</h1>
        <p className="text-neutral-400 text-sm">Monitor stock levels, velocity, and reorder points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg"><BarChart3 className="w-5 h-5 text-blue-400" /></div>
            <h3 className="text-white font-medium">Total Units</h3>
          </div>
          <p className="text-4xl font-bangers tracking-widest text-white">12,450</p>
          <p className="text-sm text-green-400 flex items-center gap-1 mt-2"><ArrowUpRight className="w-4 h-4" /> +4.2% this month</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#F4C430]/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-[#F4C430]" /></div>
            <h3 className="text-white font-medium">Low Stock Alerts</h3>
          </div>
          <p className="text-4xl font-bangers tracking-widest text-[#F4C430]">3</p>
          <p className="text-sm text-neutral-400 mt-2">Requires immediate attention</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center"
      >
        <BarChart3 className="w-16 h-16 text-white/10 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Advanced Inventory Coming Soon</h3>
        <p className="text-neutral-400 max-w-md mx-auto">Full predictive stock modeling, multi-warehouse support, and automated re-ordering are scheduled for the next major release.</p>
      </motion.div>
    </div>
  );
}
