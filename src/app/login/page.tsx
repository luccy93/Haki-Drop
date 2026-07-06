'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Eye, EyeOff, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e?: React.FormEvent, providerEmail?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');

    if (providerEmail === 'Google Account') {
      return;
    }

    if (!email || !password) {
      return setErrorMsg('Please enter both email and password.');
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
        device: navigator.userAgent,
        browser: 'Web'
      });

      setAuth(res.data.user, res.data.accessToken);
      setIsSuccess(true);
      setTimeout(() => {
        const role = res.data.user.role?.toLowerCase?.();
        const url = role === 'customer' ? '/profile' : '/dashboard';
        router.push(url);
        setTimeout(() => { window.location.href = url; }, 2000);
      }, 1000);
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.needsOTP) {
        setErrorMsg('Please verify your email first. Redirecting to OTP verification...');
        setTimeout(() => {
          const url = `/verify-otp?email=${encodeURIComponent(email)}`;
          router.push(url);
          setTimeout(() => { window.location.href = url; }, 2000);
        }, 1500);
        setIsLoading(false);
        return;
      }
      setErrorMsg(data?.error || data?.message || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#04060c] pt-32 pb-12 px-6 flex flex-col items-center justify-center text-white overflow-x-hidden overflow-y-auto relative">
      
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#C0001A]/10 via-transparent to-[#F4C430]/5 blur-3xl rounded-full pointer-events-none" />

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
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
        className="w-full max-w-md bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl my-auto"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-[#C0001A]/10 rounded-full flex items-center justify-center border border-[#C0001A]/20 mb-4">
            <User className="w-8 h-8 text-[#C0001A]" />
          </div>
          <h1 className="font-bangers text-5xl tracking-widest text-[#F4C430] drop-shadow-[2px_2px_0_#b3001a] mb-2">
            WELCOME BACK
          </h1>
          <p className="font-bebas text-lg tracking-widest text-white/50">RESUME YOUR VOYAGE</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="relative group">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/20 px-0 py-3 text-lg font-sans focus:outline-none focus:border-[#F4C430] transition-colors peer"
              placeholder=" "
            />
            <label className="absolute left-0 top-3 text-white/50 font-bebas text-xl tracking-widest transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#F4C430] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[#F4C430]">
              EMAIL ADDRESS
            </label>
          </div>

          <div className="relative group mt-4">
            <input 
              type={showPassword ? 'text' : 'password'} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/20 pr-8 py-3 text-lg font-sans focus:outline-none focus:border-[#F4C430] transition-colors peer"
              placeholder=" "
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-3 text-white/50 hover:text-white transition-colors" tabIndex={-1}>
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <label className="absolute left-0 top-3 text-white/50 font-bebas text-xl tracking-widest transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#F4C430] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[#F4C430]">
              PASSWORD
            </label>
          </div>

          <div className="flex justify-between items-center mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${rememberMe ? 'bg-[#F4C430] border-[#F4C430]' : 'border-white/20 bg-black/50 group-hover:border-blue-500'}`}>
                <input 
                  type="checkbox" 
                  className="opacity-0 absolute w-0 h-0"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {rememberMe && <Check className="w-3 h-3 text-black" />}
              </div>
              <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="w-full font-bebas text-2xl tracking-widest uppercase py-4 bg-[#C0001A] text-white hover:bg-[#ff1a38] transition-colors rounded-lg shadow-[0_0_20px_rgba(192,0,26,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </motion.button>
          
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mt-2">
              <p className="text-red-400 text-sm font-sans text-center font-medium">{errorMsg}</p>
              {errorMsg === 'Invalid email or password' && (
                <p className="text-red-400/60 text-xs font-sans text-center mt-1">Don't have an account? <Link href="/signup" className="text-[#F4C430] underline">Sign up here</Link></p>
              )}
            </motion.div>
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
          <button type="button" onClick={() => handleLogin(undefined, 'Google Account')} className="flex items-center justify-center gap-3 w-full py-3.5 bg-white text-black font-sans font-bold rounded-lg hover:bg-gray-200 transition-colors">
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
          New to the crew?{' '}
          <Link href="/signup" className="text-[#F4C430] hover:text-white transition-colors font-bold">
            Join the Fleet
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
