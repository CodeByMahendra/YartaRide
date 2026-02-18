'use client';
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { UserDataContext } from '@/context/UserDataContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Car, Zap, ShieldCheck, Globe, Star, Phone, X, ShieldAlert } from 'lucide-react';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showMobileLogin, setShowMobileLogin] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const { setUser } = useContext(UserDataContext);
    const router = useRouter();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/user/login', { email, password });
            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token', data.token);
                router.push('/home');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white font-sans overflow-x-hidden">

            {/* Left Narrative Section */}
            <div className="hidden lg:flex lg:w-[55%] relative bg-slate-900 items-center justify-center p-16 overflow-hidden">
                {/* Mesh Gradient / Ambient Lights */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px]"></div>

                <div className="relative z-10 w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <h1 className="text-4xl font-black tracking-tight">
                                <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                                    Yatra
                                </span>
                                <span className="text-white">
                                    Ride
                                </span>
                            </h1>
                            <div className="px-3 py-1 rounded-full border border-white/20 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Authentic</div>
                        </div>

                        <h2 className="text-7xl font-black text-white leading-[1.1] tracking-tighter mb-10">
                            The Future of<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">Personal Mobility.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-8 mt-16">
                        {[
                            { icon: Zap, title: "Nano-Speed", desc: "Rides arriving in under 4 minutes, guaranteed." },
                            { icon: ShieldCheck, title: "Elite Privacy", desc: "Encrypted journeys and verified captains." },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="group relative bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl hover:bg-white/10 transition-all cursor-default"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all rounded-[2.5rem]"></div>
                                <item.icon className="w-10 h-10 text-indigo-400 mb-6" />
                                <h4 className="text-white font-black text-xl mb-2">{item.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-20 flex items-center gap-12"
                    >
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-gray-800 overflow-hidden shadow-2xl">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-400 text-sm font-bold">Trusted by <span className="text-white">500,000+</span> daily commuters across India.</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-4 md:p-12 relative bg-slate-50/50 overflow-y-auto no-scrollbar">

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg"
                >
                    <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden">

                        {/* Decorative background element for form */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <div className="relative mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                Personal Secure Portal
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Sign in.</h1>
                            <p className="text-slate-500 font-medium">Continue your legendary journey with us.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="mb-8"
                                >
                                    <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="space-y-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Identifier</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email" required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-3xl text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300 shadow-sm shadow-black/5"
                                        placeholder="yourname@domain.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password" required value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-3xl text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300 shadow-sm shadow-black/5"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm font-bold">
                                <label className="flex items-center gap-3 cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors group">
                                    <div className="relative w-5 h-5">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-full h-full border-2 border-slate-200 rounded-lg group-hover:border-indigo-200 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all"></div>
                                        <Zap className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    Stay signed in
                                </label>
                                <Link href="#" className="text-indigo-600 hover:underline">Reset Account?</Link>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full group relative bg-slate-900 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:bg-black active:scale-[0.98] transition-all shadow-2xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 uppercase tracking-widest">Authorize Access</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </>
                                )}
                            </button>
                        </form>


                        <div className="mt-10 flex items-center gap-4 text-slate-200">
                            <div className="h-px bg-slate-100 flex-1"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Identity Methods</span>
                            <div className="h-px bg-slate-100 flex-1"></div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 py-5 bg-white border-2 border-slate-100 rounded-3xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                                <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-5 h-5" /> Google
                            </button>
                            <button
                                onClick={() => setShowMobileLogin(true)}
                                className="flex items-center justify-center gap-3 py-5 bg-white border-2 border-slate-100 rounded-3xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <Phone className="w-5 h-5 text-indigo-600" /> Phone
                            </button>
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-slate-500 font-bold text-sm">
                                Not part of the ecosystem?{' '}
                                <Link href="/signup" className="text-indigo-600 font-black hover:underline underline-offset-4">Join Now</Link>
                            </p>
                        </div>
                    </div>

                    {/* Mobile OTP Modal (Fake Simulation) */}
                    <AnimatePresence>
                        {showMobileLogin && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-8"
                            >
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                    className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 max-w-md w-full shadow-2xl relative"
                                >
                                    <button onClick={() => setShowMobileLogin(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X className="w-6 h-6" /></button>

                                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8">
                                        <Phone className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Phone Identity.</h2>
                                    <p className="text-slate-500 font-medium mb-10 text-sm">We'll send a legendary 4-digit code to your mobile.</p>

                                    {!otpSent ? (
                                        <div className="space-y-6">
                                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                                                <span className="font-black text-slate-400">+91</span>
                                                <input type="tel" placeholder="Mobile Number" className="bg-transparent font-black tracking-widest outline-none w-full" />
                                            </div>
                                            <button
                                                onClick={() => setOtpSent(true)}
                                                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                                            >
                                                Send OTP <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 text-center">
                                            <div className="flex justify-center gap-4 mb-8">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <input key={i} type="text" maxLength={1} className="w-16 h-16 bg-slate-50 border-2 border-indigo-600 rounded-2xl text-center text-2xl font-black" />
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => router.push('/home')}
                                                className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-200"
                                            >
                                                Verify & Login <ShieldCheck className="w-5 h-5" />
                                            </button>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600">Resend Code</p>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quick Profile Toggle */}
                    <div className="mt-12 flex justify-between gap-4">
                        <Link href='/captain-login' className="flex-1 group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4">
                                <Car className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-slate-900 text-sm">Captain Login</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Driving Partner</p>
                        </Link>
                        <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm opacity-50 grayscale">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-slate-900 text-sm">Admin Panel</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">System Control</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Simple Loader Component
const Loader2 = ({ className }: { className?: string }) => (
    <div className={className}>
        <div className="w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export default UserLogin;
