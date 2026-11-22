'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet, ArrowUpRight, ArrowDownLeft, Gift, Copy, CheckCircle2,
    ArrowLeft, Plus, ShieldCheck, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const WalletPage = () => {
    const [balance, setBalance] = useState(1240.50);
    const [copied, setCopied] = useState(false);
    const [amount, setAmount] = useState('');
    const [showTopUp, setShowTopUp] = useState(false);
    const referralCode = "YATRA777";

    const transactions = [
        { id: 1, type: 'ride', label: 'Trip to Sector 18', amount: -240.00, date: 'Today, 2:30 PM', status: 'Completed' },
        { id: 2, type: 'referral', label: 'Referral Bonus (Rahul)', amount: 50.00, date: 'Yesterday', status: 'Credited' },
        { id: 3, type: 'topup', label: 'Wallet Top-up', amount: 500.00, date: '02 Feb 2026', status: 'Added' },
        { id: 4, type: 'ride', label: 'Trip to Airport T3', amount: -380.00, date: '28 Jan 2026', status: 'Completed' },
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddMoney = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseFloat(amount);
        if (num > 0) {
            setBalance(prev => prev + num);
            setAmount('');
            setShowTopUp(false);
            alert(`₹${num} added to wallet successfully!`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-16">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/home" className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">Yatra Wallet</h1>
                            <p className="text-xs text-slate-500">Fast & hassle-free payments</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md shadow-indigo-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Wallet className="w-4 h-4" /> Available Balance
                        </span>
                        <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-medium">Auto-Debit On</span>
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex gap-2.5 mt-5">
                        <button
                            onClick={() => setShowTopUp(!showTopUp)}
                            className="flex-1 py-2.5 bg-white text-indigo-700 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                            <Plus className="w-4 h-4" /> Add Money
                        </button>
                        <button
                            onClick={() => alert('Withdrawal request initiated!')}
                            className="flex-1 py-2.5 bg-indigo-800/60 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20 flex items-center justify-center gap-1.5"
                        >
                            <ArrowUpRight className="w-4 h-4" /> Withdraw
                        </button>
                    </div>

                    {showTopUp && (
                        <form onSubmit={handleAddMoney} className="mt-4 pt-4 border-t border-white/20 flex gap-2">
                            <input
                                type="number"
                                required
                                min="10"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount (₹)"
                                className="flex-1 px-3 py-2 rounded-xl text-slate-900 text-sm font-semibold outline-none bg-white placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
                            >
                                Pay Now
                            </button>
                        </form>
                    )}
                </div>

                {/* Referral Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                            <Gift className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate">Refer Friends & Earn ₹50</h4>
                            <p className="text-xs text-slate-500 truncate">Share your invite code with friends</p>
                        </div>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex-shrink-0 transition-colors"
                    >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : referralCode}</span>
                    </button>
                </div>

                {/* Transactions Section */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
                        <span className="text-xs text-slate-500 font-medium">All activity</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="py-3 flex items-center justify-between first:pt-1 last:pb-1">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        tx.amount < 0 ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                        {tx.amount < 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">{tx.label}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xs sm:text-sm font-bold ${
                                        tx.amount < 0 ? 'text-slate-900' : 'text-emerald-600'
                                    }`}>
                                        {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount).toFixed(2)}
                                    </p>
                                    <p className="text-[10px] text-slate-400 capitalize">{tx.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Tag */}
                <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs py-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>256-bit encrypted & RBI compliant payments</span>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;