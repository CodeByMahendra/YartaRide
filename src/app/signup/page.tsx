'use client';
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { UserDataContext } from '@/context/UserDataContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Lock, ArrowRight, ShieldCheck,
    ArrowLeft, Fingerprint, MapPin, Sparkles, Loader2
} from 'lucide-react';

const UserSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { setUser } = useContext(UserDataContext);
    const router = useRouter();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const newUser = {
                fullname: { firstname: firstName, lastname: lastName },
                email,
                password
            };

            const response = await axios.post('/api/user/register', newUser);
            if (response.status === 201) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token', data.token);
                router.push('/home');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#0a0a0b] font-sans overflow-x-hidden">

            {/* Left Narrative Section - Luxury Identity */}
            <div className="hidden lg:flex lg:w-[40%] relative items-center justify-center p-20 overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[100%] h-[100%] bg-indigo-600/10 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-yellow-500/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 w-full max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 inline-flex items-center gap-4 rounded-[2.5rem] mb-12 shadow-2xl">
                            <img src="/images/logo.png" alt="YatraRide" className="w-32 opacity-90" />
                            <div className="h-4 w-[1px] bg-white/20"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">JOIN</span>
                        </div>

                        <h2 className="text-7xl font-black text-white leading-[1.05] tracking-tighter mb-10 italic">
                            START<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-white">SHAPING.</span>
                        </h2>

                        <p className="text-white/40 text-lg font-medium leading-relaxed mb-16 px-1 border-l-2 border-indigo-600/30">
                            Elite mobility awaits. Join a community that values time, safety, and legendary experiences.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: Sparkles, text: "Priority Ride Allocation" },
                                { icon: ShieldCheck, text: "End-to-End Encryption" },
                                { icon: Fingerprint, text: "Biometric Verification" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-5 group cursor-default">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-white/60 font-bold tracking-wide group-hover:text-white transition-colors">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Registration Form */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-8 md:p-16 bg-slate-50/10 overflow-y-auto no-scrollbar relative">

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl py-12"
                >
                    <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-slate-200/60 relative overflow-hidden">

                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>

                        <div className="mb-16 flex justify-between items-start relative z-10">
                            <div>
                                <Link href="/login" className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-6 group">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Entrance
                                </Link>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Membership.</h1>
                                <p className="text-slate-500 font-medium">Verify your details to gain access to the platform.</p>
                            </div>
                            <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-inner">
                                <User className="w-10 h-10" />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-10 overflow-hidden"
                                >
                                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl text-sm font-bold flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">First Designation</label>
                                    <input
                                        type="text" required value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="block w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[2rem] text-slate-900 font-bold transition-all outline-none shadow-sm"
                                        placeholder="E.g. Alexander"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Family Name</label>
                                    <input
                                        type="text" required value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="block w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[2rem] text-slate-900 font-bold transition-all outline-none shadow-sm"
                                        placeholder="E.g. Hamilton"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Digital Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <input
                                        type="email" required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-20 pr-8 py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[2rem] text-slate-900 font-bold transition-all outline-none shadow-sm"
                                        placeholder="yourname@premium.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Passkey</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <input
                                        type="password" required value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-20 pr-8 py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[2rem] text-slate-900 font-bold transition-all outline-none shadow-sm"
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex items-start gap-6 shadow-2xl">
                                <div className="bg-indigo-600 p-2 rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                    By submitting this application, you agree to our <span className="text-white underline cursor-pointer">Charter of Rights</span> and <span className="text-indigo-400 underline cursor-pointer">Privacy Sovereignty</span>.
                                </p>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full group relative bg-indigo-600 text-white rounded-[2.5rem] py-7 font-black flex items-center justify-center gap-4 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] overflow-hidden"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 uppercase tracking-[0.2em]">Initiate Membership</span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserSignup;

