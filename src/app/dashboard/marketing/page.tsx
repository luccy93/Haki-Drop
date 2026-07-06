'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Mail } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">MARKETING CAMPAIGNS</h1>
        <p className="text-neutral-400 text-sm">Engage customers and boost conversions with targeted campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#C0001A]/10 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[#C0001A]" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Email Automations</h3>
          <p className="text-neutral-400 mb-6">Set up abandoned cart recovery, welcome flows, and win-back emails.</p>
          <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors w-full border border-white/10">Configure</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
            <Send className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Push Notifications</h3>
          <p className="text-neutral-400 mb-6">Send instant alerts to mobile and web users for flash sales.</p>
          <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors w-full border border-white/10">Configure</button>
        </motion.div>
      </div>
    </div>
  );
}
