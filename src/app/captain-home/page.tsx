'use client';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { SocketDataContext } from '@/context/SocketContext';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Bell, Wallet, Settings, LogOut, Navigation,
    CheckCircle2, XCircle, Star, MapPin, ArrowRight,
    Shield, Clock, Calendar, TrendingUp, MessageSquare, Power
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LiveTracking from '@/components/LiveTracking';
import NotificationBell from '@/components/NotificationBell';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/context/ToastContext';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [ride, setRide] = useState<any>(null);
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const { socket } = useContext(SocketDataContext);
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [isOnline, setIsOnline] = useState(true);
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
        if (token && (!captain || !captain._id)) {
            axios.get('/api/captain/profile', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                if (response.data.captain) {
                    setCaptain(response.data.captain);
                }
            }).catch(err => {
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
        if (socket && captain?._id && isOnline) {
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            });

            let watchId: number;
            if (navigator.geolocation) {
                watchId = navigator.geolocation.watchPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation([latitude, longitude]);
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: { ltd: latitude, lng: longitude }
                    });
                }, (err) => {}, { enableHighAccuracy: true });
            }

            return () => {
                if (watchId) navigator.geolocation.clearWatch(watchId);
            };
        }
    }, [captain, socket, isOnline]);

    useEffect(() => {
        if (!socket) return;
        socket.on('new-ride', (data: any) => {
            if (isOnline) {
                setRide(data);
                showToast(`New ride request near ${data.pickup.split(',')[0]}`, 'push', 'RIDE REQUEST');
                setRidePopupPanel(true);
            }
        });
        return () => socket.off('new-ride');
    }, [socket, isOnline]);

    const acceptRide = async () => {
        if (!captain?._id) return;
        try {
            await axios.post(`/api/rides/confirm`, {
                rideId: ride._id,
                captainId: captain._id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRidePopupPanel(false);
            router.push(`/captain-riding?rideId=${ride._id}`);
        } catch (error) {
            showToast("Failed to accept ride.", "error");
        }
    };

    return (
        <div className='h-screen relative overflow-hidden bg-white font-sans selection:bg-indigo-100 flex flex-col'>
            {/* Top Command HUD */}
            <header className='absolute top-0 left-0 w-full z-[60] p-4 flex justify-between items-center pointer-events-none'>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='pointer-events-auto flex items-center gap-4 bg-white/95 backdrop-blur-2xl px-5 py-2.5 rounded-full shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] border border-slate-100'
                >
                    <div className={`p-2 rounded-xl shadow-lg ring-4 ${isOnline ? 'bg-indigo-600 ring-indigo-50' : 'bg-slate-400 ring-slate-50'}`}>
                        <Navigation className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none block mb-1">Matrix Status</span>
                        <p className="text-[10px] font-black text-slate-900 flex items-center gap-2">
                           <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                           {isOnline ? 'COMMANDER ONLINE' : 'NODE DISCONNECTED'}
                        </p>
                    </div>
                </motion.div>

                <div className="flex gap-2 pointer-events-auto">
                    <NotificationBell />
                    <button className='h-12 w-12 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-2xl border border-slate-100 shadow-xl text-slate-400'>
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Matrix Tracking Grid */}
            <div className='flex-1 relative z-0 grayscale-[0.3] brightness-[1.02]'>
                <LiveTracking pickupLocation={currentLocation} dropLocation={null} route={null} />
            </div>

            {/* Captain Mission Hub */}
            <div className={`absolute bottom-0 left-0 w-full md:w-[450px] z-[50] p-0 md:p-8 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${ridePopupPanel ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    className='bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-slate-100 pb-32 pt-10'
                >
                    {/* Visual Handle */}
                    <div className="md:hidden flex justify-center pb-6">
                        <div className="w-12 h-1 bg-slate-100 rounded-full" />
                    </div>

                    <div className="px-8">
                         {/* Elite Profile Node */}
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-20 h-20 rounded-[2.2rem] bg-slate-50 border-2 border-indigo-100 p-0.5 shadow-xl overflow-hidden">
                                {captain?.profileImage ? (
                                    <img src={captain.profileImage} className="w-full h-full object-cover rounded-[1.8rem]" alt="Captain" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <User className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                                    Commander <span className="text-indigo-600">{captain?.fullname?.firstname || 'Ace'}</span>
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full flex items-center gap-2">
                                        <Star className="w-2.5 h-2.5 text-indigo-600 fill-indigo-600" />
                                        <span className="text-[9px] font-black text-indigo-600 tracking-tight">{captain?.rating || '4.9'} PERFORMANCE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Matrix Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-10">
                            {[
                                { label: 'Online', val: stats.hoursOnline || '0.0', unit: 'Hrs', icon: Clock },
                                { label: 'Revenue', val: `₹${stats.totalEarnings || 0}`, unit: 'Total', icon: Wallet },
                                { label: 'Missions', val: stats.ridesCount || 0, unit: 'Trips', icon: Navigation }
                            ].map((s, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center relative group">
                                    <s.icon className="w-4 h-4 text-slate-200 absolute top-4 right-4 group-hover:text-indigo-600 transition-colors" />
                                    <h5 className="text-2xl font-black text-slate-900 leading-none tracking-tighter">{s.val}</h5>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Main Interaction Node */}
                        <button 
                            onClick={() => setIsOnline(!isOnline)}
                            className={`w-full py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 mb-4 ${isOnline ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-emerald-500 text-white shadow-emerald-200'}`}
                        >
                            {isOnline ? (
                                <><Power className="w-4 h-4 text-rose-500" /> Disconnect Hub</>
                            ) : (
                                <><Navigation className="w-4 h-4" /> Go Online</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Mission Notification Layer */}
            <AnimatePresence>
                {ridePopupPanel && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className='fixed inset-0 z-[100] bg-white flex flex-col p-6'
                    >
                         <div className="h-1.5 w-full bg-slate-50 absolute top-0 left-0 overflow-hidden">
                            <motion.div 
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="h-full w-1/2 bg-indigo-600" 
                            />
                        </div>

                        <div className="mt-12 mb-10 flex justify-between items-start">
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">ORDER<br />PENDING.</h1>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                    Intercept Protocol Active
                                </p>
                            </div>
                            <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 flex flex-col items-end">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Payload Yield</span>
                                <span className="text-5xl font-black italic tracking-tighter">₹{ride?.fare}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-8">
                             <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4">
                                 <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-200 p-0.5 overflow-hidden">
                                    {ride?.user?.profileImage ? (
                                        <img src={ride.user.profileImage} className="w-full h-full object-cover rounded-[1.2rem]" alt="Client" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200"><User className="w-6 h-6" /></div>
                                    )}
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="text-xl font-black text-slate-900 leading-none truncate">{ride?.user?.fullname?.firstname || 'Verified Alpha'}</h4>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Loyalty Member</p>
                                 </div>
                                 <button onClick={() => router.push(`/messages?partnerId=${ride?.user?._id}&partnerType=user&partnerName=${ride?.user?.fullname?.firstname}&rideId=${ride?._id}`)} className="p-4 bg-white rounded-2xl shadow-sm text-slate-900 border border-slate-100 hover:text-indigo-600">
                                    <MessageSquare className="w-6 h-6" />
                                 </button>
                             </div>

                             <div className="relative px-4 ml-6 border-l-2 border-dashed border-slate-100 space-y-12 py-4">
                                <div className="absolute -left-[8px] top-0 w-3.5 h-3.5 bg-indigo-600 rounded-full ring-4 ring-indigo-50" />
                                <div className="absolute -left-[8px] bottom-0 w-3.5 h-3.5 bg-slate-900 rounded-full ring-4 ring-slate-100" />
                                
                                <div>
                                    <h6 className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Extraction Node</h6>
                                    <p className="text-xl font-bold text-slate-900 leading-tight">{ride?.pickup}</p>
                                </div>
                                <div>
                                    <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination Target</h6>
                                    <p className="text-xl font-bold text-slate-500 leading-tight">{ride?.destination}</p>
                                </div>
                             </div>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <button onClick={() => setRidePopupPanel(false)} className="flex-1 py-6 bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-widest rounded-[2rem] border border-slate-100">
                                Ignore
                            </button>
                            <button onClick={acceptRide} className="flex-[2.5] py-6 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-[2rem] shadow-2xl flex items-center justify-center gap-3">
                                Accept Mission <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav type="captain" />
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default CaptainHome;
