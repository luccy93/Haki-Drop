"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";
import HeroCanvas from "@/components/HeroCanvas";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function HomeLandingPage() {
  const { scrollY } = useScroll();
  
  const yAct2 = useTransform(scrollY, [0, 1500], [0, 300]);
  
  const gearForms = [
    { name: "GEAR 1", desc: "The Rubber Boy", img: "/images/products/custom-gear1.jpg" },
    { name: "GEAR 2", desc: "Blood Pumping Jet speed", img: "/images/products/custom-gear2.jpg" },
    { name: "GEAR 3", desc: "Giant Titan Bone Balloon", img: "/images/products/custom-gear3.jpg" },
    { name: "GEAR 4", desc: "Bounce & Snakeman Armament", img: "/images/products/custom-gear4.jpg" },
    { name: "GEAR 5", desc: "The Drums of Liberation", img: "/images/luffy-gear5.jpg" },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative bg-[#030108] text-white selection:bg-purple-600 selection:text-white overflow-x-hidden snap-y snap-mandatory scroll-smooth">
      
      {/* GLOBAL BACKGROUND NOISE & AMBIENT GLOW DESIGNS */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/10 via-transparent to-black pointer-events-none" />
        <HeroCanvas />
      </div>

      {/* ==========================================
          GEAR 5 HERO REVEAL
          ========================================== */}
      <section className="relative z-10 w-full h-screen overflow-hidden cursor-none snap-start">
        <div className="absolute top-0 left-0 right-0 h-1 z-20 bg-gradient-to-r from-transparent via-[#F4C430] via-[#C0001A] to-transparent" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <h1 className="font-luckiest text-5xl md:text-7xl leading-none tracking-wide uppercase text-[#F7D446]" 
              style={{ textShadow: '0 4px 0 #b3001a, 0 6px 0 #0a1a3a, 0 0 30px rgba(244,196,48,0.7), 0 0 60px rgba(244,196,48,0.3), 0 0 100px rgba(244,196,48,0.15)', WebkitTextStroke: '3px #0a1a3a' }}>
            One Piece
          </h1>
          <p className="font-bebas text-sm md:text-base tracking-[0.5em] text-white mt-1 pl-1 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
            GEAR&nbsp;&nbsp;5 &nbsp;&middot;&nbsp; AWAKENING
          </p>
        </div>
        <div className="absolute bottom-12 left-6 md:left-16 z-20 flex flex-col gap-4 max-w-[280px] md:max-w-[360px] pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="w-4 h-[1.5px] bg-[#F4C430]" />
            <span className="font-bebas text-xs md:text-sm tracking-[0.35em] uppercase text-[#F4C430]">Straw Hat Pirates</span>
          </div>
          <h2 className="font-bangers text-5xl md:text-7xl leading-none uppercase text-white drop-shadow-[3px_3px_0_#b3001a]">
            MONKEY D.<br />LUFFY
          </h2>
          <p className="font-cormorant italic text-base md:text-lg leading-relaxed text-white/80">
            The boy who would be King of the Pirates. Rubber fists, an iron will, and a grin that never quits &mdash; chasing the world&apos;s greatest treasure.
          </p>
          <Link
            href="/products"
            className="font-bebas text-sm md:text-base tracking-[0.2em] uppercase px-6 md:px-7 py-3 md:py-3.5 bg-transparent text-white border-2 border-[#F4C430] self-start relative overflow-hidden isolate transition-colors duration-300 pointer-events-auto [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)] hover:border-[#ffe066] hover:text-[#1a0a00]"
          >
            <span className="absolute inset-0 bg-[#F4C430] -translate-x-full -skew-x-[8deg] transition-transform duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)] -z-10 hover:translate-x-0 hover:skew-x-[8deg]" />
            Set Sail
          </Link>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-16 z-20 flex flex-col gap-3 max-w-[280px] md:max-w-[380px] text-right items-end pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="font-bebas text-xs md:text-sm tracking-[0.35em] uppercase text-[#ff5a6e]">Joy Boy Awakened</span>
            <span className="w-4 h-[1.5px] bg-[#ff5a6e]" />
          </div>
          <h2 className="font-bangers text-4xl md:text-6xl leading-none uppercase text-white drop-shadow-[3px_3px_0_#6a3fb3]">
            GEAR<br />FIVE
          </h2>
          <p className="font-cormorant italic text-base md:text-lg leading-relaxed text-white/80">
            The Warrior of Liberation. Laughter becomes power, the world bends to imagination &mdash; the truest form of the Nika Devil Fruit.
          </p>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 font-bebas text-xs md:text-sm tracking-[0.25em] text-white bg-black/45 px-4 py-2 rounded-full pointer-events-none">
          &#9656; MOVE ACROSS TO AWAKEN GEAR 5 &#9666;
        </div>
      </section>

      {/* ==========================================
          ACT II: THE SUPREME AWAKENING
          ========================================== */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 bg-black/60 snap-start">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          style={{ y: yAct2 }}
          className="relative text-center z-20 max-w-4xl"
        >
          <span className="font-bebas text-sm tracking-[0.3em] text-purple-400 uppercase mb-2 block">The Pirate King</span>
          <Link href="/products">
            <h2 className="text-7xl md:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-600 drop-shadow-[0_0_55px_rgba(168,85,247,0.45)] mb-6 hover:drop-shadow-[0_0_80px_rgba(168,85,247,0.7)] transition-all duration-500 cursor-pointer">
              SUN GOD NIKA
            </h2>
          </Link>
          <div className="space-y-4 text-base md:text-xl font-bold tracking-tight text-neutral-300">
            <p className="text-red-500 font-mono text-sm uppercase tracking-[0.2em]">Kaido: "White hair... White clothes... Who are you?!"</p>
            <p className="text-white uppercase text-xl md:text-3xl font-black tracking-wide">
              "I am Monkey D. Luffy! The man who will surpass you... and become the Pirate King!"
            </p>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          ACT III: THE 5 GEARS OF LIBERATION
          ========================================== */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center bg-black/80 px-4 py-24 snap-start">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16 max-w-xl"
        >
          <motion.h3 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-4xl md:text-6xl font-black text-purple-500 tracking-widest drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          >
            *DOOM-DUTTA-DA-DA*
          </motion.h3>
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mt-2 font-bold">The Drums of Liberation Echo</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-2"
        >
          {gearForms.map((gear, i) => (
            <motion.div
              key={gear.name}
              variants={staggerItem}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative bg-neutral-900/40 backdrop-blur-md border border-purple-500/20 p-3 rounded-2xl flex flex-col items-center overflow-hidden aspect-[3/4]"
            >
              <div className="w-full flex-grow bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden relative mb-3">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${gear.img}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
              </div>
              <div className="text-center z-10">
                <h4 className="text-sm font-black tracking-wider text-white uppercase group-hover:text-purple-400 transition-colors">{gear.name}</h4>
                <p className="text-[10px] text-neutral-400 font-medium truncate max-w-[120px] mt-0.5">{gear.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ==========================================
          ACT IV: CHARACTER HORIZONS & HAKI DROP GRID
          ========================================== */}
      <section className="relative z-10 flex flex-col bg-[#020104] pt-12 pb-24 border-t border-purple-900/30 snap-start">
        {/* Character Triptych Background */}
        <div className="absolute inset-0 z-0">
          <img src="/images/triptych.jpg" alt="" className="w-full h-full object-cover opacity-[0.04] mix-blend-luminosity pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020104]/80 to-[#020104]" />
        </div>
        <div className="relative z-10 px-6 pt-8 pb-4 max-w-7xl mx-auto w-full">
          <span className="font-bebas text-xs tracking-[0.4em] text-white/30 uppercase">The Three Great Powers</span>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="w-full grid grid-cols-1 md:grid-cols-3 border-b border-neutral-900 relative z-10"
        >
          {/* ZORO */}
          <motion.div variants={staggerItem} className="relative group p-8 flex flex-col justify-end min-h-[320px] overflow-hidden border-r border-neutral-900 bg-gradient-to-b from-transparent to-emerald-950/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-emerald-500/5 mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <img src="/images/zoro.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.04] group-hover:opacity-[0.10] transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-6 right-6 w-28 h-28 rounded-full border-2 border-emerald-500/20 overflow-hidden shadow-[0_0_30px_rgba(52,211,153,0.15)]">
              <img src="/images/zoro.webp" alt="Zoro" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">Enies Lobby // Wano Variant</span>
              <h3 className="text-3xl font-black uppercase text-white mt-2 tracking-tight group-hover:text-emerald-400 transition-colors drop-shadow-[0_0_20px_rgba(52,211,153,0)] group-hover:drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">ZORO // King of Hell</h3>
              <p className="text-xs text-neutral-400 mt-2 font-medium max-w-sm leading-relaxed">"Three-Sword Style Ougi... Overdrawn spiritual green mist aura blades."</p>
              <div className="flex gap-2 mt-4">
                <span className="text-[9px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bebas tracking-wider">SANTORYU</span>
                <span className="text-[9px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bebas tracking-wider">ENMA</span>
              </div>
            </div>
          </motion.div>

          {/* SANJI */}
          <motion.div variants={staggerItem} className="relative group p-8 flex flex-col justify-end min-h-[320px] overflow-hidden border-r border-neutral-900 bg-gradient-to-b from-transparent to-orange-950/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-orange-500/5 mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <img src="/images/sanji.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.04] group-hover:opacity-[0.10] transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-6 right-6 w-28 h-28 rounded-full border-2 border-orange-500/20 overflow-hidden shadow-[0_0_30px_rgba(251,146,60,0.15)]">
              <img src="/images/sanji.webp" alt="Sanji" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-black tracking-[0.3em] text-orange-400 uppercase">Germa Tech // Exoskeleton Spark</span>
              <h3 className="text-3xl font-black uppercase text-white mt-2 tracking-tight group-hover:text-orange-400 transition-colors drop-shadow-[0_0_20px_rgba(251,146,60,0)] group-hover:drop-shadow-[0_0_20px_rgba(251,146,60,0.4)]">SANJI // Ifrit Jambe</h3>
              <p className="text-xs text-neutral-400 mt-2 font-medium max-w-sm leading-relaxed">"High-velocity white hot plasma kicks generating internal physical overdrive."</p>
              <div className="flex gap-2 mt-4">
                <span className="text-[9px] px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bebas tracking-wider">BLACK LEG</span>
                <span className="text-[9px] px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bebas tracking-wider">DIABLE JAMBE</span>
              </div>
            </div>
          </motion.div>

          {/* BLACKBEARD */}
          <motion.div variants={staggerItem} className="relative group p-8 flex flex-col justify-end min-h-[320px] overflow-hidden bg-gradient-to-b from-transparent to-neutral-950">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <img src="/images/teach.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.04] group-hover:opacity-[0.10] transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-6 right-6 w-28 h-28 rounded-full border-2 border-indigo-500/20 overflow-hidden shadow-[0_0_30px_rgba(129,140,248,0.15)]">
              <img src="/images/teach.webp" alt="Teach" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-black tracking-[0.3em] text-neutral-400 uppercase">Yami Yami No Mi // Absolute Absence</span>
              <h3 className="text-3xl font-black uppercase text-white mt-2 tracking-tight group-hover:text-indigo-400 transition-colors drop-shadow-[0_0_20px_rgba(129,140,248,0)] group-hover:drop-shadow-[0_0_20px_rgba(129,140,248,0.4)]">MARSHALL D. TEACH</h3>
              <p className="text-xs text-neutral-500 mt-2 font-medium max-w-sm leading-relaxed">"Infinite localized dark gravitational voids swallowing physical matter configurations."</p>
              <div className="flex gap-2 mt-4">
                <span className="text-[9px] px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bebas tracking-wider">YAMI YAMI</span>
                <span className="text-[9px] px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bebas tracking-wider">GURA GURA</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl w-full mx-auto px-4 py-24"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="text-xs text-purple-500 font-black tracking-[0.4em] uppercase mb-2">New World Marketplace Drop</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">LIMITED COMMERCE PIECES</h2>
            </div>
            <p className="text-xs font-medium text-neutral-500 max-w-md mt-4 md:mt-0">
              Inherited Will, The Destiny of Age, and The Dreams of People. As long as people continue to pursue Freedom, these items will never cease to be.
            </p>
          </div>

          {/* INTEGRATED LIVE COMMERCE GRID */}
          <ProductGrid />
        </motion.div>
      </section>

    
      {/* GRAND FLEET NEWSLETTER */}
      <section id="newsletter" className="snap-start">
        <NewsletterSection />
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
