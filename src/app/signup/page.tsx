'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, UserPlus } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    let score = 0;
    if (formData.password.length > 5) score += 1;
    if (formData.password.length > 8) score += 1;
    if (/[A-Z]/.test(formData.password)) score += 1;
    if (/[0-9]/.test(formData.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;
    setPasswordStrength(Math.min(score, 4));
  }, [formData.password]);

  const handleSignup = async (e?: React.FormEvent, providerEmail?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');

    if (providerEmail === 'Google Account') {
      return;
    }

    if (!termsAccepted) {
      return setErrorMsg('Please accept the Terms & Privacy Policy.');
    }
    if (formData.password.length < 8) {
      return setErrorMsg('Password must be at least 8 characters.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg('Passwords do not match.');
    }

    setIsLoading(true);
    
    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setIsSuccess(true);
      setTimeout(() => {
        const params = new URLSearchParams({ email: formData.email });
        if (res.data.devOtp) params.set('devOtp', res.data.devOtp);
        window.location.href = `/verify-otp?${params.toString()}`;
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || '';
      if (msg === 'Email already registered') {
        setErrorMsg('This email is already registered. Please sign in instead.');
        setIsLoading(false);
        return;
      }
      setErrorMsg(msg || 'Failed to register. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#04060c] pt-32 pb-12 px-6 flex flex-col items-center justify-center text-white overflow-x-hidden overflow-y-auto relative">
      
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tl from-[#6a3fb3]/10 via-transparent to-[#F4C430]/5 blur-3xl rounded-full pointer-events-none" />

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 50, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#F4C430] z-50 pointer-events-none mix-blend-screen"
            style={{ x: '-50%', y: '-50%' }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
        className="w-full max-w-md bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl my-auto"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20 mb-4">
            <UserPlus className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="font-bangers text-5xl tracking-widest text-[#F4C430] drop-shadow-[2px_2px_0_#b3001a] mb-2">
            JOIN THE FLEET
          </h1>
          <p className="font-bebas text-lg tracking-widest text-white/50">CREATE YOUR ACCOUNT</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-8">
          
          <div className="relative group">
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-transparent border-b-2 border-white/20 px-0 py-2 text-lg font-sans focus:outline-none focus:border-[#F4C430] transition-colors peer"
              placeholder=" "
            />
            <label className="absolute left-0 top-2 text-white/50 font-bebas text-xl tracking-widest transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#F4C430] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[#F4C430]">
              FULL NAME
            </label>
          </div>

          <div className="relative group">
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent border-b-2 border-white/20 px-0 py-2 text-lg font-sans focus:outline-none focus:border-[#F4C430] transition-colors peer"
              placeholder=" "
            />
            <label className="absolute left-0 top-2 text-white/50 font-bebas text-xl tracking-widest transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#F4C430] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[#F4C430]">
              EMAIL ADDRESS
            </label>
          </div>

          <div className="relative group">
            <input 
              type={showPassword ? 'text' : 'password'} 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-transparent border-b-2 border-white/20 pr-8 py-2 text-lg font-sans focus:outline-none focus:border-[#F4C430] transition-colors peer"
              placeholder=" "
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-2 text-white/50 hover:text-white transition-colors" tabIndex={-1}>
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <label className="absolute left-0 top-2 text-white/50 font-bebas text-xl tracking-widest transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#F4C430] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[#F4C430]">
              PASSWORD
            </label>
            {formData.password && (
              <div className="absolute -bottom-4 left-0 w-full flex gap-1 h-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-full ${i < passwordStrength ? (passwordStrength > 2 ? 'bg-green-500' : passwordStrength > 1 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-white/10'}`} />
                ))}
              </div>
            )}
            {formData.password && formData.password.length < 8 && (
              <p className="absolute -bottom-7 left-0 text-[10px] text-red-400/60 font-sans">Minimum 8 characters</p>
            )}
          </div>

          <div className="relative group mt-2">
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full bg-transparent border-b-2 border-white/20 pr-8 py-2 text-lg font-sans focus:outline-none focus:border-[#F4C430] transition-colors peer"
              placeholder=" "
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-2 text-white/50 hover:text-white transition-colors" tabIndex={-1}>
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <label className="absolute left-0 top-2 text-white/50 font-bebas text-xl tracking-widest transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#F4C430] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[#F4C430]">
              CONFIRM PASSWORD
            </label>
            {formData.confirmPassword && formData.confirmPassword === formData.password && (
              <CheckCircle2 className="absolute right-8 top-2 w-5 h-5 text-green-500" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 bg-transparent border-white/20 rounded cursor-pointer accent-[#F4C430]"
            />
            <label htmlFor="terms" className="text-white/70 text-sm font-sans cursor-pointer">
              I agree to the <Link href="#" className="text-[#F4C430] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#F4C430] hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="w-full font-bebas text-2xl tracking-widest uppercase py-4 bg-transparent border-2 border-[#F4C430] text-white relative overflow-hidden group/btn mt-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">{isLoading ? 'REGISTERING...' : 'REGISTER'}</span>
            <div className="absolute inset-0 bg-[#F4C430] -translate-x-[105%] skew-x-[-10deg] transition-transform duration-300 ease-in-out z-0 group-hover/btn:translate-x-0" />
            <div className="absolute inset-0 z-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
          </motion.button>
          
          {errorMsg && (
            <div className="text-red-500 text-sm font-sans text-center mt-2">
              {errorMsg}
            </div>
          )}
          <p className="text-[10px] text-orange-400/60 font-sans text-center mt-3">
            📬 Verification emails sometimes land in <strong>Spam</strong> — check there if you don't see it.
          </p>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0a0f1c] text-white/50 font-sans">Or continue with</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button type="button" onClick={() => handleSignup(undefined, 'Google Account')} className="flex items-center justify-center gap-3 w-full py-3.5 bg-white text-black font-sans font-bold rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

        </div>

        <div className="mt-8 text-center font-sans text-sm text-white/50">
          Already part of the crew?{' '}
          <Link href="/login" className="text-[#C0001A] hover:text-white transition-colors font-bold">
            Sign In
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
