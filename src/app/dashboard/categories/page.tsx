'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, FolderTree } from 'lucide-react';

const mockCategories = [
  { id: 1, name: 'Tees', slug: 'tees', items: 45, status: 'Active' },
  { id: 2, name: 'Hoodies', slug: 'hoodies', items: 23, status: 'Active' },
  { id: 3, name: 'Jackets', slug: 'jackets', items: 12, status: 'Active' },
  { id: 4, name: 'Stickers', slug: 'stickers', items: 156, status: 'Active' },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">CATEGORIES</h1>
          <p className="text-neutral-400 text-sm">Manage product collections and taxonomy.</p>
        </div>
        <button className="px-4 py-2 bg-[#C0001A] text-white rounded-lg hover:bg-[#ff1a38] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
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
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#C0001A] text-white"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/[0.02] text-neutral-400 font-bebas tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4 text-center">Products</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                  <FolderTree className="w-4 h-4 text-[#F4C430]" /> {cat.name}
                </td>
                <td className="px-6 py-4 text-neutral-400">/{cat.slug}</td>
                <td className="px-6 py-4 text-center text-white">{cat.items}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-xs border border-green-500/20">{cat.status}</span>
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
