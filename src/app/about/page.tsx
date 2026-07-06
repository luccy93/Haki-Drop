'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// Advanced 3D Tilt Card Component
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX - width / 2);
    y.set(mouseY - height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-[1500px] ${className}`}
    >
      <div 
        style={{ transform: "translateZ(50px)" }} 
        className="w-full h-full relative z-0 transition-transform duration-200"
      >
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`,
            x: useTransform(mouseXSpring, [-300, 300], [-50, 50]),
            y: useTransform(mouseYSpring, [-300, 300], [-50, 50])
          }}
        />
        {children}
      </div>
    </motion.div>
  );
};

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleText = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-[200vh] bg-[#04060c] text-white selection:bg-purple-500 selection:text-white relative">
      
      {/* 3D Parallax Background */}
      <motion.div 
        style={{ y: bgY }}
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
      >
        <div className="absolute top-40 left-10 w-96 h-96 bg-[#C0001A]/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-40 right-10 w-[500px] h-[500px] bg-[#F4C430]/20 rounded-full blur-[200px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[250px]" />
      </motion.div>

      <div className="relative z-10 pt-48 pb-32 px-6 md:px-12 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Hero Section */}
        <motion.div 
          style={{ opacity: opacityText, scale: scaleText }}
          className="text-center mb-40 h-[60vh] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1000 }}
          >
            <h1 className="text-7xl md:text-9xl font-bangers tracking-widest uppercase drop-shadow-[0_0_30px_rgba(192,0,26,0.4)]">
              OUR <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#F4C430] to-[#C0001A]">STORY</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <p className="mt-8 text-2xl font-bebas tracking-[0.3em] text-neutral-400">
              FORGED IN THE FIRES OF LIBERATION
            </p>
          </motion.div>
        </motion.div>

        {/* 3D Story Cards */}
        <div className="space-y-32 w-full max-w-4xl">
          
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <TiltCard className="w-full">
              <div className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] relative overflow-hidden group">
                {/* 3D Inner floating element */}
                <div 
                  className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#C0001A]/20 to-transparent rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-1000"
                  style={{ transform: "translateZ(-20px)" }}
                />
                
                <h2 className="text-4xl md:text-5xl font-bangers tracking-wider text-white mb-8 drop-shadow-[2px_2px_0_rgba(192,0,26,0.5)]">
                  THE DAWN OF A NEW ERA
                </h2>
                <div className="space-y-6 font-sans text-lg md:text-xl text-neutral-300 leading-relaxed font-light relative z-10">
                  <p>
                    <span className="text-[#F4C430] font-bold tracking-wider">HAKI DROP</span> wasn't born in a boardroom. It was born on the streets, fueled by a relentless desire to break free from the mundane.
                  </p>
                  <p>
                    We looked at the current landscape of streetwear and saw uniforms—apparel designed to blend in. We wanted to build armor for those who want to stand out. We sought to manifest the untamed spirit of the pirate king into everyday threads.
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <TiltCard className="w-full">
              <div className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] relative overflow-hidden group">
                <div 
                  className="absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-[#F4C430]/20 to-transparent rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-1000"
                  style={{ transform: "translateZ(-20px)" }}
                />
                
                <h2 className="text-4xl md:text-5xl font-bangers tracking-wider text-white mb-8 drop-shadow-[2px_2px_0_rgba(244,196,48,0.3)]">
                  SUPREME QUALITY. UNYIELDING WILL.
                </h2>
                <div className="space-y-6 font-sans text-lg md:text-xl text-neutral-300 leading-relaxed font-light relative z-10">
                  <p>
                    Every garment is a testament to the <span className="text-[#F4C430] italic">Conqueror's Haki</span> inside all of us. 
                  </p>
                  <p>
                    We source only the heaviest, most durable cottons, weave custom metallic threads, and utilize advanced dye-sublimation techniques to ensure our graphics never fade. Our aesthetic honors the "Sun God Nika"—ridiculous, unconstrained, and completely free.
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Epic Call to Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="pt-20 text-center"
          >
            <h3 className="font-bebas text-4xl text-white tracking-[0.2em] mb-8">
              WILL YOU ANSWER THE CALL?
            </h3>
            <motion.a 
              href="/collections"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(192,0,26,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-12 py-5 bg-gradient-to-r from-[#C0001A] to-[#800011] font-bangers text-3xl tracking-widest rounded-full transition-shadow"
            >
              JOIN THE CREW
            </motion.a>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
