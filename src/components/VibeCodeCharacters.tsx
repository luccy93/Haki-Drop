'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VibeCodeCharacters() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  
  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const characters = [
    {
      id: "zoro",
      faction: "Straw Hat Pirates",
      role: "Combatant // Swordsman",
      style: "Three-Sword Style",
      title: "ZORO // King of Hell",
      desc: "Three-Sword Style Ougi... Overdrawn spiritual green mist aura blades.",
      color: "emerald",
      bgClass: "from-transparent to-emerald-950/40 border-emerald-500/20",
      textColor: "text-emerald-400"
    },
    {
      id: "sanji",
      faction: "Straw Hat Pirates",
      role: "Cook // Martial Artist",
      style: "Black Leg Style",
      title: "SANJI // Ifrit Jambe",
      desc: "High-velocity white hot plasma kicks generating internal physical overdrive.",
      color: "orange",
      bgClass: "from-transparent to-orange-950/40 border-orange-500/20",
      textColor: "text-orange-400"
    },
    {
      id: "teach",
      faction: "Blackbeard Pirates",
      role: "Admiral // Emperor",
      style: "Devil Fruit Awakening",
      title: "MARSHALL D. TEACH",
      desc: "Infinite localized dark gravitational voids swallowing physical matter configurations.",
      color: "purple",
      bgClass: "from-transparent to-purple-950/40 border-purple-500/20",
      textColor: "text-purple-400"
    }
  ];

  return (
    <section className="relative z-10 py-24 bg-[#020104] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 uppercase">
            Character Horizons
          </h2>
          <p className="text-neutral-400 font-mono text-sm uppercase tracking-widest">
            The New Emperors and their Wings.
          </p>
          <Link
            href="/about"
            className="mt-4 inline-block font-bangers text-base tracking-widest uppercase px-6 py-2.5 bg-transparent border-2 border-white/20 text-white/60 hover:bg-white hover:text-black rounded transition-all"
          >
            Learn More
          </Link>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {characters.map((char, index) => {
            const leftPos = index === 0 ? '0' : index === 1 ? '-100%' : '-200%';
            
            return (
              <motion.div key={char.id} variants={staggerItem} className="flex flex-col gap-4">
                {/* Lore Data Block */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4 font-mono text-xs flex flex-col justify-between shadow-lg h-24">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold tracking-widest uppercase ${char.textColor}`}>
                      {char.faction}
                    </span>
                    <span className="text-neutral-500">{char.style}</span>
                  </div>
                  <div className="text-neutral-300 tracking-wider">
                    {char.role}
                  </div>
                </div>

                {/* Poster Display */}
                <div className={`relative group flex flex-col justify-end min-h-[400px] md:min-h-[500px] rounded-xl overflow-hidden border ${char.bgClass}`}>
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src="/images/triptych.jpg" 
                      alt={char.title} 
                      className="absolute w-[300%] h-full max-w-none object-cover top-0 group-hover:scale-105 transition-transform duration-700" 
                      style={{ left: leftPos }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  
                  <div className="relative z-10 p-6">
                    <h3 className="text-2xl font-black uppercase text-white mt-1 tracking-tight">{char.title}</h3>
                    <p className="text-xs text-neutral-400 mt-2 font-medium">{char.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
