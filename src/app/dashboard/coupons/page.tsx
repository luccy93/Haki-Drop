'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Tag, Edit, Trash2 } from 'lucide-react';

const mockCoupons = [
  { id: 1, code: 'GEAR5', discount: '20%', type: 'Percentage', usage: 145, status: 'Active' },
  { id: 2, code: 'FREESHIP', discount: 'Free Shipping', type: 'Shipping', usage: 890, status: 'Active' },
  { id: 3, code: 'WELCOME10', discount: '10%', type: 'Percentage', usage: 34, status: 'Expired' },
];

export default function CouponsPage() {
  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">DISCOUNT CODES</h1>
          <p className="text-neutral-400 text-sm">Create and track promotional coupons.</p>
        </div>
        <button className="px-4 py-2 bg-[#C0001A] text-white rounded-lg hover:bg-[#ff1a38] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
      >
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/[0.02] text-neutral-400 font-bebas tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-center">Usage</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockCoupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-[#F4C430] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-white/50" /> {coupon.code}
                </td>
                <td className="px-6 py-4 text-white">{coupon.discount}</td>
                <td className="px-6 py-4 text-neutral-400">{coupon.type}</td>
                <td className="px-6 py-4 text-center text-white">{coupon.usage} uses</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-xs border ${coupon.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {coupon.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
