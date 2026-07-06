'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const LOCAL_PRODUCTS = [
  { objectID: '1', name: 'Monkey D. Luffy - Gear 5 Figure', image: '/images/luffy-gear5.jpg', price: 2499 },
  { objectID: '2', name: 'Roronoa Zoro - Enma Wano Figure', image: '/images/products/custom-4001.jpg', price: 2199 },
  { objectID: '3', name: 'Sanji - Ifrit Jambe Figure', image: '/images/products/custom-4005.png', price: 1999 },
  { objectID: '4', name: 'Marshall D. Teach - Yami Yami Figure', image: '/images/products/custom-4007.png', price: 2299 },
  { objectID: '5', name: 'Straw Hat Pirates - Thousand Sunny', image: '/images/products/custom-4002.jpg', price: 3499 },
  { objectID: '6', name: 'Portgas D. Ace - Flame Emperor', image: '/images/products/custom-4003.jpg', price: 1899 },
  { objectID: '7', name: 'Nico Robin - Devil Child', image: '/images/products/custom-4004.jpg', price: 1799 },
  { objectID: '8', name: 'Shanks - Red-Haired Emperor', image: '/images/products/custom-4006.jpg', price: 2599 },
];

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? LOCAL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused || !query) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = activeIndex >= 0 ? activeIndex : 0;
      if (results[idx]) {
        router.push(`/products/${results[idx].objectID}`);
        setIsFocused(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); setIsFocused(true); };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      inputRef.current?.focus();
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm xl:max-w-md hidden md:block z-50">
      <div className="relative flex items-center w-full bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:border-purple-500 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 backdrop-blur-md">
        <div className="pl-4 pr-2 text-white/50">
          <Search size={18} />
        </div>
        <input 
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search the Grand Line drops..."
          className="w-full bg-transparent text-white text-sm font-sans placeholder:text-white/40 focus:outline-none py-2.5"
        />
        {query && (
          <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="px-2 text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
        <button 
          onClick={startListening}
          className={`pr-4 pl-3 py-2.5 text-white/50 hover:text-purple-400 transition-colors border-l border-white/10 ${isListening ? 'text-purple-500' : ''}`}
          title="Voice Search"
        >
          <div className="relative">
            <Mic size={18} />
            {isListening && (
              <span className="absolute inset-0 rounded-full animate-ping bg-purple-500 opacity-75"></span>
            )}
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isFocused && query.trim() && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0f1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {results.length > 0 ? (
              <div className="flex flex-col py-2">
                <div className="px-4 py-2 border-b border-white/10">
                  <h4 className="text-xs font-bebas tracking-widest text-white/50 mb-2">SUGGESTIONS</h4>
                  {results.slice(0, 3).map((p, idx) => (
                    <div 
                      key={`sug-${p.objectID}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => { router.push(`/products/${p.objectID}`); setIsFocused(false); setQuery(''); }}
                      className={`px-3 py-2 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${activeIndex === idx ? 'bg-purple-500/20 text-white' : 'text-white/70 hover:bg-white/5'}`}
                    >
                      <Search size={14} className="opacity-50" />
                      <span className="font-sans text-sm truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-black/40">
                  <h4 className="text-xs font-bebas tracking-widest text-white/50 mb-3">TOP HITS</h4>
                  <div className="flex flex-col gap-3">
                    {results.slice(0, 2).map((p, idx) => (
                      <div 
                        key={`hit-${p.objectID}`}
                        onMouseEnter={() => setActiveIndex(idx + Math.min(3, results.length))}
                        onClick={() => { router.push(`/products/${p.objectID}`); setIsFocused(false); setQuery(''); }}
                        className={`flex items-center gap-4 p-2 rounded-xl cursor-pointer transition-colors ${activeIndex === (idx + Math.min(3, results.length)) ? 'bg-purple-500/20' : 'hover:bg-white/5'}`}
                      >
                        <div className="w-12 h-12 bg-white/5 rounded-md overflow-hidden shrink-0">
                          <img src={p.image || '/images/cinematic-bg.png'} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bebas tracking-widest text-white truncate">{p.name}</span>
                          <span className="font-sans font-bold text-[#F4C430] text-sm">₹{p.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <Search size={32} className="text-white/20 mb-4" />
                <p className="font-bebas tracking-widest text-xl text-white/70">Your Haki is strong...</p>
                <p className="font-sans text-sm text-white/40 mt-1">But no drops match this coordinate.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
