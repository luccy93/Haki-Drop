'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const gearForms = [
  { name: "GEAR 1", desc: "The Rubber Boy Foundation", img: "/images/products/custom-gear1.jpg", cols: "col-span-1 md:col-span-2", span: "row-span-1" },
  { name: "GEAR 2", desc: "Blood Pumping Jet Speed", img: "/images/products/custom-gear2.jpg", cols: "col-span-1 md:col-span-1", span: "row-span-1" },
  { name: "GEAR 3", desc: "Giant Titan Bone Balloon", img: "/images/products/custom-gear3.jpg", cols: "col-span-1 md:col-span-1", span: "row-span-1" },
  { name: "GEAR 4", desc: "Bounce & Snakeman Armament", img: "/images/products/custom-gear4.jpg", cols: "col-span-1 md:col-span-2", span: "row-span-1" },
  { name: "GEAR 5", desc: "The Drums of Liberation", img: "/images/luffy-gear5.jpg", cols: "col-span-1 md:col-span-3", span: "row-span-2 md:h-[400px]" },
];

export default function VibeCodeFeatures() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="relative z-10 py-24 px-4 bg-[#020104] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center md:text-left">
          <motion.h3
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-4xl md:text-6xl font-black text-purple-500 tracking-widest drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] mb-4"
          >
            *DOOM-DUTTA-DA-DA*
          </motion.h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
            The 5 Gears of Liberation
          </h2>
          <p className="text-neutral-400 font-mono text-sm tracking-[0.2em] uppercase">
            The Drums of Liberation Echo
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block font-bangers text-base tracking-widest uppercase px-6 py-2.5 bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white rounded transition-all"
          >
            Shop All Products
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {gearForms.map((gear, i) => (
            <motion.div
              key={gear.name}
              variants={staggerItem}
              className={`relative group rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors ${gear.cols} ${gear.span} min-h-[300px] flex flex-col justify-end shadow-2xl`}
            >
              {/* Full Image Background */}
              <div className="absolute inset-0 overflow-hidden bg-neutral-950 flex items-center justify-center p-4">
                <img
                  src={gear.img}
                  alt={gear.name}
                  className="w-full h-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-lighten"
                />
              </div>

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 p-6 flex flex-col h-full justify-end">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:bg-purple-600/50 transition-colors">
                      G{i + 1}
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight drop-shadow-md">{gear.name}</h3>
                  </div>
                  <p className="text-neutral-300 text-sm font-medium drop-shadow-md">{gear.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
