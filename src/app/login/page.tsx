'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, ArrowRight, ShieldCheck,
  ChevronLeft, Loader2, CheckCircle2, User as UserIcon,
  Sparkles, Star, Navigation, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserDataContext';

/* ── Step Indicator ─────────────────────────────────── */
const StepDots = ({ step }: { step: 'phone' | 'otp' | 'profile' }) => {
  const steps = ['phone', 'otp', 'profile'];
  const idx = steps.indexOf(step);
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          animate={{ width: i === idx ? 28 : 8, backgroundColor: i <= idx ? '#4f46e5' : '#e2e8f0' }}
          className="h-2 rounded-full"
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
};

/* ── OTP Input Boxes ─────────────────────────────────── */
const OtpInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const next = digits.map((d, idx) => (idx === i ? '' : d)).join('');
      onChange(next);
      if (i > 0) inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, v: string) => {
    const char = v.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, idx) => (idx === i ? char : d)).join('');
    onChange(next.trim());
    if (char && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const last = Math.min(pasted.length, 5);
    inputs.current[last]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <motion.input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          whileFocus={{ scale: 1.05, borderColor: '#4f46e5' }}
          className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-black text-slate-900 
                               bg-slate-50 border-2 border-slate-200 rounded-2xl 
                               outline-none transition-all focus:ring-4 focus:ring-indigo-50 
                               caret-indigo-600 no-tap-highlight shadow-inner"
        />
      ))}
    </div>
  );
};

