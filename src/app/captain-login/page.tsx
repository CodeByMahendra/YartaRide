'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, Mail, ArrowRight, ShieldCheck,
    ChevronLeft, Loader2, CheckCircle2, User as UserIcon,
    Car, Hash, Palette, Star, Navigation, RefreshCw, Sparkles
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useCaptain } from '@/context/CaptainDataContext';

/* ── Step Indicator ─────────────────────────────────── */
const StepDots = ({ step }: { step: 'phone' | 'otp' | 'profile' }) => {
    const steps = ['phone', 'otp', 'profile'];
    const idx = steps.indexOf(step);
    return (
        <div className="flex items-center gap-2 mb-10">
            {steps.map((s, i) => (
                <motion.div
                    key={s}
                    animate={{ 
                        width: i === idx ? 32 : 8, 
                        backgroundColor: i === idx ? '#4f46e5' : i < idx ? '#818cf8' : '#e2e8f0' 
                    }}
                    className="h-2 rounded-full"
                    transition={{ duration: 0.4, ease: "circOut" }}
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

    return (
        <div className="flex gap-2 sm:gap-4 justify-center">
            {digits.map((d, i) => (
                <motion.input
                    key={i}
                    ref={el => { inputs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1}
                    value={d}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKey(i, e)}
                    whileFocus={{ scale: 1.05, borderColor: '#4f46e5' }}
                    className="w-11 h-14 sm:w-14 sm:h-18 text-center text-2xl font-black text-slate-900
                               bg-slate-50 border-2 border-slate-100 rounded-2xl
                               outline-none transition-all focus:bg-white focus:shadow-xl focus:shadow-indigo-100"
                />
            ))}
        </div>
    );
};

/* ── Main Page ───────────────────────────────────────── */
const CaptainLoginPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('male');
    const [vehicleType, setVehicleType] = useState('car');
    const [plate, setPlate] = useState('');
    const [color, setColor] = useState('');

    const router = useRouter();
    const { showToast } = useToast();
    const { setCaptain } = useCaptain();

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
            await axios.post('/api/auth/email-otp/send', { phone: phoneNumber, email, role: 'captain' });
            setStep('otp');
            setTimer(60);
            showToast('Authorization code sent via email!', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to send OTP', 'error');
        } finally { setIsLoading(false); }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) { showToast('Enter the 6-digit OTP', 'error'); return; }
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/email-otp/verify', { phone: phoneNumber, otp, role: 'captain' });
            const { token, captain, isProfileComplete } = res.data;
            localStorage.setItem('token', token);
            setCaptain(captain);
            if (isProfileComplete) {
                showToast(`Welcome back!`, 'success');
                router.push('/captain-home');
            } else {
                setStep('profile');
                showToast('Identity verified.', 'success');
            }
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Invalid OTP', 'error');
        } finally { setIsLoading(false); }
    };

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (firstname.length < 3) { showToast('Name is too short', 'error'); return; }
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/auth/complete-profile', {
                role: 'captain',
                fullname: { firstname, lastname },
                email, gender,
                vehicle: { color, plate: plate.toUpperCase(), vehicleType }
            }, { headers: { Authorization: `Bearer ${token}` } });
            setCaptain(res.data.captain);
            showToast('Captain profile activated!', 'success');
            router.push('/captain-home');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Activation failed', 'error');
        } finally { setIsLoading(false); }
    };

    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm outline-none focus:bg-white focus:border-indigo-600 transition-all placeholder:text-slate-300";

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans overflow-x-hidden relative flex flex-col">

            {/* ── Premium Aesthetic Orbs ── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />
            </div>

            {/* ── Navbar ── */}
            <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:py-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Navigation className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                            Yatra<span className="text-indigo-600">Ride</span>
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Captain</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href="/login" className="px-4 py-2 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 rounded-full border border-slate-200 shadow-sm transition-all">
                        User Login
                    </Link>
                </motion.div>
            </header>

            {/* ── Content ── */}
            <div className="relative z-10 flex flex-col lg:flex-row flex-1 items-center justify-center gap-8 lg:gap-24 px-4 sm:px-8 py-4 max-w-7xl mx-auto w-full">

                {/* Left - Hero Text */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:flex flex-col gap-12 flex-1 max-w-lg"
                >
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={step} 
                            initial={{ opacity: 0, y: 30 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -30 }}
                        >
                            <span className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                {step === 'phone' ? 'Fleet Onboarding' : step === 'otp' ? 'Security Gate' : 'Unit Registration'}
                            </span>
                            <h1 className="text-7xl font-black text-slate-900 tracking-tighter mt-8 leading-[0.9]">
                                {step === 'phone' ? <>COMMAND<br /><span className="text-indigo-600 italic">THE ROAD.</span></> : 
                                 step === 'otp' ? <>ACCESS<br /><span className="text-indigo-600 italic">GRANTED.</span></> : 
                                 <>ACTIVATE<br /><span className="text-indigo-600 italic">PARTNER.</span></>}
                            </h1>
                            <p className="text-slate-400 text-lg mt-8 leading-relaxed max-w-md border-l-4 border-indigo-600/10 pl-8">
                                {step === 'phone' ? "Join the elite captain network. Manage your fleet, track earnings, and drive on your schedule." :
                                 step === 'otp' ? `We've dispatched a security token to ${email}. Authenticate to proceed.` :
                                 "Just one more step to join the fleet. Register your vehicle to start accepting mission requests."}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { l: 'avg earnings', v: '₹45k+', c: 'indigo' },
                            { l: 'active nodes', v: '25k+', c: 'blue' },
                            { l: 'coverage', v: '120+', c: 'indigo' },
                            { l: 'total jobs', v: '5M+', c: 'slate' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-black/[0.02]">
                                <h4 className={`text-2xl font-black text-${s.c}-600 tracking-tighter`}>{s.v}</h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right - Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md lg:max-w-md"
                >
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                        
                        <StepDots step={step} />

                        <AnimatePresence mode="wait">
                            {step === 'phone' && (
                                <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Captain Login</h3>
                                    <p className="text-slate-400 text-sm mb-6">Enter your phone & email to continue.</p>

                                    <form onSubmit={handleSendOtp} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 ml-1">Mobile Number</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none gap-2">
                                                    <span className="text-sm font-semibold text-slate-600">+91</span>
                                                    <div className="w-px h-5 bg-slate-200" />
                                                </div>
                                                <input
                                                    type="tel" required
                                                    value={phoneNumber}
                                                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    placeholder="98765 43210"
                                                    className={`${inputCls} pl-20`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="email" required
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="captain@yatrade.in"
                                                    className={`${inputCls} pl-10`}
                                                />
                                            </div>
                                        </div>

                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-100 transition-all"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'otp' && (
                                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <button onClick={() => setStep('phone')} className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase text-[9px] tracking-widest mb-8 transition-colors">
                                        <ChevronLeft className="w-4 h-4" /> Go Back
                                    </button>

                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Verify OTP</h3>
                                    <p className="text-slate-400 text-sm mb-6 italic">Check your email for the code.</p>

                                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                                        <OtpInput value={otp} onChange={setOtp} />
                                        
                                        <div className="space-y-3">
                                            <motion.button
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-100"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                                            </motion.button>

                                            <div className="text-center">
                                                {timer > 0 ? (
                                                    <p className="text-xs font-semibold text-slate-400">Resend in <span className="text-indigo-600">{timer}s</span></p>
                                                ) : (
                                                    <button type="button" onClick={handleSendOtp} className="text-xs font-semibold text-indigo-600 hover:underline">Resend OTP</button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'profile' && (
                                <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Setup Profile</h3>
                                    <p className="text-slate-400 text-sm mb-6">Add your vehicle details to get started.</p>

                                    <form onSubmit={handleCompleteProfile} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 ml-1">First Name</label>
                                                <input type="text" required value={firstname} onChange={e => setFirstname(e.target.value)} placeholder="Rahul" className={inputCls} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 ml-1">Last Name</label>
                                                <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} placeholder="Sharma" className={inputCls} />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 ml-1">Vehicle Type</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['car', 'auto', 'moto'].map(v => (
                                                    <button
                                                        key={v} type="button"
                                                        onClick={() => setVehicleType(v)}
                                                        className={`py-2.5 rounded-xl font-semibold text-xs capitalize transition-all border ${vehicleType === v ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                                                    >
                                                        {v === 'moto' ? 'Bike' : v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 ml-1">Number Plate</label>
                                                <input type="text" required value={plate} onChange={e => setPlate(e.target.value)} placeholder="MP09AB1234" className={`${inputCls} uppercase`} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 ml-1">Vehicle Color</label>
                                                <input type="text" required value={color} onChange={e => setColor(e.target.value)} placeholder="White" className={inputCls} />
                                            </div>
                                        </div>

                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm transition-all mt-2 shadow-lg"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Activate Account"}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="text-center mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        Standard Access? <Link href="/login" className="text-indigo-600 hover:underline">User Login Node →</Link>
                    </p>
                </motion.div>
            </div>

            <footer className="relative z-10 text-center pb-12 text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
                © 2026 YatraRide · Integrated Captain Core
            </footer>
        </div>
    );
};

export default CaptainLoginPage;
