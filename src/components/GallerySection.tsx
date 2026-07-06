"use client";

import { motion } from "framer-motion";

const galleryItems = [
  { id: 1, color: "#C0001A", title: "Gear 2 Awakens", height: "h-64", image: "/images/gear2.png" },
  { id: 2, color: "#F4C430", title: "Base Luffy", height: "h-96", image: "/images/luffy-base.jpg" },
  { id: 3, color: "#6a3fb3", title: "Boundman", height: "h-80", image: "/images/gear4-boundman.png" },
  { id: 4, color: "#ff5a6e", title: "Snakeman", height: "h-64", image: "/images/gear4-snakeman.png" },
  { id: 5, color: "#ffffff", title: "Sun God Nika", height: "h-96", image: "/images/gear5.png" },
  { id: 6, color: "#00a8ff", title: "Luffy Gear 5", height: "h-80", image: "/images/luffy-gear5.jpg" },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="relative py-32 bg-[#0a0f1a] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="font-bangers text-5xl md:text-7xl uppercase text-glow-gold text-[#F4C430]">
            Memories of Liberation
          </h2>
          <p className="font-bebas text-xl tracking-[0.2em] text-white/60 mt-4">
            Cinematic Gallery
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`relative w-full ${item.height} rounded-2xl overflow-hidden glass cursor-pointer group`}
            >
              {/* Gallery Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Inner Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                <span className="font-bebas text-2xl tracking-widest text-white">
                  {item.title}
                </span>
                <span className="font-cormorant text-sm italic text-white/70">
                  Click to view
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <button className="font-bebas text-lg tracking-[0.2em] uppercase px-8 py-3 bg-transparent text-[#F4C430] border-2 border-[#F4C430] hover:bg-[#F4C430] hover:text-black transition-colors duration-300">
            Load More Archives
          </button>
        </div>
      </div>
    </section>
  );
}
