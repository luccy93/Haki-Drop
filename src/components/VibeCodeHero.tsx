'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function VibeCodeHero() {
  const { scrollY } = useScroll();
  
  // Title parallax: moves down slightly
  const yText1 = useTransform(scrollY, [0, 800], [0, 150]);
  
  // SUN GOD NIKA title: moves up much faster
  const yTitle = useTransform(scrollY, [0, 1000], [0, -250]);
  const opacityTitle = useTransform(scrollY, [0, 600], [1, 0]);
  
  // The Quote: moves up slower, coming in behind the title
  const yQuote = useTransform(scrollY, [0, 1000], [50, -100]);
  const opacityQuote = useTransform(scrollY, [0, 400, 800], [0, 1, 0.5]);

  return (
    <section className="relative z-10 min-h-[120vh] flex flex-col items-center justify-start px-4 bg-black/40 overflow-hidden pt-32">
      {/* Gear 5 Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/luffy-gear5.jpg" alt="Gear 5" className="w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none" />
      </div>
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative w-full max-w-5xl z-20 flex flex-col items-center">
        {/* Act I Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y: yText1 }}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-purple-400 mb-8 uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Act I // East Blue Foundation
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-lg mb-6 uppercase">
            GROUNDED <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-700">WILL</span>
          </h1>
          <blockquote className="text-xl md:text-3xl font-medium italic text-neutral-300 max-w-2xl mx-auto mb-8 border-l-4 border-purple-500 pl-6 text-left">
            "If you don't take risks, you can't create a future!"
          </blockquote>
          <Link
            href="/collections"
            className="inline-block font-bangers text-lg tracking-widest uppercase px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
          >
            Explore Collection
          </Link>
        </motion.div>

        {/* Sequential Parallax Lore Text */}
        <div className="w-full text-center relative z-30 min-h-[500px]">
          {/* Title moves up fast and fades out */}
          <motion.div 
            style={{ y: yTitle, opacity: opacityTitle }}
            className="absolute inset-x-0 top-0"
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-600 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              PIRATE KING
            </h2>
          </motion.div>
          
          {/* Quote comes up slower and fades in as title leaves */}
          <motion.div 
            style={{ y: yQuote, opacity: opacityQuote }}
            className="absolute inset-x-0 top-32 space-y-6 text-lg md:text-2xl font-bold tracking-tight text-neutral-300"
          >
            <p className="text-red-500 font-mono text-sm md:text-base uppercase tracking-[0.2em] drop-shadow-md">
              Kaido: "White hair... White clothes... Who are you?!"
            </p>
            <p className="text-white uppercase text-2xl md:text-4xl font-black tracking-wide leading-tight drop-shadow-lg">
              "I am Monkey D. Luffy!<br />
              <span className="text-purple-400">The man who will surpass you... and become the Pirate King!</span>"
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
