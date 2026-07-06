"use client";

import HeroCanvas from "./HeroCanvas";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 z-20 bg-gradient-to-r from-transparent via-[#F4C430] to-transparent" />
      
      {/* Interactive Canvas */}
      <HeroCanvas />

      {/* UI Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="font-luckiest text-6xl tracking-wider uppercase text-[#F7D446] text-stroke text-glow-gold">
            One Piece
          </div>
          <div className="font-bebas text-sm tracking-[0.5em] text-white drop-shadow-lg mt-1 pl-2">
            GEAR 5 &middot; AWAKENING
          </div>
        </motion.div>

        {/* Content Container */}
        <div className="flex-1 w-full relative">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-16 left-8 md:left-16 max-w-sm flex flex-col gap-4"
          >
            <div className="font-bebas text-sm tracking-[0.35em] uppercase text-[#F4C430] pl-6 relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1.5px] bg-[#F4C430]" />
              Straw Hat Pirates
            </div>
            <h1 className="font-bangers text-5xl md:text-7xl leading-none text-white text-glow-red uppercase tracking-wide">
              Monkey D.<br />Luffy
            </h1>
            <p className="font-cormorant italic text-lg text-white/80 leading-relaxed">
              The boy who would be King of the Pirates. Rubber fists, an iron will, and a grin that never quits — chasing the world's greatest treasure.
            </p>
            <button className="pointer-events-auto w-fit font-bebas text-lg tracking-[0.2em] uppercase px-8 py-3 bg-transparent text-white border-2 border-[#F4C430] hover:bg-[#F4C430] hover:text-black transition-colors duration-300">
              Set Sail
            </button>
          </motion.div>

          {/* Right Text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute top-1/2 -translate-y-1/2 right-8 md:right-16 max-w-sm text-right flex flex-col gap-4 items-end"
          >
            <div className="font-bebas text-sm tracking-[0.35em] uppercase text-[#ff5a6e] pr-6 relative">
              Joy Boy Awakened
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[1.5px] bg-[#ff5a6e]" />
            </div>
            <h1 className="font-bangers text-5xl md:text-6xl text-white text-glow-purple uppercase">
              Gear<br />Five
            </h1>
            <p className="font-cormorant italic text-lg text-white/80 leading-relaxed text-right">
              The Warrior of Liberation. Laughter becomes power, the world bends to imagination — the truest form of the Nika Devil Fruit.
            </p>
          </motion.div>

        </div>

        {/* Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-bebas tracking-[0.25em] text-sm text-white bg-black/50 px-6 py-2 rounded-full border border-white/10 glass"
        >
          &#9656; MOVE ACROSS TO AWAKEN GEAR 5 &#9666;
        </motion.div>
      </div>
    </section>
  );
}
