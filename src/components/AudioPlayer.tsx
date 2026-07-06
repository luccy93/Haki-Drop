'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Radio } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We create the audio object only on the client side
    audioRef.current = new Audio('/audio/drums-of-liberation.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Keep it subtle

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <motion.button
        onClick={toggleAudio}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`relative w-12 h-12 flex items-center justify-center rounded-full border-2 backdrop-blur-md transition-colors duration-500 overflow-hidden ${
          isPlaying 
            ? 'border-purple-500/50 bg-purple-900/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
            : 'border-white/10 bg-black/40 text-white/50 hover:bg-black/60 hover:text-white'
        }`}
      >
        {/* Ripple Effect when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 bg-purple-500 rounded-full"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          {isPlaying ? <Volume2 size={20} /> : <Radio size={20} />}
        </div>
      </motion.button>
      
      {/* Tooltip */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 border border-white/10 rounded font-bebas tracking-widest text-xs whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-300 transform -translate-x-2 group-hover:translate-x-0"
           style={{ opacity: 0 /* Can be toggled on hover via group if desired, but kept simple */ }}>
        {isPlaying ? 'MUTE DRUMS' : 'HEAR THE DRUMS'}
      </div>
    </div>
  );
}
