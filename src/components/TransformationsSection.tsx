"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const transformations = [
  { id: "gear2", name: "Gear 2", subtitle: "Blood Flow Acceleration", color: "#C0001A", image: "/images/gear2.png", desc: "Drastically increases speed and strength by pumping blood at high speeds." },
  { id: "gear3", name: "Gear 3", subtitle: "Bone Balloon", color: "#F4C430", image: "/images/gear3.png", desc: "Inflates bones to gigantic proportions for devastating physical attacks." },
  { id: "gear4-boundman", name: "Gear 4: Boundman", subtitle: "Muscle Balloon", color: "#6a3fb3", image: "/images/gear4-boundman.png", desc: "Combines Armament Haki with inflated muscles for massive elasticity and power." },
  { id: "gear4-snakeman", name: "Gear 4: Snakeman", subtitle: "Speed and Unpredictability", color: "#ff5a6e", image: "/images/gear4-snakeman.png", desc: "Focuses on speed and accelerating strikes that change direction mid-air." },
  { id: "gear5", name: "Gear 5", subtitle: "Awakening: Sun God Nika", color: "#ffffff", image: "/images/gear5.png", desc: "The ultimate form. Total freedom in combat, blending cartoon physics with immense power." },
];

export default function TransformationsSection() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section id="transformations" className="relative py-32 bg-[#0a0f1a] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="font-bangers text-5xl md:text-7xl uppercase text-glow-purple text-white">
            Transformations
          </h2>
          <p className="font-bebas text-xl tracking-[0.2em] text-[#6a3fb3] mt-4">
            Evolution of Power
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {transformations.map((form) => (
            <motion.div
              key={form.id}
              layoutId={`card-${form.id}`}
              onClick={() => setActiveCard(form.id)}
              whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5 }}
              className="relative w-full md:w-[300px] h-[400px] glass rounded-3xl cursor-pointer p-6 flex flex-col justify-end overflow-hidden group shadow-2xl"
              style={{
                boxShadow: `0 0 20px ${form.color}20`,
                borderColor: `${form.color}50`
              }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-90"
                style={{ backgroundImage: `url(${form.image})` }}
              />
              {/* Gradient Overlay for text readability */}
              <div 
                className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-black via-black/40 to-transparent"
              />
              
              <motion.h3 layoutId={`title-${form.id}`} className="font-bangers text-4xl text-white tracking-widest relative z-10 text-stroke">
                {form.name}
              </motion.h3>
              <motion.p layoutId={`subtitle-${form.id}`} className="font-bebas tracking-widest text-sm relative z-10" style={{ color: form.color }}>
                {form.subtitle}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveCard(null)}
          >
            {transformations.filter(t => t.id === activeCard).map(form => (
              <motion.div
                key={form.id}
                layoutId={`card-${form.id}`}
                className="relative w-full max-w-4xl bg-[#0a0f1a] border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center overflow-hidden"
                style={{ boxShadow: `0 0 50px ${form.color}40` }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${form.image})` }}
                />
                {/* Modal Gradient Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(circle at center, transparent, #0a0f1a 80%)` }}
                />
                
                <motion.h2 layoutId={`title-${form.id}`} className="font-bangers text-5xl md:text-7xl text-white tracking-widest text-stroke mb-2 relative z-10">
                  {form.name}
                </motion.h2>
                <motion.p layoutId={`subtitle-${form.id}`} className="font-bebas text-xl md:text-2xl tracking-[0.2em] mb-8 relative z-10" style={{ color: form.color, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                  {form.subtitle}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-cormorant text-xl text-white/90 font-semibold leading-relaxed italic max-w-lg relative z-10 p-6 glass rounded-2xl bg-black/40"
                >
                  {form.desc}
                </motion.div>

                <button 
                  onClick={() => setActiveCard(null)}
                  className="mt-12 font-bebas tracking-[0.2em] px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white relative z-10 glass"
                >
                  Close
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
