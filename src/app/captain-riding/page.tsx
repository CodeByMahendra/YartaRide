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
        // Fetch ride details if needed
        const fetchRide = async () => {
            try {
                if (rideId) {
                    const response = await axios.get(`/api/rides/details?rideId=${rideId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
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

        // Track live location during ride
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
                params: {
                    rideId,
                    otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
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
            const response = await axios.post('/api/rides/end-ride', {
                rideId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
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
        <div className='h-screen relative overflow-hidden bg-slate-950 font-sans'>

            {/* Dark Mode Map for Captain */}
            <div className='absolute inset-0 z-0 opacity-100 bg-slate-900'>
                <LiveTracking
                    pickupLocation={currentLocation}
                    dropLocation={ride?.destinationLocation ? [ride.destinationLocation.ltd, ride.destinationLocation.lng] : null}
                    route={[]}
                />
            </div>

            {/* Captain Mission Control (Top) */}
            <div className="absolute top-0 left-0 w-full z-[60] p-4 md:p-6 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                        <div className="bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-4 flex items-center gap-4 pointer-events-auto border border-indigo-500/20 shadow-2xl shadow-black/50">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                <Navigation className="w-6 h-6" />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Objective</h5>
                                <p className="text-sm font-black text-white mt-1">
                                    {rideStatus === 'approaching' ? 'Pick up Passenger' : 'Navigate to Drop'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push(`/messages?partnerId=${ride?.user?._id}&partnerType=user&partnerName=${ride?.user?.fullname?.firstname}&rideId=${ride?._id}`)}
                            className="bg-slate-900/90 backdrop-blur-xl w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-indigo-400 border border-indigo-500/20 pointer-events-auto shadow-xl hover:bg-indigo-600 hover:text-white transition-all">
                            <MessageSquare className="w-6 h-6" />
                        </button>
                    </div>

                    <button className="bg-slate-900/90 backdrop-blur-xl w-14 h-14 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/20 pointer-events-auto shadow-xl hover:bg-rose-500 hover:text-white transition-all">
                        <ShieldCheck className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Captain Action Panel (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full z-[50] p-0 md:p-6 pointer-events-none">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-black/60 pointer-events-auto p-6 md:p-8 border border-indigo-500/20 relative overflow-hidden"
                >
                    {/* Passenger Info Header */}
                    <div className="flex justify-between items-center mb-8 border-b border-indigo-500/10 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-[1.2rem] bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">{ride?.user?.fullname?.firstname || 'Passenger'}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-500/20">CASH RIDE</span>
                                    <span className="text-slate-500 text-xs font-bold">4.8 ★</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-black text-white">₹{ride?.fare || '...'}</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Est. Earnings</p>
                        </div>
                    </div>

                    {rideStatus === 'approaching' ? (
                        /* START RIDE SECTION */
                        <div className="space-y-6">
                            <div className="bg-slate-950 p-5 rounded-[2rem] border border-slate-800">
                                <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Verify Passenger</h5>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter 4-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-slate-900 border-2 border-slate-800 text-white font-black text-center text-lg py-4 rounded-xl focus:border-indigo-500 focus:bg-slate-950 outline-none transition-all placeholder:text-slate-700 tracking-[0.5em]"
                                        maxLength={4}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={startRide}
                                disabled={otp.length !== 4}
                                className="w-full p-1 rounded-[2.5rem] bg-slate-800 disabled:opacity-50 transition-all border border-slate-700 group"
                            >
                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-[2rem] py-4 font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all uppercase tracking-widest text-sm">
                                    Start Mission <ArrowRight className="w-5 h-5" />
                                </div>
                            </button>
                        </div>
                    ) : (
                        /* IN RIDE SECTION */
                        <div className="space-y-6">
                            <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400 mt-1">
                                    <Navigation className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Drop Location</h5>
                                    <p className="text-md font-bold text-white leading-snug">{ride?.destination || 'Destination'}</p>
                                </div>
                            </div>

                            <button
                                onClick={endRide}
                                className="w-full p-1 rounded-[2.5rem] bg-slate-800 transition-all border border-slate-700 group"
                            >
                                <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-[2rem] py-4 font-black flex items-center justify-center gap-3 shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all uppercase tracking-widest text-sm">
                                    Complete Mission <CheckCircle2 className="w-5 h-5" />
                                </div>
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

const CaptainRiding = () => {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-slate-950 flex items-center justify-center text-indigo-500"><div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div></div>}>
            <CaptainRidingContent />
        </Suspense>
    );
}

export default CaptainRiding;
