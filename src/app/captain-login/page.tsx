'use client';
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Car, Zap, ShieldCheck, Trophy, BadgeCheck } from 'lucide-react';

const CaptainLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { setCaptain } = useContext(CaptainDataContext);
    const router = useRouter();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/captain/login', { email, password });
            if (response.status === 200) {
                const data = response.data;
                setCaptain(data.captain);
                localStorage.setItem('token', data.token);
                router.push('/captain-home');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your captain credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white font-sans overflow-hidden">

            {/* Left Section - Professional Narrative */}
            <div className="hidden lg:flex lg:w-[55%] relative bg-[#050505] items-center justify-center p-16 overflow-hidden">
                {/* Emerald/Neon Lights for Captain Theme */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/10 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px]"></div>

                <div className="relative z-10 w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl shadow-2xl">
                                <img src="/images/logo.png" alt="YatraRide" className="w-32 brightness-0 invert" />
                            </div>
                            <div className="px-3 py-1 rounded-full border border-emerald-500/30 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/5">Captain Elite</div>
                        </div>

                        <h2 className="text-7xl font-black text-white leading-[1.1] tracking-tighter mb-10">
                            Command Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-teal-400">Earnings & Freedom.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-8 mt-16">
                        {[
                            { icon: BadgeCheck, title: "Verified Partner", desc: "Access the highest-rated commuters in the region." },
                            { icon: Trophy, title: "Peak Rewards", desc: "Earn up to 25% more during high-demand hours." },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="group relative bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl hover:bg-white/10 transition-all cursor-default"
                            >
                                <item.icon className="w-10 h-10 text-emerald-400 mb-6" />
                                <h4 className="text-white font-black text-xl mb-2">{item.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats Mock */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-20 border-t border-white/5 pt-10"
                    >
                        <div className="flex gap-16">
                            <div>
                                <h3 className="text-3xl font-black text-white italic tracking-tighter">₹45k+</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Avg. Monthly Earnings</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white italic tracking-tighter">12k+</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Active Captains</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-20 relative bg-emerald-50/10">

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg"
                >
                    <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-[0_40px_100px_-20px_rgba(16,185,129,0.1)] border border-slate-100 relative overflow-hidden">

                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>

                        <div className="relative mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                Captain Secure Entry
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Captain Login.</h1>
                            <p className="text-slate-500 font-medium">Drive into your next professional milestone.</p>
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
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="space-y-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email" required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300"
                                        placeholder="captain@yatra.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Captain Key</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password" required value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full group relative bg-emerald-600 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-2xl shadow-emerald-100 disabled:opacity-70 overflow-hidden"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="relative z-10 uppercase tracking-widest">Identify & Enter</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-slate-500 font-bold text-sm">
                                Not a partner yet?{' '}
                                <Link href="/captain-signup" className="text-emerald-600 font-black hover:underline underline-offset-4">Register Vehicle</Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to User Toggle */}
                    <div className="mt-12 flex justify-center">
                        <Link href='/login' className="group flex items-center gap-4 bg-white px-8 py-5 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">User Portal</h4>
                                <p className="text-[10px] text-slate-400 font-bold">Standard ride booking</p>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CaptainLogin;
