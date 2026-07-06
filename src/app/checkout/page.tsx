'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

// Make sure to set this in your environment
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred.');
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      setError(error.message || 'Payment failed.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6 bg-[#0a0a0a] p-8 rounded-xl border border-white/10">
      <PaymentElement className="mb-6" />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <button 
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bangers text-2xl tracking-wider rounded disabled:opacity-50 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-shadow"
      >
        {isProcessing ? 'PROCESSING...' : 'PAY NOW'}
      </button>
    </form>
  );
};

export default function CheckoutPage() {
  const { cartItems, cartTotal, fetchCart, clearCart } = useCart();
  const { user } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [clientSecret, setClientSecret] = useState('');
  const [totals, setTotals] = useState({ subtotal: 0, taxAmount: 0, shippingFee: 0, totalAmount: 0 });
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [isProcessingMock, setIsProcessingMock] = useState(false);
  const [showFakePayment, setShowFakePayment] = useState(false);
  const [fakeCard, setFakeCard] = useState({ number: '4242 4242 4242 4242', expiry: '12/28', cvv: '123' });
  const [fakeProcessing, setFakeProcessing] = useState(false);
  const [fakeStep, setFakeStep] = useState<'form' | 'processing' | 'success'>('form');
  const [mockMetadata, setMockMetadata] = useState<any>(null);
  const [gateway, setGateway] = useState('stripe');

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cartItems.length === 0 && step === 1) {
      router.push('/collections/all');
    }
  }, [cartItems, router, step]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const initPayment = async () => {
    setIsInitializingPayment(true);
    try {
      const { data } = await api.post('/api/orders/payment-intent', {
        items: cartItems.map(item => ({ productId: item.productId || item.id, quantity: item.quantity })),
        shippingAddressId: null, // For guest/manual address we'd save it first and pass ID. Mocking for now.
        shippingMethod,
        gateway
      });
      setClientSecret(data.clientSecret);
      
      if (data.metadata) setMockMetadata(data.metadata);
      setTotals({
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        shippingFee: data.shippingFee,
        totalAmount: data.totalAmount
      });
      if (step < 4) {
        handleNext();
      }
    } catch (error) {
      console.error('Failed to initialize payment', error);
      alert('Failed to initialize payment. Check stock.');
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const handleMockPayment = async () => {
    setIsProcessingMock(true);
    try {
      const endpoint = gateway === 'cod' ? '/api/orders/place-cod' : '/api/orders/mock-payment';
      const res = await api.post(endpoint, {
        metadata: mockMetadata,
        items: cartItems,
        shippingAddress: address,
        userId: user?.id,
        userEmail: user?.email,
      });
      if (res.data.success) {
        clearCart();
        router.push('/checkout/success');
      }
    } catch (err: any) {
      console.error('Payment failed', err);
      const backendError = err.response?.data?.error || err.response?.data?.message || err.message;
      alert('Payment failed: ' + backendError);
    } finally {
      setIsProcessingMock(false);
    }
  };

  const openRazorpay = () => {
    if (typeof window === 'undefined' || !(window as any).Razorpay) {
      alert('Razorpay SDK not loaded');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'mock_key_id',
      amount: Math.round(totals.totalAmount * 100),
      currency: 'INR',
      name: 'One Piece Store',
      description: 'Order Payment',
      order_id: clientSecret,
      handler: async function (response: any) {
        setIsProcessingMock(true); // Reusing this for loading state
        try {
          const verifyRes = await api.post('/api/orders/verify-razorpay', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            metadata: mockMetadata,
            items: cartItems,
            shippingAddress: address,
            userId: user?.id,
            userEmail: user?.email,
          });
          if (verifyRes.data.success) {
            clearCart();
            router.push('/checkout/success');
          }
        } catch (error) {
          console.error('Payment verification failed', error);
          alert('Payment verification failed');
        } finally {
          setIsProcessingMock(false);
        }
      },
      prefill: {
        name: user?.name || 'Guest User',
        email: user?.email || 'guest@example.com'
      },
      theme: {
        color: '#a855f7'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      alert(response.error.description);
    });
    rzp.open();
  };


  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 font-inter">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bangers tracking-widest text-center mb-10 text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-purple-500">
          SECURE CHECKOUT
        </h1>

        {/* Stepper */}
        <div className="flex justify-between mb-12 relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-red-500 to-purple-500 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step - 1) / 3) * 100}%` }} 
          />
          {['Address', 'Shipping', 'Review', 'Payment'].map((label, idx) => (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${step >= idx + 1 ? 'bg-purple-600' : 'bg-gray-800'}`}>
                {idx + 1}
              </div>
              <span className="text-xs mt-2 font-medium tracking-wider uppercase text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="bg-[#111] p-8 rounded-2xl border border-white/5">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input placeholder="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-purple-500 outline-none" required />
                <input placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-purple-500 outline-none" required />
                <input placeholder="State/Province" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-purple-500 outline-none" required />
                <input placeholder="Country" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-purple-500 outline-none" required />
                <input placeholder="ZIP/Postal Code" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-purple-500 outline-none md:col-span-2" required />
              </div>
              <button 
                onClick={handleNext}
                disabled={!address.street || !address.city || !address.state || !address.country || !address.zipCode}
                className="mt-8 px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Continue to Shipping
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="bg-[#111] p-8 rounded-2xl border border-white/5">
              <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
              <div className="space-y-4">
                {[
                  { id: 'STANDARD', name: 'Standard Shipping', time: '3-5 Business Days', price: '₹10.00' },
                  { id: 'EXPRESS', name: 'Express Shipping', time: '1-2 Business Days', price: '₹25.00' },
                  { id: 'STORE_PICKUP', name: 'Store Pickup', time: 'Available Today', price: 'Free' }
                ].map(method => (
                  <label key={method.id} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === method.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/30'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="shipping" checked={shippingMethod === method.id} onChange={() => setShippingMethod(method.id)} className="w-5 h-5 accent-purple-500" />
                      <div>
                        <div className="font-bold">{method.name}</div>
                        <div className="text-sm text-gray-400">{method.time}</div>
                      </div>
                    </div>
                    <div className="font-bold">{method.price}</div>
                  </label>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold rounded hover:bg-white/5 transition-colors">Back</button>
                <button onClick={handleNext} className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">Continue to Review</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="bg-[#111] p-8 rounded-2xl border border-white/5">
              <h2 className="text-2xl font-bold mb-6">Order Review</h2>
              <div className="space-y-6 mb-8">
                {cartItems.map(item => (
                  <div key={item.variantId} className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold rounded hover:bg-white/5 transition-colors">Back</button>
                <button onClick={initPayment} disabled={isInitializingPayment} className="px-8 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isInitializingPayment ? 'Preparing...' : 'Proceed to Payment'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
                     <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
                     <div className="flex justify-between text-gray-400"><span>Shipping</span><span>₹{totals.shippingFee.toFixed(2)}</span></div>
                     <div className="flex justify-between text-gray-400"><span>Estimated Tax</span><span>₹{totals.taxAmount.toFixed(2)}</span></div>
                     <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                       <span>Total</span>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">₹{totals.totalAmount.toFixed(2)}</span>
                     </div>
                  </div>
                  <button onClick={handleBack} className="mt-6 px-6 py-2 bg-transparent border border-white/20 text-white font-bold rounded hover:bg-white/5 transition-colors text-sm">Back to Review</button>
                </div>
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-4">
                        <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${gateway === 'stripe' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/30'}`}>
                          <input type="radio" name="gateway" checked={gateway === 'stripe'} onChange={() => { setGateway('stripe'); setClientSecret(''); }} className="hidden" />
                          <div className="font-bold text-center">Stripe (Card)</div>
                        </label>
                        <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${gateway === 'razorpay' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/30'}`}>
                          <input type="radio" name="gateway" checked={gateway === 'razorpay'} onChange={() => { setGateway('razorpay'); setClientSecret(''); }} className="hidden" />
                          <div className="font-bold text-center">Razorpay (UPI)</div>
                        </label>
                      </div>
                      <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${gateway === 'cod' ? 'border-green-500 bg-green-500/10' : 'border-white/10 hover:border-white/30'}`}>
                        <input type="radio" name="gateway" checked={gateway === 'cod'} onChange={() => { setGateway('cod'); setClientSecret('cod'); }} className="hidden" />
                        <div className="font-bold text-center flex items-center justify-center gap-2">
                          <span className="text-green-400">💀</span> Cash on Delivery
                        </div>
                      </label>
                    </div>
                  </div>

                  {(!clientSecret) ? (
                    <div className="bg-[#111] p-8 rounded-2xl border border-white/5 text-center">
                      <button onClick={initPayment} disabled={isInitializingPayment} className="w-full py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition-colors disabled:opacity-50">
                        {isInitializingPayment ? 'Preparing...' : 'Load Payment Provider'}
                      </button>
                    </div>
                  ) : gateway === 'cod' ? (
                    <div className="bg-[#111] p-8 rounded-2xl border border-green-500/20 text-center">
                      <h3 className="text-xl font-bold mb-4 text-green-400">Cash on Delivery</h3>
                      <p className="text-gray-400 mb-6 text-sm">
                        Pay when your order arrives. No online payment needed.
                      </p>
                      <button 
                        onClick={handleMockPayment}
                        disabled={isProcessingMock}
                        className="w-full py-4 rounded font-bold transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.02] text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] disabled:opacity-50"
                      >
                        {isProcessingMock ? 'Placing Order...' : 'Place Order (COD)'}
                      </button>
                    </div>
                  ) : clientSecret === 'mock_client_secret_123' && !showFakePayment ? (
                    <div className="bg-[#111] p-8 rounded-2xl border border-white/5 text-center">
                      <h3 className="text-xl font-bold mb-4 text-purple-400">Test Mode Active</h3>
                      <p className="text-gray-400 mb-6 text-sm">
                        No Stripe keys were found. Use the fake card simulator to test payment.
                      </p>
                      <button 
                        onClick={() => setShowFakePayment(true)}
                        className="w-full py-4 rounded font-bold transition-all bg-gradient-to-r from-red-600 to-purple-600 hover:scale-[1.02] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      >
                        Simulate Card Payment
                      </button>
                    </div>
                  ) : clientSecret === 'mock_client_secret_123' && showFakePayment ? (
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
                      <h3 className="text-lg font-bold mb-4 text-purple-400">Fake Card Payment</h3>
                      {fakeStep === 'form' && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Card Number</label>
                            <input value={fakeCard.number} onChange={e => setFakeCard({...fakeCard, number: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm font-mono focus:border-purple-500 outline-none" />
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <label className="text-xs text-gray-400 mb-1 block">Expiry</label>
                              <input value={fakeCard.expiry} onChange={e => setFakeCard({...fakeCard, expiry: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm font-mono focus:border-purple-500 outline-none" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-gray-400 mb-1 block">CVV</label>
                              <input value={fakeCard.cvv} onChange={e => setFakeCard({...fakeCard, cvv: e.target.value})} maxLength={4} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm font-mono focus:border-purple-500 outline-none" />
                            </div>
                          </div>
                          <button onClick={async () => {
                            setFakeStep('processing');
                            await new Promise(r => setTimeout(r, 2000));
                            setFakeStep('success');
                            await new Promise(r => setTimeout(r, 800));
                            handleMockPayment();
                          }} className="w-full py-3 rounded font-bold bg-gradient-to-r from-purple-600 to-red-600 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                            Pay ₹{totals.totalAmount.toFixed(2)}
                          </button>
                          <button onClick={() => setShowFakePayment(false)} className="w-full text-sm text-gray-500 hover:text-white transition-colors">Back</button>
                        </div>
                      )}
                      {fakeStep === 'processing' && (
                        <div className="text-center py-8 space-y-4">
                          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-purple-400 font-bold animate-pulse">PROCESSING PAYMENT...</p>
                          <p className="text-gray-500 text-sm">Please do not close this page</p>
                        </div>
                      )}
                      {fakeStep === 'success' && (
                        <div className="text-center py-8 space-y-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-white text-xl">✓</span>
                          </div>
                          <p className="text-green-400 font-bold">PAYMENT SUCCESSFUL!</p>
                        </div>
                      )}
                    </div>
                  ) : gateway === 'stripe' ? (
                    <Elements options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#a855f7' } } }} stripe={stripePromise}>
                      <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                  ) : (
                    <div className="bg-[#111] p-8 rounded-2xl border border-white/5 text-center">
                      <button 
                        onClick={openRazorpay} 
                        disabled={isProcessingMock}
                        className="w-full py-4 rounded font-bold transition-all bg-gradient-to-r from-red-600 to-purple-600 hover:scale-[1.02] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
                      >
                        {isProcessingMock ? 'Processing...' : 'Pay with Razorpay'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
