'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, User, ShieldCheck,
    Globe, Database, HardDrive,
    LockKeyhole, Fingerprint, Loader2
} from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Logic for admin login (usually different route or header)
            const response = await axios.post('/api/admin/login', { email, password });
            if (response.status === 200) {
                localStorage.setItem('adminToken', response.data.token);
                router.push('/admin-dashboard');
            }
        } catch (err: any) {
            setError('System Access Denied. Elevated privileges required.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-950 font-sans overflow-hidden items-center justify-center p-4 md:p-8">

            {/* Ambient Background Elements for Admin (Dark/Indigo theme) */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-5xl flex flex-col lg:flex-row bg-slate-900/50 backdrop-blur-3xl border border-indigo-500/20 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl shadow-black/50 z-10"
            >
                {/* Left Side - Visual Narrative */}
                <div className="hidden lg:flex lg:w-1/2 p-20 flex-col justify-between border-r border-indigo-500/10 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/20">
                    <div>
                        <div className="mb-12">
                            <h1 className="text-4xl font-black tracking-tight">
                                <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                                    Yatra
                                </span>
                                <span className="text-white">
                                    Ride
                                </span>
                            </h1>
                        </div>
                        <h1 className="text-6xl font-black text-white leading-tight mb-8 tracking-tighter">
                            System<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">Control.</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            Access the Command Center. Manage users, monitor fleet, and oversee system operations with absolute transparency.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Database, label: "Core Data" },
                            { icon: ShieldCheck, label: "Secure Link" },
                        ].map((it, idx) => (
                            <div key={idx} className="bg-slate-800/50 border border-indigo-500/10 p-6 rounded-[2rem] flex items-center gap-4">
                                <it.icon className="w-6 h-6 text-indigo-400" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">{it.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-20 flex items-center justify-center bg-slate-900/30">
                    <div className="w-full max-w-sm">
                        <div className="mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/20">
                                <LockKeyhole className="w-3 h-3" /> System Administrator
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">Authorize.</h2>
                            <p className="text-slate-500 font-medium">Please verify your identity to proceed to the dashboard.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="mb-8"
                                >
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                                        <Fingerprint className="w-5 h-5" />
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Identity</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email" required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-14 pr-6 py-5 bg-slate-950/50 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-950 rounded-3xl text-white font-bold transition-all outline-none placeholder:text-slate-700"
                                        placeholder="admin@yatraride.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Override Code</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                                        <HardDrive className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password" required value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-14 pr-6 py-5 bg-slate-950/50 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-950 rounded-3xl text-white font-bold transition-all outline-none placeholder:text-slate-700"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full group relative bg-indigo-600 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-70 overflow-hidden"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 uppercase tracking-widest">Execute Authorization</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center text-slate-600 text-sm font-medium">
                            <p>© 2026 YatraRide Secure Infrastructure</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
