'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, MapPin, Navigation, ArrowLeft,
    Download, Calendar, Clock, ChevronRight,
    Map as MapIcon, Filter, Layers, CreditCard
} from 'lucide-react';
import Link from 'next/link';

const RideHistory = () => {
    const rides = [
        { id: "RD-9901", from: "Cyber City, GGN", to: "Sector 62, Noida", date: "Feb 05, 2026", fare: "₹450", status: "Completed", captain: "Amit Singh" },
        { id: "RD-9902", from: "Airport T3", to: "Malviya Nagar", date: "Feb 04, 2026", fare: "₹380", status: "Completed", captain: "Vikram Das" },
        { id: "RD-9903", from: "Connaught Place", to: "Hauz Khas", date: "Feb 01, 2026", fare: "₹0", status: "Cancelled", captain: "N/A" },
    ];

    return (
        <div className="min-h-screen bg-[#fafbff] font-sans pb-20">
            {/* Header */}
            <header className="bg-white px-8 py-10 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 sticky top-0 z-50">
                <div className="flex items-center gap-6 mb-6 md:mb-0">
                    <Link href="/home" className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Journeys.</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Your movement archive</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
                        <Download className="w-4 h-4" /> Export All
                    </button>
                    <button className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-8 space-y-12">

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Distance", val: "142 km", icon: Navigation, col: "text-indigo-600" },
                        { label: "Time Saved", val: "12.4 hrs", icon: Clock, col: "text-emerald-500" },
                        { label: "Elite Rating", val: "4.92", icon: Star, col: "text-yellow-500" },
                    ].map((st, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <st.icon className={`w-6 h-6 ${st.col} mb-4`} />
                            <h4 className="text-3xl font-black text-slate-900 italic tracking-tighter">{st.val}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{st.label}</p>
                        </div>
                    ))}
                </div>

                {/* Legend History List */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter px-2">Recent Archives</h3>

                    <div className="space-y-6">
                        {rides.map((ride, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={ride.id}
                                className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden group border-b-4 border-b-transparent hover:border-b-indigo-600"
                            >
                                <div className="p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                                    {/* Left: Locations & Date */}
                                    <div className="flex-1 space-y-8">
                                        <div className="flex items-center gap-4 text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">{ride.date}</span>
                                            <div className="w-px h-3 bg-slate-200"></div>
                                            <span className="text-xs font-black uppercase tracking-widest">{ride.id}</span>
                                        </div>

                                        <div className="relative space-y-8">
                                            <div className="absolute left-[8px] top-[10px] bottom-[10px] w-0.5 bg-slate-100 flex flex-col justify-between py-1">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 -ml-[3px]"></div>
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 -ml-[3px]"></div>
                                            </div>

                                            <div className="pl-8">
                                                <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Departure</h5>
                                                <p className="font-black text-slate-800 text-sm leading-tight italic">{ride.from}</p>
                                            </div>
                                            <div className="pl-8">
                                                <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Arrival</h5>
                                                <p className="font-black text-slate-800 text-sm leading-tight italic">{ride.to}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Captain & Map Preview (Mock) */}
                                    <div className="hidden lg:flex flex-col items-center gap-4 w-48 text-center border-l border-r border-slate-50 px-8">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                            <MapIcon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Commander</h5>
                                            <p className="font-black text-slate-900 text-xs">{ride.captain}</p>
                                        </div>
                                    </div>

                                    {/* Right: Fare & Actions */}
                                    <div className="flex items-center justify-between lg:justify-end lg:gap-12 lg:w-48">
                                        <div className="text-right">
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{ride.fare}</h3>
                                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${ride.status === 'Completed' ? 'text-emerald-500' : 'text-rose-500'
                                                }`}>{ride.status}</p>
                                        </div>
                                        <button className="p-4 bg-slate-100 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 group-hover:bg-indigo-600 group-hover:text-white">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-50/50 p-10 rounded-[3.5rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Detailed Analytics.</h4>
                        <p className="text-sm text-slate-500 font-medium">Download your full annual travel report for tax & reimbursements.</p>
                    </div>
                    <button className="bg-white px-10 py-5 rounded-[2rem] border border-indigo-100 text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-200">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default RideHistory;
