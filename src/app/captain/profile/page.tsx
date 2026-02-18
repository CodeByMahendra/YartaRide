'use client';
import React, { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, Calendar, Clock, Shield, LogOut, ArrowLeft,
    Edit3, Wallet, Star, TrendingUp, ChevronRight, CreditCard,
    Bell, Navigation, CheckCircle2, Award, Briefcase, Settings
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CaptainProfilePage() {
    const { captain } = useContext(CaptainDataContext);
    const [stats, setStats] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/captain/stats', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data.stats) setStats(res.data.stats);
            }).catch(err => console.error("Stats fetch failed:", err));
        }
    }, []);

    if (!captain) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] text-center max-w-md w-full shadow-2xl shadow-black/60"
                >
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500 border border-indigo-500/20">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Restricted Access</h2>
                    <p className="text-slate-400 mb-8 font-medium">Please sign in as a captain to access your flight deck and records.</p>
                    <button
                        onClick={() => router.push('/captain-login')}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                    >
                        Captain Login
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">

            {/* Mission Control Header */}
            <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-indigo-500/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
                    <button
                        onClick={() => router.push('/captain-home')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" /> Exit Deck
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Duty</span>
                        </div>
                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Rank & Info Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-indigo-500/20 relative overflow-hidden shadow-2xl shadow-black/40"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-[2rem] bg-slate-800 border-4 border-slate-900 shadow-2xl overflow-hidden flex items-center justify-center">
                                        {captain.profileImage ? (
                                            <img
                                                src={captain.profileImage}
                                                alt="Captain"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-16 h-16 text-slate-600" />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-slate-900 flex items-center justify-center text-white shadow-xl">
                                        <Award className="w-5 h-5" />
                                    </div>
                                </div>

                                <h1 className="text-3xl font-black text-white tracking-tighter mb-1">
                                    {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                                </h1>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-8">
                                    <Star className="w-3 h-3 fill-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                                        Level {stats?.pilotLevel || 1} Pilot • {stats?.rating || captain.rating || '0.00'} Rating
                                    </span>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Vehicle Role</p>
                                            <p className="text-sm font-bold text-slate-200">Elite {captain?.vehicle?.vehicleType?.toUpperCase() || 'LUXE'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Enlisted Since</p>
                                            <p className="text-sm font-bold text-slate-200">
                                                {stats?.joinedDate ? new Date(stats.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Joining...'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700">
                                    Internal Settings
                                </button>
                            </div>
                        </motion.div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-3 border border-indigo-500/10 shadow-xl shadow-black/20">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    router.push('/captain-login');
                                }}
                                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all group"
                            >
                                <span className="flex items-center gap-4 font-black text-xs uppercase tracking-widest">
                                    <LogOut className="w-5 h-5" /> Terminal Exit
                                </span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                        </div>
                    </div>

                    {/* Right Mission Logs & Analytics */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Fleet Earnings Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mb-20 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 mb-4">
                                        <Wallet className="w-3 h-3 text-indigo-200" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Revenue Stream</span>
                                    </div>
                                    <p className="text-indigo-200/80 text-xs font-bold uppercase tracking-widest mb-1">Total Fleet Earnings</p>
                                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">₹{stats?.totalEarnings?.toLocaleString() || '0'}.00</h2>
                                </div>
                                <div className="space-y-3 w-full md:w-auto">
                                    <button className="w-full px-8 py-4 bg-white text-indigo-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all active:scale-95">
                                        Withdraw Credits
                                    </button>
                                    <p className="text-[10px] text-center text-indigo-200 font-bold uppercase tracking-widest opacity-60">Payouts sync every 24h</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Performance Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Successful Trips', value: stats?.ridesCount || '0', icon: Navigation, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                                { label: 'System Uptime', value: stats?.hoursOnline + 'h' || '0h', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                { label: 'Service Score', value: stats?.score || '0%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/30 transition-all shadow-xl group"
                                >
                                    <div className={`w-14 h-14 rounded-3xl ${stat.bg} flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform`}>
                                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                                    </div>
                                    <p className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1 italic">{stat.value}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Analytics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-800 shadow-2xl shadow-black/40"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                        <CheckCircle2 className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tighter">Duty Log</h3>
                                        <p className="text-sm text-slate-500 font-bold">Recent performance metrics and milestones</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Details</button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { msg: 'System integrity check passed', status: 'verified', time: '12m ago' },
                                    { msg: 'Weekly performance bonus unlocked', status: 'bonus', time: '4h ago' },
                                    { msg: 'Identity verification updated', status: 'system', time: '2d ago' }
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800/50 hover:bg-slate-900 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                            <span className="text-sm font-bold text-slate-300">{log.msg}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}
