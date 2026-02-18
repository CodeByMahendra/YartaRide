'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet, CreditCard, ArrowUpRight, ArrowDownLeft,
    History, TrendingUp, Gift, Copy, CheckCircle2,
    ArrowLeft, Plus, ChevronRight, IndianRupee, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

const WalletPage = () => {
    const [balance, setBalance] = useState(1240.50);
    const [copied, setCopied] = useState(false);
    const referralCode = "YATRA777";

    const transactions = [
        { id: 1, type: 'ride', label: 'Trip to Sector 18', amount: -240.00, date: 'Today, 2:30 PM', status: 'Completed' },
        { id: 2, type: 'referral', label: 'Referral Bonus (Rahul)', amount: 50.00, date: 'Yesterday', status: 'Credited' },
        { id: 3, type: 'topup', label: 'Wallet Top-up', amount: 500.00, date: '2 days ago', status: 'Added' },
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans pb-20">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md px-6 py-8 md:px-8 md:py-10 flex items-center justify-between border-b border-indigo-500/10 sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <Link href="/home" className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white hover:bg-indigo-600 transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">My Wallet.</h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Financial Overview</p>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 md:space-y-10">

                {/* Main Card (Total Balance) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3.5rem] p-12 text-white overflow-hidden shadow-2xl shadow-indigo-500/20 border border-indigo-500/20"
                >
                    <div className="absolute inset-0 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-full -ml-24 -mb-24 blur-[60px]"></div>
                    <div className="relative z-10 p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-4 opacity-50">
                            <Wallet className="w-5 h-5 text-indigo-300" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Available Liquidity</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-10 flex items-baseline text-white">
                            ₹{balance.toLocaleString()}
                            <span className="text-xl font-bold not-italic text-slate-500 ml-4">INR</span>
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 bg-white text-slate-950 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-[0.98] shadow-lg shadow-white/10">
                                <Plus className="w-4 h-4" /> Top Up
                            </button>
                            <button className="flex items-center justify-center gap-3 bg-slate-800/50 backdrop-blur-md text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-slate-800 transition-all">
                                <ArrowUpRight className="w-4 h-4" /> Withdraw
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Referral Section (Mini Card) */}
                <div className="bg-slate-900 rounded-[3rem] p-8 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-black/20">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/20">
                            <Gift className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white tracking-tight">Refer & Earn ₹100</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Share your legend code</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950 px-6 py-4 rounded-[1.5rem] border border-slate-800 shadow-inner shadow-black/50">
                        <span className="text-sm font-black text-white tracking-widest uppercase">{referralCode}</span>
                        <div className="w-px h-6 bg-slate-800"></div>
                        <button onClick={copyToClipboard} className="text-indigo-400 hover:scale-110 transition-transform hover:text-white">
                            {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-2xl font-black text-white tracking-tighter leading-none">Activity.</h3>
                        <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">View History</button>
                    </div>

                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <motion.div
                                key={tx.id}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-lg shadow-black/20 group hover:border-indigo-500/20 transition-all"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.amount < 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                        {tx.amount < 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h5 className="font-black text-white text-sm">{tx.label}</h5>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h4 className={`text-lg font-black tracking-tighter ${tx.amount < 0 ? 'text-white' : 'text-emerald-400'
                                        }`}>
                                        {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount)}
                                    </h4>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{tx.status}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="pt-10 flex items-center justify-center gap-4 text-slate-600 opacity-50">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bank-Grade Security Protocol</span>
                </div>
            </div>

            {/* Background Texture */}
            <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default WalletPage;
