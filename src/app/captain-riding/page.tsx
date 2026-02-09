'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocketDataContext } from '@/context/SocketContext';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import LiveTracking from '@/components/LiveTracking';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, Navigation, MapPin,
    ShieldCheck, CheckCircle2, ChevronUp,
    Lock, ArrowRight, User, Timer, Star
} from 'lucide-react';

const CaptainRiding = () => {
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
                const response = await axios.get(`/api/rides/details?rideId=${rideId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRide(response.data);
            } catch (err) {
                console.error("Error fetching ride:", err);
            }
        };
        if (rideId) fetchRide();

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
            });
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [rideId, socket, captain]);

    const startRide = async () => {
        try {
            const response = await axios.get(`/api/rides/start-ride`, {
                params: { rideId, otp },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.status === 200) {
                setRideStatus('in-progress');
            }
        } catch (error) {
            alert("Invalid OTP. Verification failed.");
        }
    };

    const endRide = async () => {
        try {
            await axios.post(`/api/rides/end-ride`, { rideId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            router.push('/captain-home');
        } catch (error) {
            console.error("Error ending ride:", error);
        }
    };

    return (
        <div className='h-screen relative overflow-hidden bg-[#0a0a0b] font-sans'>

            {/* Dark Mode Map for Captain */}
            <div className='absolute inset-0 z-0 opacity-80'>
                <LiveTracking
                    pickupLocation={currentLocation}
                    dropLocation={ride?.destinationLocation ? [ride.destinationLocation.ltd, ride.destinationLocation.lng] : null}
                    route={[]}
                />
            </div>

            {/* Captain Mission Control (Top) */}
            <div className="absolute top-0 left-0 w-full z-[60] p-6 pointer-events-none">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mx-auto max-w-sm bg-black/90 backdrop-blur-3xl rounded-[2.5rem] p-5 flex items-center justify-between pointer-events-auto border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10">
                            <Navigation className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Active Mission</h5>
                            <p className="text-sm font-black text-white italic mt-1">
                                {rideStatus === 'approaching' ? 'Heading to Pickup' : rideStatus === 'waiting' ? 'At Pickup Point' : 'In-Transit to Destination'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Action Sheet */}
            <div className="absolute bottom-0 left-0 w-full z-[50] p-6 pointer-events-none">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md mx-auto bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] pointer-events-auto p-10 border border-slate-100"
                >
                    {rideStatus !== 'in-progress' ? (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Identity Lock.</h3>
                                    <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Awaiting OTP from User</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600 border border-indigo-100">
                                    <Lock className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Rider Mini-Profile */}
                            <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
                                    {ride?.user?.fullname?.firstname?.charAt(0) || "U"}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-900 text-lg tracking-tight">{ride?.user?.fullname?.firstname || "The Rider"}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">High-Value Commuter</span>
                                    </div>
                                </div>
                                <button className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 border border-slate-100 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                                    <Phone className="w-5 h-5" />
                                </button>
                            </div>

                            {/* OTP Input Field */}
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Authentication Token</label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="----"
                                    className="w-full text-center text-5xl font-black py-8 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[2.5rem] text-slate-900 tracking-[0.5em] transition-all outline-none placeholder:text-slate-200"
                                />
                            </div>

                            <button
                                onClick={startRide}
                                className="w-full bg-slate-900 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] shadow-2xl shadow-indigo-100 uppercase tracking-widest text-xs"
                            >
                                Verify & Authorize Ride <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center text-emerald-600 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black tracking-tighter">Ride In Progress</h4>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Safe Link Active</span>
                            </div>

                            {/* Destination Card */}
                            <div className="flex items-center gap-6 p-8 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex-1 relative z-10">
                                    <h5 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Target Coordinates</h5>
                                    <p className="font-black text-white line-clamp-2 leading-tight">{ride?.destination}</p>
                                </div>
                            </div>

                            <button
                                onClick={endRide}
                                className="w-full bg-rose-600 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:bg-rose-700 transition-all active:scale-[0.98] shadow-2xl shadow-rose-100 uppercase tracking-widest text-xs"
                            >
                                Mark Trip as Finished
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default CaptainRiding;
