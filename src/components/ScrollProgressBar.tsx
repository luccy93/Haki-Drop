'use client';

import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Ship } from 'lucide-react';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress slightly so it feels like sailing
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map the 0-1 scaleX to a percentage string for positioning the ship
  const xPos = useTransform(scaleX, [0, 1], ['0%', '100%']);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[200] pointer-events-none">
      {/* Background Line */}
      <div className="absolute inset-0 bg-white/5" />
      
      {/* Progress Line */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-purple-500 to-[#F4C430] origin-left"
        style={{ scaleX }}
      />
      
      {/* The Ship */}
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -ml-3"
          style={{ left: xPos }}
        >
          <div className="relative">
            {/* Wake/Trail effect */}
            <motion.div 
              className="absolute right-full top-1/2 -translate-y-1/2 h-[2px] w-8 bg-gradient-to-l from-white/50 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            {/* The Ship Icon */}
            <div className="text-[#F4C430] drop-shadow-[0_0_8px_rgba(244,196,48,0.8)] filter">
              <Ship size={20} className="transform -rotate-12" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
