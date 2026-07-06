'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, ThumbsUp, Trash2 } from 'lucide-react';

const mockReviews = [
  { id: 1, user: 'Luffy', product: 'Gear 5 Joyboy Hoodie', rating: 5, text: 'This hoodie is absolutely incredible! The material is premium.', date: '2 days ago' },
  { id: 2, user: 'Zoro', product: 'Wado Ichimonji Tee', rating: 4, text: 'Great fit, but took a while to arrive.', date: '1 week ago' },
  { id: 3, user: 'Sanji', product: 'Black Leg Trackpants', rating: 5, text: 'Perfect for kicking. Super stretchy.', date: '2 weeks ago' },
];

export default function ReviewsPage() {
  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">CUSTOMER REVIEWS</h1>
        <p className="text-neutral-400 text-sm">Moderate and respond to product reviews.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockReviews.map((review) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between"
          >
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{review.user}</span>
                  <span className="text-xs text-neutral-500">• {review.date}</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-[#F4C430] fill-[#F4C430]' : 'text-white/20'}`} />
                  ))}
                </div>
                <p className="text-neutral-300 text-sm italic">"{review.text}"</p>
                <p className="text-xs text-[#C0001A] mt-2 font-medium">Product: {review.product}</p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" /> Approve
              </button>
              <button className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
