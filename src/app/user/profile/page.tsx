'use client';
import React, { useContext } from 'react';
import { UserDataContext } from '@/context/UserDataContext';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Clock, Shield, LogOut, ArrowLeft, Edit3, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user } = useContext(UserDataContext);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] text-center max-w-md w-full shadow-2xl"
                >
                    <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-400">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Identity Required.</h2>
                    <p className="text-white/40 mb-10 font-medium">Please authorize your access to view your personal dashboard.</p>
                    <Link href="/login" className="block w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                        Sign In
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbff] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-transparent to-yellow-500/10 scale-110"></div>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">

                {/* Top Navigation */}
                <div className="flex justify-between items-center mb-16">
                    <Link href="/home" className="flex items-center gap-2 text-white/60 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Mobility
                    </Link>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Verified Member
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Left Column - Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div className="bg-white rounded-[4rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-700"></div>

                            <div className="relative mb-12">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 border-4 border-white shadow-2xl mb-8 flex items-center justify-center text-white overflow-hidden">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-14 h-14" />
                                    )}
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                                    {user.fullname.firstname} {user.fullname.lastname}
                                </h1>
                                <p className="text-indigo-600 font-bold text-sm tracking-wide">YatraRide Gold Member</p>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-slate-50">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Identifier</h5>
                                        <p className="text-slate-900 font-bold">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Member Since</h5>
                                        <p className="text-slate-900 font-bold">January 2026</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black active:scale-[0.98] transition-all relative overflow-hidden group">
                                <Edit3 className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Modify Profile</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        </div>

                        <Link href="/user/logout" className="flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                            <LogOut className="w-5 h-5" /> Terminate Session
                        </Link>
                    </motion.div>

                    {/* Right Column - Stats & Insights */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-10"
                    >
                        {/* Wallet Quickview */}
                        <div className="bg-white rounded-[4rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                    <Wallet className="w-8 h-8" />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Available Credits</h5>
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">₹450.00</p>
                                </div>
                            </div>
                            <button className="px-10 py-5 bg-emerald-500 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200">
                                Top-Up Wallet
                            </button>
                        </div>

                        {/* Travel Stats */}
                        <div className="grid grid-cols-2 gap-8 text-slate-800">
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-lg shadow-black/5">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-1">12</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Journeys</p>
                            </div>

                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-lg shadow-black/5">
                                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 mb-6">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-1">84 km</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance Covered</p>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-indigo-900 text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <Shield className="w-32 h-32 text-indigo-800 absolute -top-8 -right-8 opacity-50" />
                            </div>
                            <div className="relative z-10 max-w-sm">
                                <h4 className="text-2xl font-black mb-4 tracking-tight">Enterprise-Grade Security</h4>
                                <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                                    Your data is protected by military-grade encryption and audited daily. Your privacy is our highest priority at YatraRide.
                                </p>
                                <div className="flex gap-4">
                                    <span className="px-4 py-2 bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest">AES-256</span>
                                    <span className="px-4 py-2 bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest">TLS 1.3</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

        </div>
    );
}
