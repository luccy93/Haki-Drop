'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { 
  TrendingUp, 
  Package, 
  Users, 
  AlertTriangle,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Mock chart data (since the backend doesn't have a history endpoint yet)
const chartData = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 5000, orders: 35 },
  { name: 'Thu', revenue: 2780, orders: 15 },
  { name: 'Fri', revenue: 6890, orders: 48 },
  { name: 'Sat', revenue: 8390, orders: 62 },
  { name: 'Sun', revenue: 7490, orders: 55 },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();

  const { data: analytics } = useQuery({
    queryKey: ['admin_analytics'],
    queryFn: async () => {
      const { data } = await api.get('/api/analytics/dashboard');
      return data.metrics;
    },
    enabled: !!user,
    refetchInterval: 60000,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin_orders_recent'],
    queryFn: async () => {
      const { data } = await api.get('/api/orders');
      return data.slice(0, 5); // Just grab first 5 for the quick view
    },
    enabled: !!user,
  });

  // Dynamic Metrics mapped from API response
  const dynamicMetrics = [
    { title: 'Total Revenue', value: `฿ ${analytics?.totalRevenue?.toLocaleString() || '0'}`, change: '+12.5%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { title: 'Pending Orders', value: analytics?.pendingOrders || '0', change: '+5', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Total Customers', value: analytics?.totalCustomers || '0', change: '+18%', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Low Stock Alerts', value: analytics?.lowStockCount || '0', change: '-2', icon: AlertTriangle, color: 'text-[#F4C430]', bg: 'bg-[#F4C430]/10' }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <div className="font-sans">
      
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">OVERVIEW</h1>
        <p className="text-neutral-400 text-sm">Welcome back, Captain. Here's what's happening with your store today.</p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dynamicMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${metric.bg} blur-[50px] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-white/5 ${metric.color} border border-white/5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/5 ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-neutral-400 text-sm font-medium mb-1 relative z-10">{metric.title}</h3>
              <p className="text-3xl font-bangers tracking-widest text-white relative z-10">{metric.value}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* REVENUE CHART */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-bebas text-xl tracking-widest text-white">REVENUE OVERVIEW</h2>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-neutral-300 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="p-6 flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C0001A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C0001A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `฿${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#F4C430' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C0001A" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* QUICK ACTIONS / ALERTS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
        >
          <h2 className="font-bebas text-xl tracking-widest text-white mb-6">ACTION REQUIRED</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#C0001A]/10 border border-[#C0001A]/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#C0001A] shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Low Inventory Warning</p>
                <p className="text-neutral-400 text-xs mt-1">3 products are running out of stock. Restock required.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F4C430]/10 border border-[#F4C430]/20 flex items-start gap-3">
              <Users className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">New Merchant Application</p>
                <p className="text-neutral-400 text-xs mt-1">1 user has requested merchant clearance.</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
              <Package className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Unfulfilled Orders</p>
                <p className="text-neutral-400 text-xs mt-1">12 orders are awaiting shipping labels.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* RECENT ORDERS TABLE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-bebas text-xl tracking-widest text-white">RECENT ORDERS</h2>
          <button className="text-xs font-sans text-neutral-400 hover:text-white flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/[0.02] text-neutral-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-neutral-300">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{order.user?.name || order.customer || 'Guest'}</div>
                      <div className="text-xs text-neutral-500">{order.user?.email || order.customer || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(order.createdAt || order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">
                      ฿{(order.totalAmount || order.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-white/10 rounded text-neutral-400 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
