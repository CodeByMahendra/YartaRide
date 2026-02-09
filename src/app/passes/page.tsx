'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket, Zap, ShieldCheck, Clock, Crown,
    ArrowRight, Check, Sparkles, MapPin,
    Calendar, ArrowLeft, Star
} from 'lucide-react';
import Link from 'next/link';

const Passes = () => {
    const plans = [
        {
            id: 'basic',
            name: 'Urban Lite',
            price: '₹299',
            validity: '15 Days',
            perk: 'Fixed fare of ₹49 for first 5km',
            icon: Ticket,
            color: 'bg-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            text: 'text-indigo-600'
        },
        {
            id: 'pro',
            name: 'Metro Pro',
            price: '₹599',
            validity: '30 Days',
            perk: 'Fixed fare of ₹39 + No Surge Pricing',
            icon: Zap,
            featured: true,
            color: 'bg-slate-900',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            text: 'text-slate-900'
        },
        {
            id: 'elite',
            name: 'Legend Elite',
            price: '₹1299',
            validity: '45 Days',
            perk: 'Free rides up to 3km + Priority Captains',
            icon: Crown,
            color: 'bg-amber-500',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            text: 'text-amber-600'
        }
    ];

    return (
        <div className="min-h-screen bg-[#fafbff] font-sans pb-20">
            {/* Immersive Header */}
            <div className="relative h-[400px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-80"></div>
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                {/* Back Link */}
                <Link href="/home" className="absolute top-10 left-10 p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl text-white hover:bg-white/20 transition-all z-10">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center px-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/30 mb-8">
                        <Sparkles className="w-3 h-3" /> Exclusive Memberships
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter mb-6 leading-none">
                        Fly with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-yellow-400">Pass.</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Say goodbye to price fluctuations. Unlock fixed-rate journeys and elite privileges across the city.
                    </p>
                </motion.div>
            </div>

            {/* Passes Selection */}
            <div className="max-w-7xl mx-auto px-8 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {plans.map((plan, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={plan.id}
                            className={`group relative bg-white p-12 rounded-[4rem] border ${plan.featured ? 'border-indigo-600 ring-8 ring-indigo-600/5' : 'border-slate-100'} shadow-2xl hover:shadow-[0_60px_100px_rgba(0,0,0,0.1)] transition-all flex flex-col`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                                    Recommended
                                </div>
                            )}

                            <div className={`${plan.bg} ${plan.text} w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                                <plan.icon className="w-10 h-10" />
                            </div>

                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{plan.price}</span>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{plan.validity}</span>
                            </div>

                            <div className="space-y-6 flex-1 mb-12">
                                <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Subscription Privilege</h5>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-black text-slate-800 leading-tight">
                                        {plan.perk}
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-black text-slate-800 leading-tight">
                                        Surge-Free Travel 24/7
                                    </p>
                                </div>
                            </div>

                            <button className={`w-full py-6 ${plan.color} text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3`}>
                                Activate Pass <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ / Info Section */}
                <div className="mt-24 bg-white rounded-[4rem] p-16 border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 italic">How it works.</h4>
                        <p className="text-slate-500 leading-relaxed font-medium">Once a pass is active, the discount applies automatically to your rides. Simply request a ride to your destination and watch the pricing update in real-time. No manual input needed.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <h5 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">12k+</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Members</p>
                        </div>
                        <div className="text-center p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <h5 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">98%</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Savings Score</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default Passes;
