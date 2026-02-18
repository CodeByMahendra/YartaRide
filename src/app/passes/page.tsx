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
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
            text: 'text-indigo-400'
        },
        {
            id: 'pro',
            name: 'Metro Pro',
            price: '₹599',
            validity: '30 Days',
            perk: 'Fixed fare of ₹39 + No Surge Pricing',
            icon: Zap,
            featured: true,
            color: 'bg-slate-800', // Featured button color
            bg: 'bg-slate-800',
            border: 'border-slate-700',
            text: 'text-white'
        },
        {
            id: 'elite',
            name: 'Legend Elite',
            price: '₹1299',
            validity: '45 Days',
            perk: 'Free rides up to 3km + Priority Captains',
            icon: Crown,
            color: 'bg-amber-600',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            text: 'text-amber-400'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 font-sans pb-20">
            {/* Immersive Header */}
            <div className="relative h-[300px] md:h-[400px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-slate-950 opacity-80"></div>
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                {/* Back Link */}
                <Link href="/home" className="absolute top-6 left-6 md:top-10 md:left-10 p-3 md:p-4 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl text-white hover:bg-slate-800 transition-all z-10">
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center px-8 mt-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/30 mb-8">
                        <Sparkles className="w-3 h-3" /> Exclusive Memberships
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black text-white italic tracking-tighter mb-6 leading-none">
                        Fly with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-200">Pass.</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Say goodbye to price fluctuations. Unlock fixed-rate journeys and elite privileges across the city.
                    </p>
                </motion.div>
            </div>

            {/* Passes Selection */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 md:-mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {plans.map((plan, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={plan.id}
                            className={`group relative bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border ${plan.featured ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10' : 'border-slate-800'} shadow-xl hover:shadow-2xl transition-all flex flex-col`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/40">
                                    Recommended
                                </div>
                            )}

                            <div className={`${plan.bg} ${plan.text} w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 border ${plan.border}`}>
                                <plan.icon className="w-10 h-10" />
                            </div>

                            <h3 className="text-3xl font-black text-white tracking-tighter mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-4xl font-black text-white italic tracking-tighter">{plan.price}</span>
                                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">{plan.validity}</span>
                            </div>

                            <div className="space-y-6 flex-1 mb-12">
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Subscription Privilege</h5>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-black text-slate-300 leading-tight">
                                        {plan.perk}
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-black text-slate-300 leading-tight">
                                        Surge-Free Travel 24/7
                                    </p>
                                </div>
                            </div>

                            <button className={`w-full py-6 ${plan.featured ? 'bg-gradient-to-r from-indigo-600 to-indigo-700' : 'bg-slate-800'} text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 border border-white/5`}>
                                Activate Pass <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ / Info Section */}
                <div className="mt-24 bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-indigo-500/10 flex flex-col md:flex-row gap-12 items-center shadow-2xl shadow-black/20">
                    <div className="flex-1">
                        <h4 className="text-3xl font-black text-white tracking-tighter mb-4 italic">How it works.</h4>
                        <p className="text-slate-400 leading-relaxed font-medium">Once a pass is active, the discount applies automatically to your rides. Simply request a ride to your destination and watch the pricing update in real-time. No manual input needed.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center p-8 bg-slate-950 rounded-[3rem] border border-slate-800 w-40">
                            <h5 className="text-4xl font-black text-white tracking-tighter mb-1">12k+</h5>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Members</p>
                        </div>
                        <div className="text-center p-8 bg-slate-950 rounded-[3rem] border border-slate-800 w-40">
                            <h5 className="text-4xl font-black text-white tracking-tighter mb-1">98%</h5>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Savings Score</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default Passes;
