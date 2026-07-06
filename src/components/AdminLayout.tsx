'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, Settings, 
  Menu, X, Bell, Search, BarChart3, Tag, DollarSign,
  Truck, Star, MessageSquare, Shield
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Orders', icon: ShoppingBag, href: '/dashboard/orders' },
  { name: 'Products', icon: Package, href: '/dashboard/products' },
  { name: 'Categories', icon: Tag, href: '/dashboard/categories' },
  { name: 'Customers', icon: Users, href: '/dashboard/customers' },
  { name: 'Inventory', icon: BarChart3, href: '/dashboard/inventory' },
  { name: 'Marketing', icon: Star, href: '/dashboard/marketing' },
  { name: 'Coupons', icon: DollarSign, href: '/dashboard/coupons' },
  { name: 'Reviews', icon: MessageSquare, href: '/dashboard/reviews' },
  { name: 'Sessions', icon: Shield, href: '/dashboard/sessions' },
  { name: 'Payments', icon: DollarSign, href: '/dashboard/payments' },
  { name: 'Shipping', icon: Truck, href: '/dashboard/shipping' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#04060c] text-white flex overflow-hidden">
      
      {/* SIDEBAR */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ type: "spring" as const, stiffness: 200, damping: 25 }}
        className="h-screen bg-[#0a0f1c] border-r border-white/5 flex flex-col relative z-20 flex-shrink-0"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          <AnimatePresence mode="popLayout">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="font-bangers text-3xl tracking-widest text-[#F4C430]"
              >
                HAKI<span className="text-white">DROP</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <div 
                  className={`flex items-center px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#C0001A]/20 to-transparent text-white border border-[#C0001A]/30 shadow-[0_0_15px_rgba(192,0,26,0.15)]' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#C0001A]" 
                    />
                  )}
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#C0001A]' : 'group-hover:text-[#F4C430] transition-colors'}`} />
                  
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10, display: 'none' }}
                        animate={{ opacity: 1, x: 0, display: 'block' }}
                        exit={{ opacity: 0, x: -10, display: 'none' }}
                        className="ml-4 font-sans text-sm font-medium whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <div 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, display: 'none' }}
                  animate={{ opacity: 1, display: 'block' }}
                  exit={{ opacity: 0, display: 'none' }}
                  className="ml-4 font-sans text-sm font-medium whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP NAVIGATION */}
        <header className="h-20 bg-[#0a0f1c]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10 flex-shrink-0 relative">
          
          <div className="flex items-center w-96 relative">
            <Search className="w-4 h-4 absolute left-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search orders, products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#F4C430] transition-colors font-sans text-white placeholder-neutral-500"
            />
            <AnimatePresence>
              {isSearchFocused && searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-14 left-0 w-full bg-[#0a0f1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="text-xs font-bebas tracking-widest text-neutral-500">PRODUCTS</p>
                    <div className="mt-2 flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center"><Package className="w-4 h-4 text-neutral-400" /></div>
                      <div>
                        <p className="text-sm text-white font-medium">Joyboy Hoodie</p>
                        <p className="text-xs text-neutral-500">In Stock: 45</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bebas tracking-widest text-neutral-500">ORDERS</p>
                    <div className="mt-2 flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-neutral-400" /></div>
                      <div>
                        <p className="text-sm text-white font-medium">Order #109283</p>
                        <p className="text-xs text-neutral-500">Processing</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#C0001A] rounded-full animate-pulse" />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-12 right-0 w-80 bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                      <h3 className="font-bangers tracking-widest text-white text-lg">NOTIFICATIONS</h3>
                      <span className="text-xs font-sans text-[#F4C430] cursor-pointer">Mark all read</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg shrink-0"><ShoppingBag className="w-4 h-4 text-blue-400" /></div>
                          <div>
                            <p className="text-sm text-white font-medium">New Order #109284</p>
                            <p className="text-xs text-neutral-400 mt-1">Monkey D. Luffy placed an order for ฿45,000</p>
                            <p className="text-xs text-neutral-500 mt-2">2 mins ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#F4C430]/10 rounded-lg shrink-0"><Package className="w-4 h-4 text-[#F4C430]" /></div>
                          <div>
                            <p className="text-sm text-white font-medium">Low Stock Alert</p>
                            <p className="text-xs text-neutral-400 mt-1">Joyboy Hoodie (Size M) is running low.</p>
                            <p className="text-xs text-neutral-500 mt-2">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-px bg-white/10" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4C430] to-[#C0001A] p-[2px]">
                <div className="w-full h-full bg-[#0a0f1c] rounded-full flex items-center justify-center">
                  <span className="font-bangers tracking-widest text-[#F4C430]">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
              <div className="hidden md:block text-sm font-sans">
                <p className="text-white font-medium">{user?.name || 'Admin'}</p>
                <p className="text-neutral-500 text-xs">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#C0001A]/5 to-transparent pointer-events-none" />
          <div className="p-8 max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}
