'use client';
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocketDataContext } from '@/context/SocketContext';
import axios from 'axios';
import LiveTracking from '@/components/LiveTracking';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, MessageSquare, ShieldCheck, MapPin,
    Navigation, Timer, Star, CheckCircle2, ChevronUp,
    Shield, Wallet, ArrowRight, Share2, AlertTriangle,
    X, ThumbsUp
} from 'lucide-react';

const RidingContent = () => {
    const searchParams = useSearchParams();
    const rideId = searchParams.get('rideId');
    const [ride, setRide] = useState<any>(null);
    const [showSOS, setShowSOS] = useState(false);
    const [ratingModal, setRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [captainLocation, setCaptainLocation] = useState<[number, number] | null>(null);
    const { socket } = useContext(SocketDataContext);
    const router = useRouter();

    useEffect(() => {
        const fetchRide = async () => {
            if (!rideId) return;
            try {
                const res = await axios.get(`/api/rides/details?rideId=${rideId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRide(res.data);
            } catch (err) {
                console.error("Error fetching ride:", err);
            }
        };
        fetchRide();

        if (socket) {
            socket.on('ride-started', (data: any) => {
                setRide(data);
            });

            socket.on('ride-ended', () => {
                setRatingModal(true);
            });

            socket.on('update-location-captain', (data: any) => {
                if (data.location) {
                    setCaptainLocation([data.location.ltd, data.location.lng]);
                }
            });
        }
        return () => {
            socket?.off('ride-started');
            socket?.off('ride-ended');
            socket?.off('update-location-captain');
        };
    }, [socket, router, rideId]);

    return (
        <div className='h-screen relative overflow-hidden bg-slate-950 font-sans'>

            {/* Live Map Background */}
            <div className='absolute inset-0 z-0 bg-slate-900'>
                <LiveTracking
                    pickupLocation={captainLocation}
                    dropLocation={ride?.destinationLocation ? [ride.destinationLocation.ltd, ride.destinationLocation.lng] : null}
                    route={[]}
                />
            </div>

            {/* Top Navigation Status */}
            <div className="absolute top-0 left-0 w-full z-[60] p-6 pointer-events-none">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mx-auto max-w-sm bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-4 flex items-center justify-between pointer-events-auto border border-indigo-500/20 shadow-2xl shadow-black/50"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <Navigation className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Mission Status</h5>
                            <p className="text-sm font-black text-white italic">In-Transit</p>
                        </div>
                    </div>
                    <div className="bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-500/20">
                        <span className="text-indigo-400 font-black text-sm">8 min left</span>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Panel - Dynamic Overlay */}
            <div className="absolute bottom-0 left-0 w-full z-[50] p-0 md:p-6 pointer-events-none">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-black/60 pointer-events-auto p-6 md:p-10 border border-indigo-500/20 relative overflow-hidden"
                >
                    {/* Visual Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
                        <motion.div
                            initial={{ width: "30%" }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                    </div>

                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-500/20">
                                <ShieldCheck className="w-3 h-3" /> Secure Ride
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">On Route.</h2>
                            <p className="text-slate-500 font-bold text-xs mt-1">Arriving at destination shortly</p>
                        </div>
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 border-2 border-indigo-500/20 overflow-hidden shadow-xl shadow-black/40">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop" alt="Captain" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 text-center hover:border-indigo-500/30 transition-colors">
                            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Vehicle</h5>
                            <p className="text-white font-bold">{ride?.captain?.vehicle?.plate || 'MP09 AB 1234'}</p>
                            <p className="text-[10px] text-slate-500 mt-1">{ride?.captain?.vehicle?.model || 'Suzuki Swift'}</p>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 text-center hover:border-indigo-500/30 transition-colors">
                            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Captain</h5>
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-white font-bold">{ride?.captain?.fullname?.firstname || 'Sarthak'}</span>
                                <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                                <span className="text-xs text-indigo-400 font-bold">4.9</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 rounded-[2.5rem] p-6 border border-slate-800 mb-8">
                        <div className="flex gap-4 items-start relative pb-6 border-b border-dashed border-slate-800">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 mt-1">
                                <MapPin className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Destination</h5>
                                <p className="text-sm font-bold text-white leading-snug">{ride?.destination || 'Phoenix Citadel Mall, Indore, MP'}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <div className="text-left">
                                <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Fare</h5>
                                <span className="text-lg font-black text-white">₹{ride?.fare || '...'}</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="text-right">
                                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Payment</h5>
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                        Cash <Wallet className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all active:scale-95 text-xs uppercase tracking-widest">
                            <Phone className="w-4 h-4" /> Call
                        </button>
                        <button
                            onClick={() => router.push(`/messages?partnerId=${ride?.captain?._id}&partnerType=captain&partnerName=${ride?.captain?.fullname?.firstname}&rideId=${ride?._id}`)}
                            className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all active:scale-95 text-xs uppercase tracking-widest"
                        >
                            <MessageSquare className="w-4 h-4" /> Chat
                        </button>
                        <button
                            onClick={() => setShowSOS(true)}
                            className="w-14 py-4 bg-rose-500/10 text-rose-500 rounded-2xl font-bold flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-95 border border-rose-500/20"
                        >
                            <Shield className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            // Make payment logic
                            router.push('/home');
                        }}
                        className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
                    >
                        Make Payment
                    </button>
                </motion.div>
            </div>

            {/* SOS Modal */}
            <AnimatePresence>
                {showSOS && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 text-center border border-rose-500/30 shadow-2xl shadow-rose-900/40 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-rose-500/5 animate-pulse"></div>
                            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 border border-rose-500/30">
                                <AlertTriangle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Emergency SOS</h2>
                            <p className="text-slate-400 text-sm mb-8 font-medium">This will immediately alert our emergency response team and share your live location with authorities.</p>

                            <div className="space-y-3 relative z-10">
                                <button className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2">
                                    <Shield className="w-4 h-4" /> Alert Authorities
                                </button>
                                <button
                                    onClick={() => setShowSOS(false)}
                                    className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 hover:text-white transition-all"
                                >
                                    Cancel Alert
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

const Riding = () => {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-slate-950 flex items-center justify-center text-indigo-500"><div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div></div>}>
            <RidingContent />
        </Suspense>
    );
}

export default Riding;
