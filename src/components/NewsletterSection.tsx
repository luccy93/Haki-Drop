'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Skull } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock API call
      setTimeout(() => {
        setIsSubscribed(true);
      }, 800);
    }
  };

  return (
    <section className="relative py-32 bg-[#020104] overflow-hidden flex items-center justify-center px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#b3001a]/10 via-transparent to-transparent opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* The Bounty Board (Parchment/Wood Theme) */}
        <div className="relative bg-[#0a0505] border-[4px] border-[#3a1c1c] rounded-lg p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Distressed texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none" />
          
          <div className="flex flex-col items-center text-center relative z-10">
            <Skull className="w-12 h-12 text-[#F4C430] mb-4 drop-shadow-[0_0_10px_rgba(244,196,48,0.5)]" />
            
            <h2 className="font-cormorant font-black italic text-4xl md:text-5xl text-[#F4C430] tracking-widest uppercase mb-2">
              Marine Headquarters Notice
            </h2>
            <h3 className="font-bangers text-6xl md:text-8xl text-white tracking-widest drop-shadow-[4px_4px_0_#b3001a] mb-6">
              WANTED: NEW RECRUITS
            </h3>
            
            <p className="font-sans text-neutral-400 max-w-2xl text-lg mb-10 leading-relaxed">
              The Grand Fleet is expanding. Enter your details below to pledge your loyalty. Recruits will receive exclusive drops, early access to limited commerce pieces, and a starting bounty.
            </p>

            <div className="w-full max-w-md h-[160px]">
              <AnimatePresence mode="wait">
                {!isSubscribed ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 w-full"
                  >
                    <div className="relative">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER YOUR DEN DEN MUSHI (EMAIL)" 
                        required
                        className="w-full bg-black/50 border-2 border-[#3a1c1c] focus:border-[#F4C430] text-white font-bebas text-xl tracking-widest px-6 py-4 rounded-none outline-none transition-colors placeholder:text-neutral-600"
                      />
                      <Crosshair className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3a1c1c]" />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-[#b3001a] hover:bg-[#F4C430] text-white hover:text-black font-bangers text-3xl tracking-widest py-3 transition-colors duration-300 shadow-[0_0_20px_rgba(179,0,26,0.4)] hover:shadow-[0_0_30px_rgba(244,196,48,0.6)]"
                    >
                      JOIN THE FLEET
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full bg-[#110a0a] border border-[#F4C430]/30 rounded-lg p-6"
                  >
                    <span className="font-bebas text-2xl text-emerald-400 tracking-widest mb-2">PLEDGE ACCEPTED</span>
                    <span className="font-sans text-neutral-400 text-sm uppercase tracking-widest mb-2">Your Starting Bounty</span>
                    <span className="font-bangers text-5xl text-[#F4C430] drop-shadow-[2px_2px_0_#b3001a]">฿ 30,000,000</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
