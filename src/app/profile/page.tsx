'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, MapPin, Package, Shield, ExternalLink, 
  Calendar, CreditCard, Bell, ChevronLeft, Save, Plus, Edit2, Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

type Tab = 'DASHBOARD' | 'PERSONAL_INFO' | 'PAYMENT_METHODS' | 'NOTIFICATIONS';

export default function ProfilePage() {
  const { user, logout, setAuth } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');

  // Form states
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+1 (555) 123-4567',
  });
  
  const [notifs, setNotifs] = useState({
    email: true,
    sms: false,
    promotions: true,
    orderUpdates: true,
  });

  useEffect(() => {
    const restoreSession = async () => {
      if (!user) {
        try {
          const { data } = await api.post('/auth/refresh');
          if (data.user && data.accessToken) {
            setAuth(data.user, data.accessToken);
            setMounted(true);
            setFormData(prev => ({ ...prev, name: data.user.name, email: data.user.email }));
          } else {
            throw new Error('No user data');
          }
        } catch (error) {
          await api.post('/auth/logout').catch(() => {});
          logout();
          router.push('/login');
        }
      } else {
        setMounted(true);
        setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
      }
    };

    restoreSession();
  }, [user, router, setAuth, logout]);

  useEffect(() => {
    if (user) {
      api.get('/auth/sessions').then(res => setSessions(res.data.sessions || [])).catch(console.error);
      api.get('/api/orders').then(res => {
        const allOrders: any[] = res.data || [];
        const myOrders = allOrders.filter((o: any) => {
          if (user?.id && o.userId === user.id) return true;
          if (user?.email && (o.user?.email === user.email || o.customer === user.email)) return true;
          return false;
        });
        setRecentOrders(myOrders.slice(0, 3));
      }).catch(console.error);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    logout();
    router.push('/login');
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Mock API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success toast here in real app
    }, 1000);
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-[#04060c] flex items-center justify-center">
        <div className="text-[#F4C430] font-bebas text-2xl tracking-widest animate-pulse">LOADING PROFILE...</div>
      </div>
    );
  }

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-8"
    >
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bangers text-3xl tracking-widest text-white flex items-center gap-3">
            <Package className="w-7 h-7 text-[#F4C430]" />
            RECENT VOYAGES
          </h2>
          <Link href="/profile/orders" className="text-sm font-sans text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
            View All <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
              <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="font-sans text-neutral-400">You haven't embarked on any voyages yet.</p>
              <Link href="/collections" className="mt-4 inline-block font-bebas tracking-widest text-[#F4C430] hover:text-white transition-colors">
                BROWSE DROPS
              </Link>
            </div>
          ) : (
            recentOrders.map((order: any) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-sans font-medium text-white text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="font-sans text-neutral-500 text-xs mt-1">{new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans font-bold text-[#F4C430]">₹{(order.totalAmount ?? order.amount ?? 0).toFixed(2)}</p>
                  <p className="font-sans text-xs text-neutral-500">{order.status}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bangers text-3xl tracking-widest text-white flex items-center gap-3">
            <MapPin className="w-7 h-7 text-[#F4C430]" />
            SAFE HAVENS
          </h2>
          <button className="text-sm font-sans text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
            Manage <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bebas tracking-widest text-[#F4C430]">PRIMARY</span>
              </div>
              <p className="font-sans text-neutral-300 text-sm leading-relaxed">
                123 Grand Line St.<br/>
                Water 7, WG 10293<br/>
                New World
              </p>
            </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPersonalInfo = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md"
    >
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setActiveTab('DASHBOARD')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="font-bangers text-4xl tracking-widest text-white">PERSONAL INFORMATION</h2>
      </div>

      <form onSubmit={handleSaveInfo} className="flex flex-col gap-6 max-w-xl">
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm text-neutral-400">Full Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F4C430] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm text-neutral-400">Email Address (Read Only)</label>
          <input 
            type="email" 
            value={formData.email}
            readOnly
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-neutral-500 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm text-neutral-400">Phone Number</label>
          <input 
            type="tel" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F4C430] transition-colors"
          />
        </div>
        
        <button 
          type="submit"
          disabled={isSaving}
          className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-[#C0001A] text-white font-bebas tracking-widest text-xl rounded-xl hover:bg-[#ff1a38] transition-colors shadow-[0_0_15px_rgba(192,0,26,0.3)] disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Save className="w-5 h-5" /> SAVE CHANGES</>
          )}
        </button>
      </form>
    </motion.div>
  );

  const renderPaymentMethods = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('DASHBOARD')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="font-bangers text-4xl tracking-widest text-white">PAYMENT METHODS</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-sans text-sm font-medium border border-white/10">
          <Plus className="w-4 h-4" /> ADD CARD
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mock Card */}
        <div className="p-6 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.01] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4C430]/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-white" />
              <span className="font-bebas tracking-widest text-xl text-white">VISA</span>
            </div>
            <span className="px-2.5 py-1 bg-[#F4C430]/20 text-[#F4C430] text-xs font-bold rounded-md">DEFAULT</span>
          </div>

          <div className="relative z-10">
            <p className="font-mono text-xl text-white tracking-widest mb-2">**** **** **** 4242</p>
            <div className="flex justify-between items-center text-sm font-sans text-neutral-400">
              <span>Exp: 12/28</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white/10 rounded-md hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button className="p-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md"
    >
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setActiveTab('DASHBOARD')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="font-bangers text-4xl tracking-widest text-white flex items-center gap-3">
          <Bell className="w-7 h-7 text-[#F4C430]" /> NOTIFICATIONS
        </h2>
      </div>

      <div className="max-w-xl flex flex-col gap-6">
        <div className="flex items-center justify-between p-4 bg-[#0a0f1c] border border-white/10 rounded-xl">
          <div>
            <p className="text-white font-medium">Order Updates</p>
            <p className="text-neutral-500 text-sm mt-1">Get notified when your order ships and delivers.</p>
          </div>
          <button 
            onClick={() => setNotifs({...notifs, orderUpdates: !notifs.orderUpdates})}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifs.orderUpdates ? 'bg-[#F4C430]' : 'bg-white/10'}`}
          >
            <motion.div 
              layout
              className={`w-4 h-4 rounded-full bg-white absolute top-1 ${notifs.orderUpdates ? 'right-1' : 'left-1'}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#0a0f1c] border border-white/10 rounded-xl">
          <div>
            <p className="text-white font-medium">Promotions & Drops</p>
            <p className="text-neutral-500 text-sm mt-1">Be the first to know about new collections.</p>
          </div>
          <button 
            onClick={() => setNotifs({...notifs, promotions: !notifs.promotions})}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifs.promotions ? 'bg-[#F4C430]' : 'bg-white/10'}`}
          >
            <motion.div 
              layout
              className={`w-4 h-4 rounded-full bg-white absolute top-1 ${notifs.promotions ? 'right-1' : 'left-1'}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#0a0f1c] border border-white/10 rounded-xl">
          <div>
            <p className="text-white font-medium">Email Notifications</p>
            <p className="text-neutral-500 text-sm mt-1">Receive updates directly to your inbox.</p>
          </div>
          <button 
            onClick={() => setNotifs({...notifs, email: !notifs.email})}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifs.email ? 'bg-[#F4C430]' : 'bg-white/10'}`}
          >
            <motion.div 
              layout
              className={`w-4 h-4 rounded-full bg-white absolute top-1 ${notifs.email ? 'right-1' : 'left-1'}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#0a0f1c] border border-white/10 rounded-xl">
          <div>
            <p className="text-white font-medium">SMS Notifications</p>
            <p className="text-neutral-500 text-sm mt-1">Get critical updates via text message.</p>
          </div>
          <button 
            onClick={() => setNotifs({...notifs, sms: !notifs.sms})}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifs.sms ? 'bg-[#F4C430]' : 'bg-white/10'}`}
          >
            <motion.div 
              layout
              className={`w-4 h-4 rounded-full bg-white absolute top-1 ${notifs.sms ? 'right-1' : 'left-1'}`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-[#04060c] pt-28 pb-12 px-6 flex flex-col text-white overflow-hidden">
      {/* Background Aura */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#C0001A]/10 via-transparent to-[#F4C430]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F4C430] to-[#C0001A] p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a0f1c] flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-[#F4C430]" />
                )}
              </div>
            </div>
            <div>
              <h1 className="font-bangers text-4xl md:text-5xl tracking-wide text-white drop-shadow-[2px_2px_0_rgba(192,0,26,0.5)]">
                {user.name.toUpperCase()}
              </h1>
              <p className="font-sans text-neutral-400 mt-1">{user.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full mt-3 border border-white/10">
                <Shield className="w-3.5 h-3.5 text-[#F4C430]" />
                <span className="font-bebas text-sm tracking-wider text-white">
                  {user.role} CLEARANCE
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-[#C0001A] text-white font-bebas tracking-widest rounded-lg hover:bg-[#ff1a38] transition-colors shadow-[0_0_15px_rgba(192,0,26,0.3)]"
          >
            <LogOut className="w-5 h-5" />
            SIGN OUT
          </motion.button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 relative">
            <AnimatePresence mode="wait">
              {activeTab === 'DASHBOARD' && <motion.div key="dashboard">{renderDashboard()}</motion.div>}
              {activeTab === 'PERSONAL_INFO' && <motion.div key="personal">{renderPersonalInfo()}</motion.div>}
              {activeTab === 'PAYMENT_METHODS' && <motion.div key="payment">{renderPaymentMethods()}</motion.div>}
              {activeTab === 'NOTIFICATIONS' && <motion.div key="notifs">{renderNotifications()}</motion.div>}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-8">
            
            {/* Account Settings */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
              <h2 className="font-bangers text-3xl tracking-widest text-white mb-6">SETTINGS</h2>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setActiveTab('PERSONAL_INFO')}
                  className={`text-left font-sans transition-colors p-3 rounded-lg flex items-center justify-between group ${activeTab === 'PERSONAL_INFO' ? 'bg-[#F4C430]/10 text-[#F4C430]' : 'text-neutral-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="flex items-center gap-3"><User className="w-4 h-4" /> Personal Information</span>
                </button>
                <button 
                  onClick={() => setActiveTab('PAYMENT_METHODS')}
                  className={`text-left font-sans transition-colors p-3 rounded-lg flex items-center justify-between group ${activeTab === 'PAYMENT_METHODS' ? 'bg-[#F4C430]/10 text-[#F4C430]' : 'text-neutral-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> Payment Methods</span>
                </button>
                <button 
                  onClick={() => setActiveTab('NOTIFICATIONS')}
                  className={`text-left font-sans transition-colors p-3 rounded-lg flex items-center justify-between group ${activeTab === 'NOTIFICATIONS' ? 'bg-[#F4C430]/10 text-[#F4C430]' : 'text-neutral-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Notification Preferences</span>
                </button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
              <h2 className="font-bangers text-3xl tracking-widest text-white mb-6">ACTIVE SESSIONS</h2>
              <div className="flex flex-col gap-4">
                {sessions.length === 0 && <p className="text-sm text-neutral-500">Loading sessions...</p>}
                {sessions.slice(0, 3).map((session, i) => (
                  <div key={session.id || i} className="flex gap-4 items-start pb-4 border-b border-white/10 last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                      <Shield className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-sans font-medium text-white text-sm">{session.browser || 'Unknown Browser'}</p>
                      <p className="font-sans text-neutral-500 text-xs mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.loginTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
