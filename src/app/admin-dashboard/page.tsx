'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, Car, Navigation, Wallet, Settings,
    Bell, Search, LayoutDashboard, ShieldAlert, LogOut,
    ArrowRight, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [realStats, setRealStats] = useState<any>(null);
    const [recentRides, setRecentRides] = useState<any[]>([]);
    const [pendingCaptains, setPendingCaptains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRealStats(response.data.stats);
                setRecentRides(response.data.recentRides);
                setPendingCaptains(response.data.pendingCaptains);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: "Total Revenue", val: realStats ? `₹${realStats.totalRevenue.toLocaleString()}` : "₹0", change: "+0%", icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Active Riders", val: realStats ? realStats.activeRiders.toLocaleString() : "0", change: "+0%", icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { label: "Verified Captains", val: realStats ? realStats.verifiedCaptains.toLocaleString() : "0", change: "+0%", icon: Car, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Ongoing Trips", val: realStats ? realStats.ongoingTrips.toLocaleString() : "0", change: "+0%", icon: Navigation, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    ];

    const [activeTab, setActiveTab] = useState('Overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#06080c] font-sans selection:bg-indigo-500/30 relative overflow-hidden text-slate-300">
            {/* Background Ambient Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-[100] w-80 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 p-10 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="mb-14 flex items-center gap-4">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-3 rounded-2xl shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/5">
                        <img src="/images/logo.png" alt="Logo" className="w-8 brightness-0 invert" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-white leading-none">
                            Yatra<span className="text-indigo-400">Ride</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">Secure Dev v2.4</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2.5">
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
                            onClick={() => { setActiveTab(item.label); setIsSidebarOpen(false); }}
                            className={`w-full group flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold transition-all duration-300 ${activeTab === item.label ? 'bg-indigo-600 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.label ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-8 border-t border-white/5">
                    <button className="w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-black text-rose-400/70 hover:bg-rose-500/10 hover:text-rose-400 transition-all uppercase tracking-widest text-[10px]">
                        <LogOut className="w-5 h-5" />
                        Terminate Session
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#06080c]/60 backdrop-blur-3xl px-8 md:px-12 py-8 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-3 bg-white/5 rounded-2xl lg:hidden text-slate-400 border border-white/5"
                        >
                            <LayoutDashboard className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Command Center.</h1>
                            <div className="flex items-center gap-3 mt-1.5">
                                <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Global Network Operations</p>
                                <div className="w-px h-3 bg-white/10"></div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase">Healthy</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative group hidden xl:block">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text" placeholder="Access database records..."
                                className="pl-14 pr-8 py-4 bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.08] rounded-[1.5rem] text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600 w-80"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="h-14 w-14 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center relative hover:bg-white/10 active:scale-95 transition-all text-slate-400 hover:text-white">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-4 border-[#06080c]"></span>
                            </button>
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-0.5 shadow-2xl shadow-indigo-500/20">
                                <div className="w-full h-full bg-[#06080c] rounded-[0.9rem] flex items-center justify-center text-white font-black text-sm tracking-tighter">
                                    AD
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 md:p-12 pb-24 space-y-10">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((st, idx) => (
                            <div key={idx} className={`group relative p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-indigo-500/20 transition-all duration-300`}>
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <st.icon className="w-20 h-20" />
                                </div>
                                <div className={`w-14 h-14 rounded-2xl ${st.bg} flex items-center justify-center mb-6 shadow-xl`}>
                                    <st.icon className={`w-7 h-7 ${st.color}`} />
                                </div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{st.label}</p>
                                <div className="flex justify-between items-end">
                                    <h3 className="text-3xl font-black text-white tracking-tighter">{st.val}</h3>
                                    <span className={`text-[11px] font-black ${st.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'} bg-white/5 px-3 py-1.5 rounded-xl border border-white/5`}>
                                        {st.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Live Activity Feed */}
                        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md rounded-[3.5rem] p-10 border border-white/5 shadow-2xl">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Recent Activity</h3>
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">Last 50 recorded transactions</p>
                                </div>
                                <button className="px-5 py-2.5 bg-indigo-600/10 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Export Logs</button>
                            </div>

                            <div className="space-y-4">
                                {recentRides.map((ride, idx) => (
                                    <div key={idx} className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:translate-x-1 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 transition-all border border-white/5">
                                                <Car className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h5 className="text-base font-black text-white">{ride.user?.fullname?.firstname}</h5>
                                                    <ArrowRight className="w-3 h-3 text-slate-600" />
                                                    <h5 className="text-base font-black text-slate-400">{ride.captain?.fullname?.firstname}</h5>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date(ride.createdAt).toLocaleTimeString()}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                                                    <span className="text-[10px] font-black text-indigo-500/70 uppercase">ID: {ride._id.slice(-8).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h5 className="text-xl font-black text-white tracking-tighter mb-1">₹{ride.fare}</h5>
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${ride.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : ride.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${ride.status === 'completed' ? 'bg-emerald-500' : ride.status === 'cancelled' ? 'bg-rose-500' : 'bg-amber-500'} animate-pulse`}></div>
                                                {ride.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Approvals Panel */}
                        <div className="bg-slate-900/40 backdrop-blur-md rounded-[3.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-[100px] -mr-24 -mt-24 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-10">
                                    <h3 className="text-2xl font-black text-white tracking-tight">Vetting Pool</h3>
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">Captain verification queue</p>
                                </div>

                                <div className="space-y-6 flex-1 max-h-[600px] overflow-y-auto no-scrollbar">
                                    {pendingCaptains.map((cap, idx) => (
                                        <div key={idx} className="bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all">
                                            <div className="flex items-start gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black text-indigo-400 border border-white/5">
                                                    {cap.fullname?.firstname[0]}
                                                </div>
                                                <div>
                                                    <h5 className="text-base font-black text-white leading-none mb-1">{cap.fullname?.firstname} {cap.fullname?.lastname}</h5>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{cap.vehicle?.color} {cap.vehicle?.vehicleType} • {cap.vehicle?.plate}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button className="py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/10">Approve</button>
                                                <button className="py-4 bg-white/5 text-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-all border border-white/5">Decline</button>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingCaptains.length === 0 && (
                                        <div className="h-40 flex flex-col items-center justify-center text-center opacity-30">
                                            <CheckCircle2 className="w-10 h-10 mb-4" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Queue Clear</p>
                                        </div>
                                    )}
                                </div>
                                <button className="w-full mt-10 py-5 rounded-[1.5rem] border border-dashed border-white/10 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all">
                                    Access Full Fleet Registry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Noise Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default AdminDashboard;
