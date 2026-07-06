'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { 
  Search, Download, Plus, Filter, MoreVertical, 
  ChevronLeft, ChevronRight, PackageOpen, Edit, Trash2
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import AddProductModal from '@/components/AddProductModal';

export default function ProductsPage() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const itemsPerPage = 8;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin_products_full'],
    queryFn: async () => {
      const { data } = await api.get('/api/products');
      return data;
    },
    enabled: !!user,
  });

  // Client-side filtering
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || product.collection === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="font-sans relative">
      <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">PRODUCT CATALOG</h1>
          <p className="text-neutral-400 text-sm">Manage your inventory, prices, and product collections.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => setIsAddProductOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#C0001A] to-[#800011] hover:from-[#a00016] hover:to-[#60000d] text-white rounded-lg transition-all shadow-[0_0_15px_rgba(192,0,26,0.3)] flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4 bg-white/[0.01]">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#C0001A] transition-colors text-white placeholder-neutral-500"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-neutral-500" />
            <select 
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#0a0f1c] border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-[#C0001A]"
            >
              <option value="ALL">All Categories</option>
              <option value="TEES">Tees</option>
              <option value="HOODIES">Hoodies</option>
              <option value="JACKETS">Jackets</option>
              <option value="STICKERS">Stickers</option>
              <option value="CARDS">Cards</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#C0001A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/[0.02] text-neutral-400 font-bebas tracking-wider text-base border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded bg-white/5 border-white/10 accent-[#C0001A]" /></th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <PackageOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
                      <p className="text-neutral-500">No products found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4"><input type="checkbox" className="rounded bg-white/5 border-white/10 accent-[#C0001A]" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden border border-white/10 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium text-white max-w-[200px] truncate">{product.name}</div>
                            <div className="text-xs text-neutral-500 mt-0.5">{product.id.slice(0, 8).toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-neutral-300 border border-white/10 uppercase">
                          {product.collection}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-300 font-medium">942</span> {/* Hardcoded mock stock for now */}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-white">
                        {product.price}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
            <span className="text-sm text-neutral-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-neutral-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  // Only show a few pages around the current page to prevent massive pagination rows
                  if (totalPages > 5 && i !== 0 && i !== totalPages - 1 && Math.abs(currentPage - 1 - i) > 1) {
                    if (i === 1 || i === totalPages - 2) return <span key={i} className="px-2 text-neutral-500">...</span>;
                    return null;
                  }
                  
                  return (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-[#C0001A] text-white shadow-[0_0_10px_rgba(192,0,26,0.4)]' 
                          : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-neutral-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
