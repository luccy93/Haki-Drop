'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, User, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">PLATFORM SETTINGS</h1>
        <p className="text-neutral-400 text-sm">Configure global store preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-1 flex flex-col gap-2">
          <button className="flex items-center gap-3 p-3 bg-white/10 text-white rounded-lg border border-white/10 text-sm font-medium">
            <Settings className="w-4 h-4" /> General
          </button>
          <button className="flex items-center gap-3 p-3 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="flex items-center gap-3 p-3 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <User className="w-4 h-4" /> Team Members
          </button>
          <button className="flex items-center gap-3 p-3 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="flex items-center gap-3 p-3 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Database className="w-4 h-4" /> Backups
          </button>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
          <h2 className="font-bebas text-2xl tracking-widest text-white mb-6">GENERAL STORE DETAILS</h2>
          
          <form className="flex flex-col gap-6 max-w-xl">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-400">Store Name</label>
              <input type="text" defaultValue="Haki Drop" className="bg-[#0a0f1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C0001A]" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-400">Support Email</label>
              <input type="email" defaultValue="support@hakidrop.com" className="bg-[#0a0f1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C0001A]" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-400">Timezone</label>
              <select className="bg-[#0a0f1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C0001A]">
                <option>(GMT+07:00) Bangkok</option>
                <option>(GMT+00:00) London</option>
                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button type="button" className="px-6 py-3 bg-[#C0001A] text-white font-bebas tracking-widest rounded-lg hover:bg-[#ff1a38] transition-colors">
                SAVE CHANGES
              </button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
