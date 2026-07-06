'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';

export interface CartItem {
  id: string; // CartItem DB id if from backend
  productId: string;
  variantId: string;
  title: string;
  quantity: number;
  price: number;
  currencyCode: string;
  image?: string;
  size?: string;
  handle?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartTotal: number;
  checkoutUrl: string | null;
  addToCart: (item: any) => Promise<void>;
  removeFromCart: (itemId: string, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, variantId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  initiateCheckout: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();

  // Initialize session ID
  useEffect(() => {
    let sid = localStorage.getItem('haki_session_id');
    if (!sid) {
      sid = generateSessionId();
      localStorage.setItem('haki_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  const formatCartData = (backendCartItems: any[]): CartItem[] => {
    return backendCartItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId || '',
      title: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      currencyCode: 'INR',
      image: item.product.images?.[0] || '/images/cinematic-bg.png',
      handle: item.product.handle || item.productId,
    }));
  };

  const fetchCart = useCallback(async () => {
    if (!sessionId && !isAuthenticated) return;
    try {
      const { data } = await api.get(`/api/cart?sessionId=${sessionId}`);
      if (data && data.items) {
        setCartItems(formatCartData(data.items));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [sessionId, isAuthenticated]);

  useEffect(() => {
    if (sessionId) {
      fetchCart();
    }
  }, [sessionId, fetchCart]);

  // Merge cart on login
  useEffect(() => {
    if (isAuthenticated && sessionId) {
      api.post('/api/cart/merge', { sessionId }).then(({ data }) => {
        if (data && data.items) {
           setCartItems(formatCartData(data.items));
           // Generate new session ID for next time they log out
           const newSid = generateSessionId();
           localStorage.setItem('haki_session_id', newSid);
           setSessionId(newSid);
        }
      }).catch(err => console.error('Error merging cart', err));
    }
  }, [isAuthenticated]); // Run once on auth status change

  const addToCart = async (newItem: any) => {
    try {
      const { data } = await api.post('/api/cart/add', {
        sessionId,
        productId: newItem.productId || newItem.id, // Support different formats passed from UI
        variantId: newItem.variantId,
        quantity: newItem.quantity
      });
      if (data && data.items) {
        setCartItems(formatCartData(data.items));
        setIsCartOpen(true);
      }
    } catch (error: any) {
      console.error('addToCart error:', error.response?.data, error.message);
      alert(error.response?.data?.error || error.response?.data?.message || 'Failed to add to cart. Please check stock.');
    }
  };

  const removeFromCart = async (itemId: string, variantId?: string) => {
    // If it's a backend ID (uuid), use it directly. Otherwise, we might need to find it
    const item = cartItems.find(i => i.id === itemId || i.variantId === variantId);
    if (!item) return;

    try {
      const { data } = await api.delete(`/api/cart/item/${item.id}?sessionId=${sessionId}`);
      if (data && data.items) {
        setCartItems(formatCartData(data.items));
      } else {
        setCartItems([]); // Empty cart fallback
      }
    } catch (error: any) {
      console.error('removeFromCart error:', error.response?.data, error.message);
    }
  };

  const updateQuantity = async (itemId: string, variantId: string, quantity: number) => {
    const item = cartItems.find(i => i.id === itemId || i.variantId === variantId);
    if (!item) return;

    if (quantity <= 0) {
      return removeFromCart(item.id, variantId);
    }

    try {
      const { data } = await api.put(`/api/cart/item/${item.id}`, { quantity, sessionId });
      if (data && data.items) {
        setCartItems(formatCartData(data.items));
      }
    } catch (error: any) {
      console.error('updateQuantity error:', error.response?.data, error.message);
      alert(error.response?.data?.error || error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const clearCart = useCallback(async () => {
    try {
      // First, try to clear on backend
      await api.delete(`/api/cart/clear?sessionId=${sessionId}`);
    } catch (error) {
      console.error('Failed to clear cart in backend', error);
    }
    // Always clear frontend cart
    setCartItems([]);
  }, [sessionId]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const initiateCheckout = async () => {
    router.push('/checkout');
    setIsCartOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        cartCount,
        cartTotal,
        checkoutUrl,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setIsCartOpen,
        initiateCheckout,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
