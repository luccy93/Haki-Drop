import React from 'react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#04060c] pt-32 pb-24 px-6 md:px-12 text-white">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-8 md:p-16 rounded-3xl shadow-2xl">
        
        <div className="border-b border-white/10 pb-8 mb-10">
          <h1 className="text-4xl md:text-6xl font-bangers tracking-widest uppercase">Legal & Policies</h1>
          <p className="mt-2 text-gray-400 font-bebas tracking-widest text-xl">Last Updated: October 2026</p>
        </div>

        <div className="space-y-12 font-sans text-gray-300 leading-relaxed text-sm md:text-base">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Privacy Policy</h2>
            <p className="mb-4">
              Haki Drop ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
            <p>
              We collect identity data (names), contact data (emails, shipping addresses), and transaction data securely via Shopify. We do not store or process payment card details directly; all transactions are PCI-DSS compliant through our payment gateways.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Terms of Purchase</h2>
            <p className="mb-4">
              By placing an order through this website, you warrant that you are legally capable of entering into binding contracts. All orders are subject to availability and confirmation of the order price.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Dispatch times may vary according to availability and are subject to any delays resulting from postal delays or force majeure.</li>
              <li>We retain the right to refuse any request made by you. If your order is accepted, we will inform you by email.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Intellectual Property</h2>
            <p>
              The intellectual property rights in all software and content made available to you on or through this Website remains the property of Haki Drop or its licensors and are protected by copyright laws and treaties around the world. All such rights are reserved.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
