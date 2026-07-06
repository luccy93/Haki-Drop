'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Monitor, LogOut, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface Session {
  id: string;
  device: string | null;
  browser: string | null;
  ip: string | null;
  loginTime: string;
  lastSeen: string;
  isCurrent?: boolean;
}

export default function SessionsDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoking, setIsRevoking] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/auth/sessions');
        const { sessions: sessionList, currentSessionId } = res.data;
        setSessions((sessionList || []).map((s: any) => ({
          ...s,
          isCurrent: s.id === currentSessionId,
        })));
      } catch (err) {
        setMsg({ type: 'error', text: 'Failed to load sessions' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleLogoutAll = async () => {
    setIsRevoking(true);
    setMsg({ type: '', text: '' });
    try {
      await api.post('/auth/logout-all');
      setMsg({ type: 'success', text: 'Logged out of all other devices successfully.' });
      
      // Update local sessions list to only show current one (which should be revoked soon as well, or you might want to log out current device too)
      logout();
      router.push('/login');
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to revoke sessions.' });
      setIsRevoking(false);
    }
  };

  const parseDevice = (userAgent: string | null) => {
    if (!userAgent) return { type: 'monitor', label: 'Unknown Device' };
    if (userAgent.toLowerCase().includes('mobile')) return { type: 'smartphone', label: 'Mobile Device' };
    if (userAgent.toLowerCase().includes('tablet')) return { type: 'smartphone', label: 'Tablet Device' };
    return { type: 'monitor', label: 'Desktop Device' };
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[#04060c] text-white rounded-2xl border border-white/10 m-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4C430]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#04060c] text-white rounded-2xl border border-white/10 m-4 min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-bangers text-4xl tracking-widest text-[#F4C430] drop-shadow-[1px_1px_0_#b3001a] flex items-center gap-3">
            <Shield className="w-8 h-8" /> SECURITY & SESSIONS
          </h1>
          <p className="font-sans text-sm text-white/50 mt-1">Manage your active login sessions across devices.</p>
        </div>
        
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogoutAll}
          disabled={isRevoking || sessions.length <= 1}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <LogOut className="w-5 h-5" /> 
          {isRevoking ? 'REVOKING...' : 'LOGOUT ALL DEVICES'}
        </motion.button>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${msg.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-green-500/10 border border-green-500/20 text-green-500'}`}>
          {msg.type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session, i) => {
          const device = parseDevice(session.device);
          const isCurrent = session.isCurrent || i === 0;
          
          return (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${isCurrent ? 'border-[#F4C430]/50 bg-[#F4C430]/5' : 'border-white/10 bg-white/5'} flex flex-col relative overflow-hidden`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-[#F4C430] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl font-sans uppercase tracking-widest">
                  Current Session
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${isCurrent ? 'bg-[#F4C430]/20 text-[#F4C430]' : 'bg-white/10 text-white/70'}`}>
                  {device.type === 'monitor' ? <Monitor className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{device.label}</h3>
                  <p className="text-sm text-white/50">{session.browser || 'Unknown Browser'}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">IP Address:</span>
                  <span className="text-white/80">{session.ip || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Login Time:</span>
                  <span className="text-white/80">{new Date(session.loginTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Last Active:</span>
                  <span className="text-white/80">{session.lastSeen ? new Date(session.lastSeen).toLocaleString() : 'Now'}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
