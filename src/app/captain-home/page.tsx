'use client';
import React, { useEffect, useState, useContext } from 'react';
import { SocketDataContext } from '@/context/SocketContext';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Bell, Wallet, Settings, LogOut, Navigation,
    Star, MapPin, ArrowRight, Clock, Power, MessageSquare, Phone
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
                showToast(`New ride request near ${data.pickup?.split(',')[0]}`, 'push', 'RIDE REQUEST');
                setRidePopupPanel(true);
            }
        });
        return () => socket.off('new-ride');
    }, [socket, isOnline]);

    const acceptRide = async () => {
        if (!captain?._id || !ride?._id) return;
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
        <div className='h-screen relative overflow-hidden bg-white font-sans flex flex-col'>
            {/* Top Navigation */}
            <header className='absolute top-0 left-0 w-full z-40 p-3 sm:p-4 flex justify-between items-center pointer-events-none'>
                <div className='pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200'>
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800">
                        {isOnline ? 'You are Online' : 'You are Offline'}
                    </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    <NotificationBell />
                    <Link
                        href="/captain/profile"
                        className='w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-slate-700'
                    >
                        <User className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* Map Area */}
            <div className='flex-1 relative z-0'>
                <LiveTracking pickupLocation={currentLocation} dropLocation={null} route={null} />
            </div>

            {/* Bottom Floating Control Card */}
            <div className={`absolute bottom-0 left-0 w-full md:left-4 md:bottom-20 md:w-96 z-30 p-3 sm:p-4 transition-transform duration-300 ${ridePopupPanel ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 mb-14 md:mb-0'>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                                {captain?.fullname?.firstname?.[0] || 'C'}
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                    {captain?.fullname?.firstname || 'Captain'}
                                </h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span>{captain?.rating || '4.9'}</span>
                                    <span>•</span>
                                    <span className="capitalize">{captain?.vehicle?.vehicleType || 'Car'}</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOnline(!isOnline)}
                            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                                isOnline
                                    ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                        >
                            <Power className="w-3.5 h-3.5" />
                            <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
                        </button>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                        <div className="bg-slate-50 rounded-xl p-2">
                            <p className="text-[10px] text-slate-500 font-semibold uppercase">Hours</p>
                            <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{stats.hoursOnline || '0.0'}h</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2">
                            <p className="text-[10px] text-slate-500 font-semibold uppercase">Today</p>
                            <p className="text-xs sm:text-sm font-bold text-indigo-600 mt-0.5">₹{stats.totalEarnings || 0}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2">
                            <p className="text-[10px] text-slate-500 font-semibold uppercase">Trips</p>
                            <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{stats.ridesCount || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ride Request Pop-Up Modal */}
            <AnimatePresence>
                {ridePopupPanel && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className='fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 md:max-w-md md:left-1/2 md:-translate-x-1/2 md:top-10 md:bottom-10 md:rounded-3xl md:shadow-2xl'
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">New Ride Request</span>
                                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">₹{ride?.fare}</h2>
                                </div>
                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
                                    Cash / Online
                                </span>
                            </div>

                            {/* Passenger Details */}
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                                    {ride?.user?.fullname?.firstname?.[0] || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">
                                        {ride?.user?.fullname?.firstname || 'Passenger'}
                                    </h4>
                                    <p className="text-xs text-slate-500">Verified Customer</p>
                                </div>
                            </div>

                            {/* Route */}
                            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                                <div className="flex items-start gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup</p>
                                        <p className="text-slate-800 font-semibold">{ride?.pickup}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/50">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Drop Off</p>
                                        <p className="text-slate-800 font-semibold">{ride?.destination}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2.5 mt-6">
                            <button
                                onClick={() => setRidePopupPanel(false)}
                                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
                            >
                                Decline
                            </button>
                            <button
                                onClick={acceptRide}
                                className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                                <span>Accept Ride</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav type="captain" />
        </div>
    );
};

export default CaptainHome;