"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Bounty", value: "฿ 3,000,000,000", color: "#F4C430" },
  { label: "Crew", value: "Straw Hat Pirates", color: "#C0001A" },
  { label: "Devil Fruit", value: "Hito Hito no Mi, Model: Nika", color: "#6a3fb3" },
  { label: "Haki Types", value: "Conqueror's, Armament, Observation (Advanced)", color: "#ff5a6e" },
  { label: "Affiliations", value: "Ninja-Pirate-Mink-Samurai Alliance", color: "#00a8ff" },
];

const ratings = [
  { label: "Strength", value: 98, color: "#C0001A" },
  { label: "Speed", value: 95, color: "#F4C430" },
  { label: "Durability", value: 99, color: "#6a3fb3" },
];

export default function CharacterStats() {
  return (
    <section id="stats" className="relative py-32 bg-[#04060c] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="font-bangers text-5xl md:text-7xl uppercase text-white text-glow-red">
            Combat Profile
          </h2>
          <p className="font-bebas text-xl tracking-[0.2em] text-[#C0001A] mt-4">
            Emperor of the Sea
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Info Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-[#F4C430]/20 shadow-[0_0_30px_#F4C430_20px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#F4C430]/5 to-transparent pointer-events-none" />
            <h3 className="font-bangers text-3xl text-white tracking-wider mb-8 border-b border-white/10 pb-4">
              Intelligence Dossier
            </h3>
            
            <div className="flex flex-col gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="font-bebas text-sm tracking-[0.2em] text-white/50 uppercase">
                    {stat.label}
                  </span>
                  <span className="font-cormorant text-2xl font-bold italic" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Ratings HUD */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-[#6a3fb3]/20 shadow-[0_0_30px_#6a3fb3_20px] relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6a3fb3]/5 to-transparent pointer-events-none" />
            <h3 className="font-bangers text-3xl text-white tracking-wider mb-8 border-b border-white/10 pb-4">
              Power Matrix
            </h3>

            <div className="flex flex-col gap-8">
              {ratings.map((rating, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bebas text-xl tracking-[0.1em] text-white">
                      {rating.label}
                    </span>
                    <span className="font-bangers text-2xl" style={{ color: rating.color }}>
                      {rating.value}/100
                    </span>
                  </div>
                  
                  {/* Progress Bar Background */}
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    {/* Progress Bar Fill */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${rating.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.2 + i * 0.2, ease: "easeOut" }}
                      className="h-full relative"
                      style={{ backgroundColor: rating.color }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
              <span className="font-bebas tracking-[0.2em] text-sm text-[#ff5a6e] uppercase">Warning: Threat Level Immeasurable</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
