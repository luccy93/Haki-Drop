'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Heart, Menu, X, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchAutocomplete from './SearchAutocomplete';

export default function Header() {
  const { setIsCartOpen, cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 md:p-6 bg-gradient-to-b from-black/90 via-black/80 to-transparent backdrop-blur-md pointer-events-auto">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl md:text-2xl font-black tracking-wider text-white whitespace-nowrap">
            HAKI <span className="text-purple-500">DROP</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-bold tracking-widest uppercase text-neutral-300">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-purple-400 transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Central Search Component */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 justify-center">
          <SearchAutocomplete />
        </div>

        <div className="flex items-center space-x-4 text-white">
          <Link href="/dashboard" className="hidden md:block hover:text-purple-400 transition-colors" title="Dashboard">
            <LayoutDashboard size={22} />
          </Link>
          <Link href="/login" className="hover:text-purple-400 transition-colors" title="Account">
            <User size={22} />
          </Link>
          <Link href="/wishlist" className="hover:text-purple-400 transition-colors hidden md:block" title="Wishlist">
            <Heart size={22} />
          </Link>
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-purple-400 transition-colors" title="Open Cart">
            <ShoppingBag size={22} />
            <span className="absolute -top-2 -right-2 bg-purple-600 text-xs px-1.5 rounded-full">{totalItems}</span>
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden ml-2 hover:text-purple-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 pt-20">
          <div className="w-full px-8 mb-4">
            <SearchAutocomplete />
          </div>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-black tracking-widest text-white uppercase hover:text-purple-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