/* ── Main Page ───────────────────────────────────────── */
const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [gender, setGender] = useState('male');
  const [referredByCode, setReferredByCode] = useState('');

  const router = useRouter();
  const { showToast } = useToast();
  const { setUser } = useUser();

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) { showToast('Valid 10-digit phone required', 'error'); return; }
    if (!email.includes('@')) { showToast('Valid email address required', 'error'); return; }
    setIsLoading(true);
    try {
      await axios.post('/api/auth/email-otp/send', { phone: phoneNumber, email, role: 'user' });
      setStep('otp');
      setTimer(60);
      showToast('OTP sent to your email!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to send OTP', 'error');
    } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { showToast('Enter the 6-digit OTP', 'error'); return; }
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/email-otp/verify', { phone: phoneNumber, otp, role: 'user' });
      const { token, user, isProfileComplete } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      if (isProfileComplete) {
        showToast(`Welcome back, ${user.fullname?.firstname}!`, 'success');
        router.push('/home');
      } else {
        setStep('profile');
        showToast('Verified! Complete your profile.', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid OTP', 'error');
    } finally { setIsLoading(false); }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (firstname.length < 3) { showToast('First name must be ≥ 3 characters', 'error'); return; }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/auth/complete-profile', {
        role: 'user', fullname: { firstname, lastname }, email, gender, referredByCode
      }, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data.user);
      showToast('Profile complete! Welcome aboard 🎉', 'success');
      router.push('/home');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Profile update failed', 'error');
    } finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400 no-tap-highlight shadow-inner";

  return (
    <div className="min-h-dvh w-full bg-slate-50 font-sans overflow-x-hidden relative flex flex-col selection:bg-indigo-100 selection:text-indigo-900">

      {/* ── Soft Ambient Orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-32 w-72 h-72 bg-violet-200/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 right-1/3 w-64 h-64 bg-emerald-100/40 rounded-full blur-[90px]" />
      </div>

      {/* ── Top Bar ── */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-12 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Yatra<span className="text-indigo-600">Ride</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/captain-login"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-all border-2 border-slate-100 bg-white px-6 py-3 rounded-full shadow-sm"
          >
            Captain Login
          </Link>
        </motion.div>
      </header>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 items-center justify-center gap-12 lg:gap-24 px-5 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">

        {/* Left – Brand Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:flex flex-col gap-10 flex-1 max-w-xl"
        >
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div key="p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">User Link-up</p>
                <h2 className="text-7xl font-black text-slate-900 leading-[0.88] tracking-tighter mb-8 italic">
                  YOUR NEXT<br />
                  <span className="text-indigo-600">MISSION</span><br />
                  BEGINS.
                </h2>
                <p className="text-slate-500 text-lg font-bold leading-relaxed border-l-4 border-indigo-600 pl-8">
                  Authenticate via encrypted email protocol — seamless, rapid, and industry-grade security.
                </p>
              </motion.div>
            )}
            {step === 'otp' && (
              <motion.div key="o" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">Verification</p>
                <h2 className="text-7xl font-black text-slate-900 leading-[0.88] tracking-tighter mb-8 italic">
                  CHECK<br />
                  <span className="text-emerald-500 text-6xl">INBOX</span><br />
                  NOW.
                </h2>
                <p className="text-slate-500 text-lg font-bold leading-relaxed border-l-4 border-emerald-600 pl-8">
                  Transmission sent to <span className="text-slate-900 font-black">{email}</span>. Valid for 10 minutes.
                </p>
              </motion.div>
            )}
            {step === 'profile' && (
              <motion.div key="pr" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-amber-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">Data Sync</p>
                <h2 className="text-7xl font-black text-slate-900 leading-[0.88] tracking-tighter mb-8 italic">
                  CREATE<br />
                  <span className="text-amber-500">PROFILE</span><br />
                  IDENT.
                </h2>
                <p className="text-slate-500 text-lg font-bold leading-relaxed border-l-4 border-amber-600 pl-8">
                  Initialize your personal node parameters to synchronize with the fleet.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, label: 'Secure Encryption', color: 'text-indigo-600' },
              { icon: Star, label: 'Premium Fleet', color: 'text-amber-500' },
              { icon: Sparkles, label: 'Verified Matrix', color: 'text-emerald-500' },
              { icon: CheckCircle2, label: 'SOS Protocol', color: 'text-rose-500' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="bg-white rounded-[2rem] p-6 flex items-center gap-4 shadow-xl shadow-indigo-100/20 border border-slate-50">
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center`}>
                   <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right – Interactive Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-white">

            <StepDots step={step} />

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Entrance ── */}
              {step === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-10">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Entrance.</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Initialize your secure passenger link.</p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mobile Access</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none gap-3">
                          <span className="text-sm font-black text-slate-400">+91</span>
                          <div className="w-[1.5px] h-4 bg-slate-200" />
                          <Phone className="w-4 h-4 text-slate-300" />
                        </div>
                        <input
                          type="tel" required disabled={isLoading}
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98765 43210"
                          className={`${inputCls} pl-24`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Node</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <input
                          type="email" required disabled={isLoading}
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@matrix.io"
                          className={`${inputCls} pl-14`}
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading || phoneNumber.length < 10 || !email.includes('@')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-white py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-4 shadow-2xl shadow-indigo-100 transition-all no-tap-highlight"
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <span className="uppercase tracking-[0.2em] text-xs">Request Access Key</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest pt-2">
                      By accessing, you accept the <span className="text-indigo-600 cursor-pointer">Protocol Terms</span>.
                    </p>
                  </form>
                </motion.div>
              )}

              {/* ── STEP 2: Auth ── */}
              {step === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    onClick={() => setStep('phone')}
                    className="mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Roll Back</span>
                  </button>

                  <div className="mb-10">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Authorize.</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                       Key sent to <span className="text-emerald-500">{email}</span>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-10">
                    <OtpInput value={otp} onChange={setOtp} />

                    <motion.button
                      type="submit"
                      disabled={isLoading || otp.length < 6}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-4 shadow-2xl shadow-emerald-100 transition-all"
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <span className="uppercase tracking-[0.2em] text-xs">Confirm Identity</span>
                          <CheckCircle2 className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>

                    <div className="text-center">
                      {timer > 0 ? (
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          Refresh key in <span className="text-indigo-600">{timer}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-[10px] text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-[0.3em] flex items-center gap-3 mx-auto transition-all"
                        >
                          <RefreshCw className="w-4 h-4" /> Resend Transmission
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── STEP 3: Ident ── */}
              {step === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-10">
                    <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center mb-6 border border-amber-100">
                      <Sparkles className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Establish.</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Define your node parameters.</p>
                  </div>

                  <form onSubmit={handleCompleteProfile} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">First Code</label>
                        <div className="relative">
                          <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                          <input
                            type="text" required
                            value={firstname}
                            onChange={e => setFirstname(e.target.value)}
                            placeholder="Rahul"
                            className={`${inputCls} pl-12`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Last Code</label>
                        <input
                          type="text"
                          value={lastname}
                          onChange={e => setLastname(e.target.value)}
                          placeholder="Sharma"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Gender Node</label>
                      <div className="flex gap-3">
                        {['male', 'female', 'others'].map(g => (
                          <motion.button
                            key={g} type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setGender(g)}
                            className={`flex-1 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all border-2 ${gender === g
                                ? 'bg-amber-600 border-amber-600 text-white shadow-xl shadow-amber-100'
                                : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-100'
                              }`}
                          >
                            {g}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Uplink Code (Opt)</label>
                      <div className="relative">
                        <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300 pointer-events-none" />
                        <input
                          type="text"
                          value={referredByCode}
                          onChange={e => setReferredByCode(e.target.value.toUpperCase())}
                          placeholder="SYNC-CODE"
                          className={`${inputCls} pl-14 uppercase`}
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none text-white py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-4 shadow-2xl shadow-amber-100 transition-all"
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <span className="uppercase tracking-[0.2em] text-xs">Initialize Link</span>
                          <Star className="w-5 h-5 fill-current" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            Drive with the fleet?{' '}
            <Link href="/captain-login" className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Apply Membership →
            </Link>
          </motion.p>
        </motion.div>
      </div>

      <div className="relative z-10 text-center pb-10 text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
        © 2026 YatraRide · Encrypted Core
      </div>
    </div>
  );
};

export default LoginPage;
