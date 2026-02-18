'use client';
import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '@/context/UserDataContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Clock, Shield, LogOut, ArrowLeft, Edit3, Wallet, Star, TrendingUp, ChevronRight, CreditCard, Bell } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function ProfilePage() {
    const { user } = useContext(UserDataContext);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('/api/user/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStats(res.data.stats);
                } catch (err) {
                    console.error("Stats fetch failed:", err);
                }
            }
        };
        fetchStats();
    }, []);

    if (!user || !user.email) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl text-center max-w-md w-full shadow-2xl"
                >
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-neutral-400 mb-8 text-sm">Please sign in to view your profile and ride history.</p>
                    <Link href="/login" className="block w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                        Sign In
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 pb-12">

            {/* Header / Nav */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
                    <Link href="/home" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Verified</span>
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors text-neutral-400">
                            <Bell className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Sidebar - Profile Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 relative overflow-hidden"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="w-28 h-28 rounded-full bg-neutral-800 border-4 border-neutral-900 shadow-xl overflow-hidden">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                                <User className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-neutral-900"></div>
                                </div>

                                <h1 className="text-2xl font-bold text-zinc-100 mb-1">
                                    {user?.fullname?.firstname} {user?.fullname?.lastname}
                                </h1>
                                <div className="flex items-center gap-1.5 text-indigo-400 mb-6">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {(stats?.ridesCount || 0) > 10 ? 'Gold Member' : 'Classic Member'}
                                    </span>
                                </div>

                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Email</p>
                                                <p className="text-sm font-medium text-neutral-200 truncate max-w-[150px]">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Joined</p>
                                                <p className="text-sm font-medium text-neutral-200">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-3 bg-neutral-100 text-black rounded-xl font-bold text-sm hover:bg-white transition-colors flex items-center justify-center gap-2">
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                            </div>
                        </motion.div>

                        <div className="bg-neutral-900 rounded-3xl p-2 border border-neutral-800">
                            <Link href="/user/logout" className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-red-500/10 hover:text-red-400 text-neutral-400 transition-colors group">
                                <span className="flex items-center gap-3 font-medium text-sm">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Content - Dashboard Stats */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Featured: Wallet Card - Modern Style */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <p className="text-indigo-200 text-sm font-medium mb-1">Total Balance</p>
                                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">₹{stats?.walletBalance?.toLocaleString() || '0'}</h2>
                                    <div className="flex items-center gap-2 text-sm text-indigo-100/80 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                                        <Wallet className="w-4 h-4" />
                                        <span>YatraRide Wallet</span>
                                    </div>
                                </div>
                                <button className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:bg-neutral-50 transition-all active:scale-95">
                                    + Add Funds
                                </button>
                            </div>
                        </motion.div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Total Rides', value: stats?.ridesCount || '0', icon: Clock, color: 'text-blue-400' },
                                { label: 'Total Distance', value: (stats?.totalDistance || '0') + ' km', icon: CreditCard, color: 'text-emerald-400' },
                                { label: 'Total Spent', value: '₹' + (stats?.totalSpent?.toLocaleString() || '0'), icon: TrendingUp, color: 'text-violet-400' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 hover:border-neutral-700 transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-neutral-700 transition-colors`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity / Security Section (Simplified) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-zinc-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Security Center</h3>
                                    <p className="text-sm text-neutral-400">Your account is utilizing top-tier encryption standards.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['256-bit AES', 'Biometric', '2FA Enabled', 'Verified'].map((item, i) => (
                                    <div key={i} className="px-4 py-3 bg-neutral-950 rounded-xl text-xs font-bold text-neutral-400 text-center border border-neutral-800">
                                        {item}
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
