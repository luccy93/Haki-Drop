'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/orders')
        .then(res => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const myOrders = orders.filter((o: any) => {
    if (!user?.email && !user?.id) return false;
    if (user?.id && o.userId === user.id) return true;
    if (user?.email && (o.user?.email === user.email || o.customer === user.email)) return true;
    return false;
  });

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">Please log in to view your orders.</div>;
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">Loading orders...</div>;
  }

  const canCancel = (status: string) => ['Pending', 'Confirmed', 'PROCESSING', 'COD - Pending Payment'].includes(status);

  const handleCancel = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      await api.patch(`/api/orders/${orderId}`, { action: 'cancel' });
      setOrders((prev: any[]) => prev.map((o: any) => o.id === orderId ? { ...o, status: 'Cancelled', cancelledAt: new Date().toISOString() } : o));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'PROCESSING': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'SHIPPED':
      case 'Shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'DELIVERED':
      case 'Delivered':
      case 'Confirmed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const itemName = (item: any) => item.product?.name || item.title || item.name || 'Product';
  const itemImage = (item: any) => item.product?.images?.[0] || item.image || '/images/cinematic-bg.png';
  const itemSubtotal = (item: any) => item.subtotal ?? ((item.price || 0) * (item.quantity || 1));

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bangers tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-500 mb-8">
        RECENT VOYAGES
      </h1>
      
      {myOrders.length === 0 ? (
        <div className="text-gray-400">You haven't placed any orders yet.</div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111] border border-white/10 rounded-xl p-6"
            >
              <div className="flex flex-wrap justify-between items-start mb-6 gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Order #{order.id.slice(-8).toUpperCase()}</div>
                  <div className="text-sm">{format(new Date(order.createdAt || order.date), 'MMM dd, yyyy')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    {getStatusIcon(order.status || order.orderStatus)}
                    <span className="text-sm font-bold tracking-wider">{order.status || order.orderStatus}</span>
                  </div>
                  {canCancel(order.status) && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                      className="p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      title="Cancel Order"
                    >
                      <XCircle className={`w-5 h-5 ${cancellingId === order.id ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
                    ₹{(order.totalAmount ?? order.total ?? 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{order.paymentMethod || order.paymentStatus}</div>
                </div>
              </div>

              <div className="space-y-4">
                {(order.items || []).map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                      <img src={itemImage(item)} alt={itemName(item)} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="font-bold">{itemName(item)}</div>
                      <div className="text-sm text-gray-400">Qty: {item.quantity}</div>
                    </div>
                    <div className="flex flex-col justify-center font-bold">
                      ₹{itemSubtotal(item).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
