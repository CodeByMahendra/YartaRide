'use client';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { SocketDataContext } from '@/context/SocketContext';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Bell, Wallet, Settings, LogOut, Navigation,
    CheckCircle2, XCircle, Star, MapPin, ArrowRight,
    Shield, Clock, Calendar, TrendingUp
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
    const { captain } = useContext(CaptainDataContext);
    const { showToast } = useToast();
    const router = useRouter();

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
        }
    };

    return (
        <div className='h-screen relative overflow-hidden bg-[#fafbff] font-sans'>

            {/* Top Command Navbar */}
            <header className='absolute top-0 left-0 w-full z-[60] p-6 flex justify-between items-start pointer-events-none'>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='pointer-events-auto flex items-center gap-4 bg-slate-900 p-2 rounded-[2rem] shadow-2xl border border-white/10'
                >
                    <div className="bg-emerald-500 p-3 rounded-full">
                        <img className='w-8 brightness-0 invert' src="/images/logo.png" alt="Logo" />
                    </div>
                    <div className="pr-4">
                        <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Duty Status</h5>
                        <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            Online & Active
                        </p>
                    </div>
                </motion.div>

                <div className='flex gap-3 pointer-events-auto'>
                    <div className="flex bg-white/90 backdrop-blur-xl p-1 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <div className="flex items-center gap-2 px-6 py-3 border-r border-slate-100">
                            <Wallet className="w-4 h-4 text-slate-400" />
                            <div className="text-left">
                                <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] leading-none">Earnings</h5>
                                <span className="text-sm font-black text-slate-900 tracking-tight">₹1,240.50</span>
                            </div>
                        </div>
                        <Link href='/captain/profile' className='h-12 w-12 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-50 transition-all'>
                            <Bell className="w-5 h-5" />
                        </Link>
                        <Link href='/captain/logout' className='h-12 w-12 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-all'>
                            <LogOut className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Live Map Background */}
            <div className='absolute inset-0 z-0 bg-slate-200'>
                <LiveTracking pickupLocation={currentLocation} dropLocation={null} route={null} />
            </div>

            {/* Floating Stats Sidebar (Bottom for Mobile, Side for Desktop) */}
            <div className='absolute bottom-0 left-0 w-full md:w-[400px] z-[50] p-6 pointer-events-none'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] pointer-events-auto overflow-hidden border border-slate-100'
                >
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 overflow-hidden border-2 border-white shadow-xl">
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop" alt="Captain" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Hey, {captain?.fullname?.firstname}!</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-black text-yellow-600">4.92</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level 2 Pilot</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[
                                { icon: Clock, label: "Hours", val: "8.2" },
                                { icon: Navigation, label: "Rides", val: "14" },
                                { icon: TrendingUp, label: "Score", val: "98%" }
                            ].map((st, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                                    <st.icon className="w-4 h-4 text-indigo-400 mx-auto mb-2" />
                                    <h5 className="text-lg font-black text-slate-800 leading-none">{st.val}</h5>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{st.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <h5 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-1">Today's Goal</h5>
                                <h4 className="text-2xl font-black italic tracking-tighter">₹2,000.00</h4>
                            </div>
                            <div className="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                <span className="text-sm font-black text-emerald-400">62% Done</span>
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
                        className='fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm'
                    >
                        <div className='bg-white w-full max-w-md rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100'>
                            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-indigo-500 animate-[gradient_3s_infinite]"></div>

                            <div className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">New Ride!</h2>
                                        <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Incoming Opportunity</p>
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl font-black text-xl shadow-sm border border-emerald-100">
                                        ₹{ride?.fare}
                                    </div>
                                </div>

                                <div className="space-y-6 relative mb-12">
                                    <div className="absolute left-[20px] top-[26px] bottom-[26px] w-[2px] bg-slate-100 flex flex-col justify-between items-center py-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                                    </div>

                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Pickup</h5>
                                            <p className="text-sm font-black text-slate-800 line-clamp-2">{ride?.pickup}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Drop</h5>
                                            <p className="text-sm font-black text-slate-800 line-clamp-2">{ride?.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setRidePopupPanel(false)}
                                        className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        Ignore
                                    </button>
                                    <button
                                        onClick={acceptRide}
                                        className="flex-[2] py-5 bg-emerald-600 text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-2xl shadow-emerald-100 uppercase tracking-widest text-xs"
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
