"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const arcs = [
  { id: 1, name: "East Blue", desc: "The legend begins. Luffy sets sail and gathers his core crew.", color: "from-blue-500/20 to-transparent" },
  { id: 2, name: "Alabasta", desc: "First clash with a Warlord. The desert kingdom is saved.", color: "from-yellow-500/20 to-transparent" },
  { id: 3, name: "Enies Lobby", desc: "Declaring war on the World Government to save Robin. Gear 2 & 3 awaken.", color: "from-red-500/20 to-transparent" },
  { id: 4, name: "Marineford", desc: "The Paramount War. A tragic loss that pushes Luffy to grow stronger.", color: "from-gray-500/20 to-transparent" },
  { id: 5, name: "Whole Cake Island", desc: "Crashing a Yonko's tea party. Snakeman is revealed.", color: "from-pink-500/20 to-transparent" },
  { id: 6, name: "Wano Country", desc: "The raid on Onigashima. Advanced Haki and the ultimate clash.", color: "from-purple-500/20 to-transparent" },
  { id: 7, name: "Gear 5 Awakening", desc: "The drums of liberation echo. Sun God Nika returns to the world.", color: "from-[#F4C430]/20 to-transparent" },
  { id: 8, name: "Egghead Island", desc: "The island of the future. The final saga begins.", color: "from-cyan-500/20 to-transparent" },
];

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section id="timeline" ref={containerRef} className="relative py-32 bg-[#04060c] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-24"
        >
          <h2 className="font-bangers text-5xl md:text-7xl uppercase text-glow-gold text-[#F4C430]">
            The Journey
          </h2>
          <p className="font-bebas text-xl tracking-[0.2em] text-white/60 mt-4">
            Path to the Pirate King
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Center SVG Line for Timeline */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              style={{ scaleY: pathLength, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-[#F4C430] to-[#C0001A]"
            />
          </div>

          <div className="flex flex-col gap-12">
            {arcs.map((arc, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={arc.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex items-center justify-start md:justify-between ${
                    isEven ? "md:flex-row-reverse" : "md:flex-row"
                  } group`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[16px] md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-3 h-3 bg-white rounded-full z-10 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_15px_#F4C430]" />

                  <div className="w-full pl-12 md:pl-0 md:w-[45%]">
                    <div className={`p-6 rounded-2xl glass border-t border-l border-white/10 bg-gradient-to-br ${arc.color} hover:bg-white/10 transition-colors duration-500`}>
                      <h3 className="font-bangers text-3xl md:text-4xl text-white tracking-wide mb-3">
                        {arc.name}
                      </h3>
                      <p className="font-cormorant text-lg text-white/80 leading-relaxed italic">
                        {arc.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-[45%]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
