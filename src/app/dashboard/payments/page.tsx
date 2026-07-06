'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Download, ArrowUpRight, Clock } from 'lucide-react';

const mockTransactions = [
  { id: 'txn_109283', amount: 4500, status: 'Completed', date: 'Today, 2:30 PM', method: 'Credit Card' },
  { id: 'txn_109284', amount: 12000, status: 'Pending', date: 'Today, 1:15 PM', method: 'Bank Transfer' },
  { id: 'txn_109285', amount: 890, status: 'Completed', date: 'Yesterday', method: 'PayPal' },
];

export default function PaymentsPage() {
  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bangers text-4xl tracking-widest text-white mb-2">PAYMENTS & SETTLEMENTS</h1>
          <p className="text-neutral-400 text-sm">Track revenue, payouts, and transaction history.</p>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-[#2a2a4a] p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full" />
          <h3 className="text-neutral-400 font-medium mb-2">Available Balance</h3>
          <p className="text-5xl font-bangers tracking-widest text-white mb-4">฿ 145,200</p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Withdraw Funds</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
          <h3 className="text-neutral-400 font-medium mb-2">Next Scheduled Payout</h3>
          <p className="text-3xl font-bangers tracking-widest text-white mb-4">฿ 45,000</p>
          <p className="text-sm text-neutral-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Expected on Friday, Oct 12</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5"><h2 className="font-bebas text-xl tracking-widest text-white">RECENT TRANSACTIONS</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/[0.02] text-neutral-500 font-medium">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-neutral-400">{txn.id}</td>
                  <td className="px-6 py-4 text-white">{txn.method}</td>
                  <td className="px-6 py-4 text-neutral-400">{txn.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${txn.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-[#F4C430]/10 text-[#F4C430] border-[#F4C430]/20'}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-white flex justify-end items-center gap-2">
                    ฿{txn.amount.toLocaleString()} <ArrowUpRight className="w-4 h-4 text-green-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
