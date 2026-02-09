'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Car, Navigation, Wallet, Settings,
    Bell, Search, TrendingUp, ArrowUpRight,
    UserCheck, ShieldAlert, MoreVertical, LogOut,
    CheckCircle2, XCircle, Clock
} from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
    const stats = [
        { label: "Total Revenue", val: "₹12,45,000", change: "+12.5%", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Active Riders", val: "8,942", change: "+5.2%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Verified Captains", val: "1,240", change: "+2.1%", icon: Car, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: "Ongoing Trips", val: "245", change: "-1.4%", icon: Navigation, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    const recentRides = [
        { id: "#RD-9901", user: "Rahul Sharma", captain: "Amit Singh", status: "Ongoing", fare: "₹240", time: "2m ago" },
        { id: "#RD-9902", user: "Priya Gupta", captain: "Vikram Das", status: "Completed", fare: "₹450", time: "15m ago" },
        { id: "#RD-9903", user: "Anil Kumar", captain: "Sanjay Dev", status: "Cancelled", fare: "₹0", time: "45m ago" },
    ];

    const pendingCaptains = [
        { name: "Sunil Verma", vehicle: "White Swift Dzire", docs: "RC, DL, Aadhaar", time: "1h ago" },
        { name: "Mohit Negi", vehicle: "Black Activa 6G", docs: "RC, DL", time: "4h ago" },
    ];

    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div className="flex h-screen bg-[#fafbff] font-sans selection:bg-indigo-100">

            {/* Sidebar Navigation */}
            <aside className="w-80 bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col">
                <div className="mb-12 flex items-center gap-3">
                    <div className="bg-slate-900 p-3 rounded-2xl">
                        <img src="/images/logo.png" alt="Logo" className="w-24 brightness-0 invert" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Admin</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { icon: LayoutDashboard, label: "Overview" },
                        { icon: Users, label: "User Control" },
                        { icon: Car, label: "Captain Fleet" },
                        { icon: Wallet, label: "Payments" },
                        { icon: ShieldAlert, label: "Security" },
                        { icon: Settings, label: "System Config" },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.label ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-8 border-t border-slate-100">
                    <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Log Out System</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-10 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Command Center.</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time system overview</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text" placeholder="Search data..."
                                className="pl-12 pr-6 py-3 bg-slate-100 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-px h-6 bg-slate-200 mx-2"></div>
                            <button className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm relative">
                                <Bell className="w-5 h-5 text-slate-400" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10">

                    {activeTab === 'Overview' && (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {stats.map((st, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`${st.bg} ${st.color} p-4 rounded-2xl`}>
                                                <st.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                <TrendingUp className="w-3 h-3" /> {st.change}
                                            </div>
                                        </div>
                                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{st.val}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{st.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Recent Activity Table */}
                                <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-sm">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Recent Journeys</h3>
                                        <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
                                    </div>

                                    <div className="space-y-6">
                                        {recentRides.map((r, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm font-bold border border-slate-100">
                                                        {r.id.split('-')[1].charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-black text-slate-900">{r.user}</h5>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Captain: {r.captain}</p>
                                                    </div>
                                                </div>
                                                <div className="text-center hidden md:block">
                                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                        r.status === 'Completed' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                            'bg-rose-50 text-rose-600 border border-rose-100'
                                                        }`}>
                                                        {r.status}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <h5 className="font-black text-slate-900">{r.fare}</h5>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* System Health / Top Performers */}
                                <div className="space-y-10">
                                    <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                        <h3 className="text-xl font-black mb-6 relative z-10">Fleet Health</h3>
                                        <div className="space-y-6 relative z-10">
                                            {[
                                                { label: "GPS Uptime", val: "99.9%" },
                                                { label: "Payment API", val: "100%" },
                                                { label: "Socket Nodes", val: "Stable" }
                                            ].map((h, i) => (
                                                <div key={i} className="flex justify-between items-center pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{h.label}</span>
                                                    <span className="text-sm font-black text-emerald-400">{h.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-sm">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8 italic">Captain Approval.</h3>
                                        <div className="space-y-6">
                                            {pendingCaptains.map((cap, i) => (
                                                <div key={i} className="pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h5 className="font-black text-slate-900">{cap.name}</h5>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cap.vehicle}</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-indigo-400 uppercase">{cap.time}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="flex-1 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Approve</button>
                                                        <button className="p-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><XCircle className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'User Control' && (
                        <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-10">User Directory.</h3>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((u) => (
                                    <div key={u} className="flex items-center justify-between p-8 border border-slate-100 rounded-[2.5rem] hover:bg-slate-50 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">U{u}</div>
                                            <div>
                                                <h5 className="font-black text-slate-900 text-lg tracking-tight">User Name {u}</h5>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Member since Jan 2026</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <h5 className="font-black text-slate-900 leading-none">₹2,400</h5>
                                                <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Wallet</p>
                                            </div>
                                            <button className="p-4 bg-white border border-slate-100 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-400">
                                                <ShieldAlert className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Captain Fleet' && (
                        <div className="space-y-8">
                            <div className="bg-indigo-600 rounded-[3.5rem] p-12 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter mb-2">Fleet Management.</h3>
                                    <p className="text-indigo-100 font-medium opacity-80">Oversee active pilots and vehicle documentation.</p>
                                </div>
                                <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Audit Docs</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4].map((c) => (
                                    <div key={c} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center">
                                                <Car className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest">Active</div>
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Captain {c}</h4>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 mb-8">MH-12-BA-990{c} • White Swift</p>

                                        <div className="flex gap-3">
                                            <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Deep Profile</button>
                                            <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all"><XCircle className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Mocking required icons for sidebar labels
const LayoutDashboard = ({ className }: { className?: string }) => <TrendingUp className={className} />;

export default AdminDashboard;
