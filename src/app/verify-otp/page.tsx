'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OTPInput } from '@/components/auth';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

function VerifyOTPForm() {
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [devOtp, setDevOtp] = useState('');

  useEffect(() => {
    if (timer <= 0) { setResendDisabled(false); return; }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleVerify = async () => {
    if (otp.length !== 6) { setError('Please enter the complete 6-digit OTP'); return; }
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      setAuth(data.user, data.accessToken);
      setSuccess('Email verified! Redirecting...');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-otp/resend', { email });
      setOtp('');
      setTimer(300);
      setResendDisabled(true);
      if (data.devOtp) setDevOtp(data.devOtp);
      setSuccess('New OTP sent!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const otpFromUrl = params.get('devOtp');
    if (otpFromUrl) setDevOtp(otpFromUrl);
  }, []);

  if (!email) {
    return (
      <div className="text-center text-white/50 space-y-4">
        <ShieldAlert className="w-12 h-12 mx-auto" />
        <p className="font-bebas text-xl tracking-widest">No email provided</p>
        <Link href="/signup" className="block text-[#F4C430] hover:underline text-sm">Back to Sign Up</Link>
      </div>
    );
  }

  return (
    <>
      {devOtp && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
          <p className="text-yellow-400 text-xs font-mono tracking-widest">DEV MODE — OTP: {devOtp}</p>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20 mb-4">
          <Mail className="w-8 h-8 text-purple-500" />
        </div>
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <p className="text-orange-400 text-xs font-sans tracking-wide">
            ⚠️ Didn't receive the code? Check your <strong>Spam</strong> or <strong>Promotions</strong> folder and mark as "Not Spam" for faster delivery next time.
          </p>
        </div>
        <h1 className="font-bangers text-4xl tracking-wider text-white mb-2">VERIFY EMAIL</h1>
        <p className="text-neutral-400 text-sm">
          Enter the 6-digit code sent to<br />
          <span className="text-white font-medium">{email}</span>
        </p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm text-center">
          {success}
        </motion.div>
      )}

      <div className="space-y-8">
        <OTPInput value={otp} onChange={setOtp} disabled={isLoading} />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-neutral-400">
            <Clock className="w-4 h-4" />
            <span className={timer <= 30 ? 'text-red-500' : ''}>{formatTime(timer)}</span>
          </div>
          <button
            onClick={handleResend}
            disabled={resendDisabled || isResending}
            className="text-[#F4C430] hover:underline disabled:text-neutral-600 disabled:no-underline disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Resend Code'}
          </button>
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading || otp.length !== 6}
          className="w-full py-3.5 bg-[#F4C430] text-black hover:bg-[#ffe066] rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(244,196,48,0.3)]"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'VERIFY & CONTINUE'}
        </button>
      </div>

      <div className="mt-8 text-center">
        <Link href="/login" className="text-neutral-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>
      </div>
    </>
  );
}

export default function VerifyOTPPage() {
  return (
    <main className="min-h-screen bg-[#020104] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-[#020104] to-[#020104] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>}>
            <VerifyOTPForm />
          </Suspense>
        </div>
      </motion.div>
    </main>
  );
}
