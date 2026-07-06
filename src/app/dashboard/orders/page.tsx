'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { 
  Search, Download, Filter, MoreVertical, 
  ChevronLeft, ChevronRight, Package 
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin_orders_full'],
    queryFn: async () => {
      const { data } = await api.get('/api/orders');
      return data;
    },
    enabled: !!user,
  });

  // Client-side filtering
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name || order.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.email || order.customer || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    if (filteredOrders.length === 0) return;
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Status', 'Total', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map((o: any) => 
        `"${o.id}","${o.user?.name || o.customer || 'Guest'}","${o.user?.email || o.customer || 'N/A'}","${o.status}","${o.totalAmount || o.amount || '0'}","${new Date(o.createdAt || o.date).toISOString()}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Processing': return 'bg-[#F4C430]/10 text-[#F4C430] border-[#F4C430]/20';
      case 'Pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/5 text-white border-white/10';
    }
  };

  return (
    <div className="font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">ORDERS MANAGEMENT</h1>
          <p className="text-neutral-400 text-sm">View, track, and manage customer orders across the platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
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
              placeholder="Search by ID, Name, or Email..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#F4C430] transition-colors text-white placeholder-neutral-500"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-neutral-500" />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#0a0f1c] border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-[#F4C430]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#F4C430] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/[0.02] text-neutral-400 font-bebas tracking-wider text-base border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded bg-white/5 border-white/10 accent-[#F4C430]" /></th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                      <p className="text-neutral-500">No orders found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4"><input type="checkbox" className="rounded bg-white/5 border-white/10 accent-[#F4C430]" /></td>
                      <td className="px-6 py-4 font-mono text-neutral-300">
                        <span className="text-[#F4C430] mr-1">#</span>{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{order.user?.name || order.customer || 'Guest'}</div>
                        <div className="text-xs text-neutral-500">{order.user?.email || order.customer || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {new Date(order.createdAt || order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        <div className="text-xs text-neutral-600">{new Date(order.createdAt || order.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-white">
                        ฿{Number(order.totalAmount || parseFloat(String(order.amount || '0').replace(/,/g, '')) || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
            <span className="text-sm text-neutral-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
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
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-[#F4C430] text-[#0a0f1c]' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
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
