'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, User, MoreVertical, Shield } from 'lucide-react';

const mockCustomers = [
  { id: 'CUS-101', name: 'Monkey D. Luffy', email: 'luffy@strawhats.com', orders: 12, totalSpent: 45000, status: 'VIP' },
  { id: 'CUS-102', name: 'Roronoa Zoro', email: 'zoro@strawhats.com', orders: 3, totalSpent: 12000, status: 'Active' },
  { id: 'CUS-103', name: 'Nami', email: 'nami@strawhats.com', orders: 45, totalSpent: 125000, status: 'VIP' },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">CUSTOMERS</h1>
          <p className="text-neutral-400 text-sm">View and manage customer data and order history.</p>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex bg-white/[0.01]">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#C0001A] text-white"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/[0.02] text-neutral-400 font-bebas tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-center">Orders</th>
              <th className="px-6 py-4 text-right">Total Spent (฿)</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockCustomers.map((cus) => (
              <tr key={cus.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{cus.name}</div>
                      <div className="text-xs text-neutral-500">{cus.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-white">{cus.orders}</td>
                <td className="px-6 py-4 text-right font-medium text-[#F4C430]">{cus.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  {cus.status === 'VIP' ? (
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md text-xs border border-purple-500/20 flex items-center gap-1 justify-center w-fit mx-auto">
                      <Shield className="w-3 h-3" /> VIP
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-white/5 text-neutral-300 rounded-md text-xs border border-white/10">
                      {cus.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-neutral-400"><MoreVertical className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
