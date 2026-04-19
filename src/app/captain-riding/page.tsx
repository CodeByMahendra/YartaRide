'use client';
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocketDataContext } from '@/context/SocketContext';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import LiveTracking from '@/components/LiveTracking';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, Navigation, MapPin,
    ShieldCheck, CheckCircle2, ChevronUp,
    Lock, ArrowRight, User, Timer, Star, MessageSquare
} from 'lucide-react';

const CaptainRidingContent = () => {
    const searchParams = useSearchParams();
    const rideId = searchParams.get('rideId');
    const [otp, setOtp] = useState('');
    const [ride, setRide] = useState<any>(null);
    const [rideStatus, setRideStatus] = useState<'approaching' | 'waiting' | 'in-progress'>('approaching');
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const { socket } = useContext(SocketDataContext);
    const { captain } = useContext(CaptainDataContext);
    const router = useRouter();

    useEffect(() => {
        const fetchRide = async () => {
            try {
                if (rideId) {
                    const response = await axios.get(`/api/rides/details?rideId=${rideId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (response.data) {
                        setRide(response.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching ride:", err);
            }
        };
        fetchRide();

        let watchId: number;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation([latitude, longitude]);
                if (socket) {
                    socket.emit('update-location-captain', {
                        userId: captain?._id,
                        location: { ltd: latitude, lng: longitude }
                    });
                }
            }, (err) => console.error(err), { enableHighAccuracy: true });
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [rideId, socket, captain]);

    const startRide = async () => {
        try {
            const response = await axios.get('/api/rides/start-ride', {
                params: { rideId, otp },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.status === 200) {
                setRideStatus('in-progress');
            }
        } catch (error) {
            console.error("Error starting ride:", error);
            alert("Invalid OTP or error starting ride.");
        }
    };

    const endRide = async () => {
        try {
            const response = await axios.post('/api/rides/end-ride', { rideId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.status === 200) {
                router.push('/captain-home');
            }
        } catch (error) {
            console.error("Error ending ride:", error);
            alert("Error ending ride");
        }
    };

    return (
        <div className='h-screen relative overflow-hidden bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900'>
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Central Intelligence Map */}
            <div className='absolute inset-0 z-0 bg-slate-100'>
                <LiveTracking
                    pickupLocation={currentLocation}
                    dropLocation={ride?.destinationLocation?.coordinates ? [ride.destinationLocation.coordinates[1], ride.destinationLocation.coordinates[0]] : null}
                    route={[]}
                />
            </div>

            {/* Captain HUD (Top) */}
            <header className='absolute top-0 left-0 w-full z-[60] p-6 md:p-10 flex justify-between items-start pointer-events-none'>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='bg-white/95 backdrop-blur-2xl px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] border border-slate-100 pointer-events-auto flex items-center gap-6'
                >
                    <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-100">
                        <Navigation className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block mb-2">Protocol Active</span>
                        <p className="text-base font-black text-slate-900 flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                           {rideStatus === 'approaching' ? 'Rendezvous Mode' : 'Transit Stream'}
                        </p>
                    </div>
                </motion.div>

                <div className="flex gap-4 pointer-events-auto">
                    <button
                        onClick={() => router.push(`/messages?partnerId=${ride?.user?._id}&partnerType=user&partnerName=${ride?.user?.fullname?.firstname}&rideId=${ride?._id}`)}
                        className="bg-white/95 backdrop-blur-2xl w-16 h-16 rounded-[2rem] flex items-center justify-center text-slate-400 border border-slate-100 shadow-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95"
                    >
                        <MessageSquare className="w-6 h-6" />
                    </button>
                    <button className="bg-white/95 backdrop-blur-2xl w-16 h-16 rounded-[2rem] flex items-center justify-center text-slate-400 border border-slate-100 shadow-2xl hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95">
                        <ShieldCheck className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mission Management (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full z-[50] p-0 md:p-8 pointer-events-none">
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-xl mx-auto bg-white rounded-t-[3.5rem] md:rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] pointer-events-auto p-12 md:p-14 border border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>

                    {/* Passenger Profile Segment */}
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-7">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 p-1 border-2 border-slate-100 shadow-inner overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover rounded-[2rem]" alt="User" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg text-white">
                                    <Star className="w-3.5 h-3.5 fill-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 leading-none">{ride?.user?.fullname?.firstname || 'Passenger'}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 uppercase tracking-widest">Verified Target</span>
                                    <div className="w-px h-3 bg-slate-100"></div>
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Loyalty: Platinum</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contract Yield</span>
                            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">₹{ride?.fare || '0'}</h2>
                        </div>
                    </div>

                    {rideStatus === 'approaching' ? (
                        /* INITIAL AUTHORIZATION */
                        <div className="space-y-8">
                            <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 relative group overflow-hidden shadow-inner">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-6 text-center">Secure Identity Authentication</span>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-300" />
                                    <input
                                        type="text"
                                        placeholder="0000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-white border-2 border-transparent text-slate-900 font-extrabold text-center text-5xl py-8 rounded-[2.5rem] focus:border-indigo-600 focus:bg-white outline-none transition-all placeholder:text-slate-100 tracking-[0.5em] shadow-xl"
                                        maxLength={4}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01, backgroundColor: '#059669' }}
                                whileTap={{ scale: 0.99 }}
                                onClick={startRide}
                                disabled={otp.length !== 4}
                                className="w-full py-8 bg-emerald-600 text-white rounded-[3rem] font-black flex items-center justify-center gap-5 transition-all uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-100 disabled:opacity-20 transition-all"
                            >
                                START MISSION FLOW <ArrowRight className="w-6 h-6" />
                            </motion.button>
                        </div>
                    ) : (
                        /* IN-TRANSIT OBJECTIVES */
                        <div className="space-y-8">
                            <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 flex gap-8 items-center relative group shadow-inner">
                                <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-xl shadow-indigo-100">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Final Coordinates</span>
                                    <p className="text-xl font-black text-slate-900 leading-tight tracking-tight line-clamp-2">{ride?.destination || 'Primary Destination'}</p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01, backgroundColor: '#e11d48' }}
                                whileTap={{ scale: 0.99 }}
                                onClick={endRide}
                                className="w-full py-8 bg-rose-600 text-white rounded-[3rem] font-black flex items-center justify-center gap-5 transition-all uppercase tracking-widest text-[11px] shadow-2xl shadow-rose-100"
                            >
                                CLOSE ASSIGNMENT <CheckCircle2 className="w-6 h-6" />
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Grain Layer */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

const CaptainRiding = () => {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-slate-50 flex items-center justify-center text-indigo-600"><div className="w-12 h-12 rounded-full border-[6px] border-indigo-600 border-t-transparent animate-spin"></div></div>}>
            <CaptainRidingContent />
        </Suspense>
    );
}

export default CaptainRiding;
