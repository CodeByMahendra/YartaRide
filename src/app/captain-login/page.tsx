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

    const inputCls = "w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold text-sm outline-none focus:bg-white focus:border-indigo-600 transition-all placeholder:text-slate-300";

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans overflow-x-hidden relative flex flex-col">

            {/* ── Premium Aesthetic Orbs ── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />
            </div>

            {/* ── Navbar ── */}
            <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 pt-8 sm:pt-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
                        <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                            Yatra<span className="text-indigo-600">Ride</span>
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Captain Node</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href="/login" className="px-6 py-3 bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-full border border-slate-100 shadow-xl shadow-black/5 transition-all">
                        User Login
                    </Link>
                </motion.div>
            </header>

            {/* ── Content ── */}
            <div className="relative z-10 flex flex-col lg:flex-row flex-1 items-center justify-center gap-12 lg:gap-24 px-6 sm:px-12 py-12 max-w-7xl mx-auto w-full">

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
                    <div className="bg-white rounded-[3.5rem] p-8 sm:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
                        
                        <StepDots step={step} />

                        <AnimatePresence mode="wait">
                            {step === 'phone' && (
                                <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Captain Access</h3>
                                    <p className="text-slate-400 text-sm mb-10">Deploy your details to initialized the session.</p>

                                    <form onSubmit={handleSendOtp} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Line</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none gap-4">
                                                    <span className="text-sm font-black text-slate-900">+91</span>
                                                    <div className="w-px h-5 bg-slate-100 group-focus-within:bg-indigo-600/20 transition-colors" />
                                                </div>
                                                <input
                                                    type="tel" required
                                                    value={phoneNumber}
                                                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    placeholder="98765 43210"
                                                    className={`${inputCls} pl-24`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Node</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                <input
                                                    type="email" required
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="captain@yatra.ride"
                                                    className={`${inputCls} pl-16`}
                                                />
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 mt-8"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Token <ArrowRight className="w-5 h-5" /></>}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'otp' && (
                                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <button onClick={() => setStep('phone')} className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase text-[9px] tracking-widest mb-8 transition-colors">
                                        <ChevronLeft className="w-4 h-4" /> Go Back
                                    </button>

                                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Validate</h3>
                                    <p className="text-slate-400 text-sm mb-10 italic">Verifying identity for secure access...</p>

                                    <form onSubmit={handleVerifyOtp} className="space-y-10">
                                        <OtpInput value={otp} onChange={setOtp} />
                                        
                                        <div className="space-y-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-100"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Access"}
                                            </motion.button>

                                            <div className="text-center">
                                                {timer > 0 ? (
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Resend Window: <span className="text-indigo-600">{timer}s</span></p>
                                                ) : (
                                                    <button type="button" onClick={handleSendOtp} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2">Broadcast New Code</button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'profile' && (
                                <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Finalize</h3>
                                    <p className="text-slate-400 text-sm mb-10">Register your unit in the central network.</p>

                                    <form onSubmit={handleCompleteProfile} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Callsign</label>
                                                <input type="text" required value={firstname} onChange={e => setFirstname(e.target.value)} placeholder="Rahul" className={inputCls} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Surname</label>
                                                <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} placeholder="Sharma" className={inputCls} />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Component</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['car', 'auto', 'moto'].map(v => (
                                                    <button
                                                        key={v} type="button"
                                                        onClick={() => setVehicleType(v)}
                                                        className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${vehicleType === v ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-100'}`}
                                                    >
                                                        {v === 'moto' ? 'Bike' : v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Node Plate</label>
                                                <input type="text" required value={plate} onChange={e => setPlate(e.target.value)} placeholder="MP09AB1234" className={`${inputCls} uppercase`} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Skin</label>
                                                <input type="text" required value={color} onChange={e => setColor(e.target.value)} placeholder="White" className={inputCls} />
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-slate-900 border-2 border-slate-900 hover:bg-transparent hover:text-slate-900 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] transition-all mt-6 shadow-2xl"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Initialize Partner"}
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
