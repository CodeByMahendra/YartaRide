'use client';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { SocketDataContext } from '@/context/SocketContext';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Bell, Wallet, Settings, LogOut, Navigation,
    CheckCircle2, XCircle, Star, MapPin, ArrowRight,
    Shield, Clock, Calendar, TrendingUp, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LiveTracking from '@/components/LiveTracking';
import { useToast } from '@/context/ToastContext';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [ride, setRide] = useState<any>(null);
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const { socket } = useContext(SocketDataContext);
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [stats, setStats] = useState<any>({
        ridesCount: 0,
        totalEarnings: 0,
        walletBalance: 0,
        hoursOnline: "0.0",
        score: "0%"
    });
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !captain) {
            axios.get('/api/captain/profile', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                if (response.data.captain) {
                    setCaptain(response.data.captain);
                }
            }).catch(err => {
                console.error("Session restore failed:", err);
                localStorage.removeItem('token');
                router.push('/captain-login');
            });
        }

        if (token) {
            axios.get('/api/captain/stats', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data.stats) setStats(res.data.stats);
            }).catch(err => console.error("Stats fetch failed:", err));
        }
    }, [captain, setCaptain, router]);

    useEffect(() => {
        if (socket && captain?._id) {
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            });

            // Track live location with watchPosition for smooth map updates
            let watchId: number;
            if (navigator.geolocation) {
                watchId = navigator.geolocation.watchPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation([latitude, longitude]);
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: { ltd: latitude, lng: longitude }
                    });
                }, (err) => console.error("Location tracking error:", err),
                    { enableHighAccuracy: true });
            }

            return () => {
                if (watchId) navigator.geolocation.clearWatch(watchId);
            };
        }
    }, [captain, socket]);

    useEffect(() => {
        if (!socket) return;
        socket.on('new-ride', (data: any) => {
            setRide(data);
            showToast(`New ride request near ${data.pickup.split(',')[0]}`, 'push', 'RIDE REQUEST');
            setRidePopupPanel(true);
        });
        return () => socket.off('new-ride');
    }, [socket]);

    const acceptRide = async () => {
        if (!captain?._id) {
            showToast("You must be logged in to accept rides", "error");
            return;
        }

        try {
            const response = await axios.post(`/api/rides/confirm`, {
                rideId: ride._id,
                captainId: captain._id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRidePopupPanel(false);
            router.push(`/captain-riding?rideId=${ride._id}`);
        } catch (error) {
            console.error('Error accepting ride:', error);
            showToast("Failed to accept ride. Please try again.", "error");
        }
    };

    return (
        <div className='h-screen relative overflow-hidden bg-slate-900 font-sans'>

            {/* Top Command Navbar */}
            <header className='absolute top-0 left-0 w-full z-[60] p-4 md:p-6 flex justify-between items-start pointer-events-none'>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='pointer-events-auto flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-black/50 border border-indigo-500/20'
                >
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-3 rounded-full shadow-lg shadow-indigo-500/30">
                        <img className='w-8 brightness-0 invert' src="/images/logo.png" alt="Logo" />
                    </div>
                    <div className="pr-4">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Duty Status</h5>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                            Online & Active
                        </p>
                    </div>
                </motion.div>

                <div className='flex gap-2 md:gap-3 pointer-events-auto'>
                    <div className="flex bg-slate-900/90 backdrop-blur-xl p-1 rounded-[2.5rem] shadow-2xl shadow-black/50 border border-indigo-500/20">
                        <div className="hidden md:flex items-center gap-2 px-4 md:px-6 py-3 border-r border-indigo-500/10">
                            <Wallet className="w-4 h-4 text-indigo-400" />
                            <div className="text-left">
                                <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] leading-none">Earnings</h5>
                                <span className="text-sm font-black text-white tracking-tight">₹{stats.totalEarnings?.toLocaleString() || '0'}</span>
                            </div>
                        </div>
                        <Link href='/messages' className='h-12 w-12 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-all'>
                            <MessageSquare className="w-5 h-5" />
                        </Link>
                        <Link href='/captain/profile' className='h-12 w-12 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-all'>
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href='/captain/logout' className='h-12 w-12 flex items-center justify-center rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all'>
                            <LogOut className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Live Map Background */}
            <div className='absolute inset-0 z-0 bg-slate-900'>
                <LiveTracking pickupLocation={currentLocation} dropLocation={null} route={null} />
            </div>

            {/* Floating Stats Sidebar (Bottom for Mobile, Side for Desktop) */}
            <div className='absolute bottom-0 left-0 w-full md:w-[400px] z-[50] p-0 md:p-6 pointer-events-none'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-black/50 pointer-events-auto overflow-hidden border border-indigo-500/20'
                >
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] bg-slate-800 overflow-hidden border-2 border-indigo-500/20 shadow-xl shadow-black/30">
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop" alt="Captain" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter">Hey, {captain?.fullname?.firstname}!</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                        <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                                        <span className="text-[10px] font-black text-indigo-300">4.92</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level 2 Pilot</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[
                                { icon: Clock, label: "Hours", val: stats.hoursOnline },
                                { icon: Navigation, label: "Rides", val: stats.ridesCount },
                                { icon: TrendingUp, label: "Score", val: stats.score }
                            ].map((st, i) => (
                                <div key={i} className="bg-slate-800/50 p-4 rounded-3xl border border-indigo-500/10 text-center hover:bg-slate-800 transition-colors">
                                    <st.icon className="w-4 h-4 text-indigo-400 mx-auto mb-2" />
                                    <h5 className="text-lg font-black text-white leading-none">{st.val}</h5>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{st.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden group border border-indigo-500/20">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <h5 className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.2em] mb-1">Pass Balance</h5>
                                <h4 className="text-2xl font-black italic tracking-tighter">₹{stats.walletBalance?.toLocaleString() || '0'}</h4>
                            </div>
                            <div className="relative z-10 bg-indigo-500/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-500/20">
                                <span className="text-sm font-black text-indigo-300">Wallet</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* NEW RIDE POPUP PANEL (Neo-Modern style) */}
            <AnimatePresence>
                {ridePopupPanel && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 100 }}
                        className='fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm'
                    >
                        <div className='bg-slate-900 w-full max-w-md rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-black/80 overflow-hidden border border-indigo-500/20 relative'>
                            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-[gradient_3s_infinite]"></div>

                            <div className="p-6 md:p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter">New Ride!</h2>
                                        <p className="text-indigo-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1 md:mt-2">Incoming Opportunity</p>
                                    </div>
                                    <div className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-2xl font-black text-xl shadow-lg shadow-indigo-500/10 border border-indigo-500/20">
                                        ₹{ride?.fare}
                                    </div>
                                </div>

                                <div className="space-y-6 relative mb-12">
                                    <div className="absolute left-[20px] top-[26px] bottom-[26px] w-[2px] bg-slate-800 flex flex-col justify-between items-center py-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                    </div>

                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-700">
                                            <MapPin className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Pickup</h5>
                                            <p className="text-sm font-bold text-slate-200 line-clamp-2">{ride?.pickup}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-700">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Drop</h5>
                                            <p className="text-sm font-bold text-slate-200 line-clamp-2">{ride?.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setRidePopupPanel(false)}
                                        className="flex-1 py-5 bg-slate-800 text-slate-400 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 hover:text-white transition-all active:scale-95 border border-slate-700"
                                    >
                                        Ignore
                                    </button>
                                    <button
                                        onClick={acceptRide}
                                        className="flex-[2] py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                                    >
                                        Accept Request <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BACKGROUND TEXTURE */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default CaptainHome;
