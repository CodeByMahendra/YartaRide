'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket, Zap, Crown, ArrowRight, Check, Sparkles, MapPin,
    ArrowLeft, X
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const Passes = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [type, setType] = useState('student');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const plans = [
        {
            id: 'basic',
            name: 'Daily Commute',
            price: '₹299',
            validity: '15 Days',
            perk: 'Flat fare of ₹49 for first 5 km on every ride',
            icon: Ticket,
            tag: 'Popular'
        },
        {
            id: 'pro',
            name: 'City Pro',
            price: '₹599',
            validity: '30 Days',
            perk: 'Flat fare of ₹39 + Zero surge pricing guaranteed',
            icon: Zap,
            featured: true,
            tag: 'Best Value'
        },
        {
            id: 'elite',
            name: 'Unlimited Club',
            price: '₹1,299',
            validity: '45 Days',
            perk: 'Free rides up to 3 km + Top rated captains priority',
            icon: Crown,
            tag: 'Premium'
        }
    ];

    const handleActivate = async () => {
        if (!pickup || !destination) {
            setErrorMsg('Please enter pickup and destination');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/passes', {
                pickup,
                destination,
                type,
                planId: selectedPlan
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 201) {
                setSuccessMsg('Pass activated successfully!');
                setTimeout(() => {
                    setSelectedPlan(null);
                    setSuccessMsg('');
                    setPickup('');
                    setDestination('');
                }, 2500);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Failed to activate pass');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-16">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/home" className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">Yatra Passes</h1>
                            <p className="text-xs text-slate-500">Save big on daily commute</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl p-6 shadow-sm">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-2">
                        <Sparkles className="w-3.5 h-3.5" /> Fixed Fare Passes
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Save up to 40% every month</h2>
                    <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-lg">
                        Lock in discounted rates for your regular office or college routes with zero surge pricing.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                                plan.featured
                                    ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100'
                                    : 'border-slate-200/80 shadow-sm hover:border-slate-300'
                            }`}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <plan.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                        plan.featured ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                        {plan.tag}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-1 mb-3">
                                    <span className="text-2xl font-black text-slate-900">{plan.price}</span>
                                    <span className="text-xs text-slate-500 font-medium">/ {plan.validity}</span>
                                </div>

                                <div className="space-y-2 text-xs text-slate-600 py-3 border-t border-slate-100">
                                    <div className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{plan.perk}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>Zero surge pricing during peak hours</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                    plan.featured
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                            >
                                <span>Get Pass</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">How do Yatra Passes work?</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Once purchased, the pass automatically applies to your booked rides matching your route. No coupon codes required at checkout.
                    </p>
                </div>
            </div>

            {/* Modal for Route Setup */}
            <AnimatePresence>
                {selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                    Configure Route
                                </h3>
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {successMsg ? (
                                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-center text-xs font-bold">
                                    {successMsg}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {errorMsg && (
                                        <p className="text-rose-500 text-xs font-semibold">{errorMsg}</p>
                                    )}

                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Pickup Location</label>
                                        <input
                                            type="text"
                                            value={pickup}
                                            onChange={(e) => setPickup(e.target.value)}
                                            placeholder="e.g. Home, Sector 62"
                                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Drop Location</label>
                                        <input
                                            type="text"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            placeholder="e.g. Office, Cyber City"
                                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Pass Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                                        >
                                            <option value="student">Student Pass</option>
                                            <option value="office">Office Commute</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleActivate}
                                        disabled={loading}
                                        className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                                    >
                                        {loading ? 'Activating...' : 'Confirm & Pay'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Passes;