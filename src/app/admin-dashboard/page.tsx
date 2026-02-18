'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, Car, Navigation, Wallet, Settings,
    Bell, Search, LayoutDashboard, ShieldAlert, LogOut
} from 'lucide-react';

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
        <div className="flex h-screen bg-slate-950 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-[100] w-80 bg-slate-900 border-r border-indigo-500/10 p-8 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="mb-12 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
                        <img src="/images/logo.png" alt="Logo" className="w-8 brightness-0 invert" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white leading-none">
                            Yatra<span className="text-indigo-400">Ride</span>
                        </h1>
                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Admin Portal</span>
                    </div>
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
                            onClick={() => { setActiveTab(item.label); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.label ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-8 border-t border-indigo-500/10">
                    <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Log Out System</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-950">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md px-6 md:px-10 py-6 border-b border-indigo-500/10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 bg-slate-900 rounded-xl lg:hidden text-slate-400"
                        >
                            <LayoutDashboard className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Command Center.</h1>
                            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5 md:mt-1">Real-time system overview</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text" placeholder="Search data..."
                                className="pl-12 pr-6 py-3 bg-slate-900 border border-indigo-500/10 focus:border-indigo-500 focus:bg-slate-900 rounded-2xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600 w-64"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-px h-6 bg-slate-800 mx-2"></div>
                            <button className="p-3 bg-slate-900 rounded-xl border border-indigo-500/10 shadow-sm relative hover:bg-slate-800 transition-all">
                                <Bell className="w-5 h-5 text-slate-400" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
                            </button>
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 border border-indigo-500/20">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-10 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((st, idx) => (
                            <div key={idx} className={`p-6 rounded-[2.5rem] bg-slate-900 border ${st.border} shadow-xl shadow-black/20`}>
                                <div className={`w-12 h-12 rounded-2xl ${st.bg} flex items-center justify-center mb-4`}>
                                    <st.icon className={`w-6 h-6 ${st.color}`} />
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{st.val}</h3>
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{st.label}</p>
                                    <span className={`text-[10px] font-black ${st.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'} bg-slate-950 px-2 py-1 rounded-lg border border-slate-800`}>
                                        {st.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Live Rides Feed */}
                        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-indigo-500/10 shadow-xl shadow-black/20">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-white tracking-tight">Recent Activity</h3>
                                <button className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">View All</button>
                            </div>

                            <div className="space-y-4">
                                {recentRides.map((ride, idx) => (
                                    <div key={idx} className="group flex items-center justify-between p-4 rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 font-black text-[10px] border border-slate-800 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                                                RD
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="text-sm font-bold text-white">{ride.user?.fullname?.firstname}</h5>
                                                    <span className="text-xs text-slate-500">→</span>
                                                    <h5 className="text-sm font-bold text-slate-300">{ride.captain?.fullname?.firstname}</h5>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(ride.createdAt).toLocaleTimeString()} • {ride._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h5 className="text-sm font-black text-white">₹{ride.fare}</h5>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${ride.status === 'completed' ? 'text-emerald-400' : ride.status === 'cancelled' ? 'text-rose-400' : 'text-amber-400'}`}>
                                                {ride.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Approvals Panel */}
                        <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-indigo-500/10 shadow-xl shadow-black/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-black text-white tracking-tight mb-8">Pending Approvals</h3>
                                <div className="space-y-6">
                                    {pendingCaptains.map((cap, idx) => (
                                        <div key={idx} className="bg-slate-950 p-5 rounded-[2rem] border border-slate-800">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h5 className="text-sm font-bold text-white">{cap.fullname?.firstname} {cap.fullname?.lastname}</h5>
                                                    <p className="text-xs text-slate-500 mt-1">{cap.vehicle?.color} {cap.vehicle?.vehicleType}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600 bg-slate-900 px-2 py-1 rounded-lg">New</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Approve</button>
                                                <button className="flex-1 py-3 bg-rose-500/10 text-rose-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Reject</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-4 rounded-xl border border-dashed border-slate-700 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all">
                                    View All Requests
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
