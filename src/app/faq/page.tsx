"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "When will my order ship?",
    answer: "Our standard drops take 3-5 business days to process before shipping. For ultra-limited 'Conqueror' tier drops, please allow 7-10 business days as each piece undergoes manual quality inspection."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship globally across the Grand Line. Shipping costs and transit times are calculated dynamically at checkout based on your territory."
  },
  {
    question: "What is your return policy?",
    answer: "Due to the highly limited nature of our inventory, all sales are final. Exchanges are only accepted for defective items within 7 days of delivery. Please consult our size charts carefully before purchasing."
  },
  {
    question: "How do the garments fit?",
    answer: "Our premium streetwear is engineered with a dropped-shoulder, oversized boxy fit. We recommend ordering your true size for the intended aesthetic, or sizing down if you prefer a standard fit."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#04060c] pt-32 pb-24 px-6 md:px-12 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bangers tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            FAQ & SUPPORT
          </h1>
          <p className="mt-4 text-gray-400 font-sans text-lg">Everything you need to know about navigating the drops.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transform-gpu"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bebas text-2xl tracking-wider">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                >
                  <Plus className="text-purple-400" />
                </motion.div>
              </button>
              
              <motion.div 
                initial={false}
                animate={{ 
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-gray-400 font-sans text-lg leading-relaxed border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
