'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocketDataContext } from '@/context/SocketContext';
import LiveTracking from '@/components/LiveTracking';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, MessageSquare, ShieldCheck, MapPin,
    Navigation, Timer, Star, CheckCircle2, ChevronUp,
    Shield, Wallet, ArrowRight, Share2, AlertTriangle,
    X, ThumbsUp
} from 'lucide-react';

const Riding = () => {
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
        // Fetch ride details if needed or wait for socket update
        if (socket) {
            socket.on('ride-started', (data: any) => {
                setRide(data);
            });

            socket.on('ride-ended', () => {
                setRatingModal(true);
            });

            socket.on('update-location-captain', (data: any) => {
                const { location } = data;
                setCaptainLocation([location.ltd, location.lng]);
            });
        }
        return () => {
            socket?.off('ride-started');
            socket?.off('ride-ended');
            socket?.off('update-location-captain');
        };
    }, [socket, router]);

    return (
        <div className='h-screen relative overflow-hidden bg-[#fafbff] font-sans'>

            {/* Live Map Background (Full Screen) */}
            <div className='absolute inset-0 z-0'>
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
                    className="mx-auto max-w-sm bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-4 flex items-center justify-between pointer-events-auto border border-white/10 shadow-2xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                            <Navigation className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Mission Status</h5>
                            <p className="text-sm font-black text-white italic">In-Transit</p>
                        </div>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/5">
                        <span className="text-emerald-400 font-black text-sm">8 min left</span>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Panel - Dynamic Overlay */}
            <div className="absolute bottom-0 left-0 w-full z-[50] p-6 pointer-events-none">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md mx-auto bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] pointer-events-auto p-10 border border-slate-100 relative overflow-hidden"
                >
                    {/* Visual Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
                        <motion.div
                            initial={{ width: "30%" }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-r-full"
                        />
                    </div>

                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">On My Way.</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Safety Shield Active</span>
                            </div>
                        </div>
                        <button className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90">
                            <Phone className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Captain & Vehicle Card (Glassmorphism inside) */}
                    <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden mb-8 group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/10 p-1">
                                    <img className="w-full h-full object-cover rounded-2xl" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop" alt="Captain" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-black">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xl font-black tracking-tight">{ride?.captain?.fullname?.firstname || "Captain Jack"}</h4>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Verified Elite Partner</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-black text-yellow-500">4.9</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none">Plate</span>
                                        <p className="text-sm font-black mt-0.5">{ride?.captain?.vehicle?.plate || "UP-14-AA-0001"}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest leading-none">Model</span>
                                        <p className="text-sm font-black mt-0.5">{ride?.captain?.vehicle?.color || "Silver"} {ride?.captain?.vehicle?.vehicleType || "Luxe"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Destination Highlight */}
                    <div className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Drop-off</h5>
                            <p className="font-black text-slate-800 line-clamp-2 leading-tight">Sector 62, Noida, Uttar Pradesh, 201309</p>
                        </div>
                    </div>

                    {/* Quick Safety Actions */}
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setShowSOS(true)}
                            className="flex items-center justify-center gap-3 py-5 bg-red-50 border-2 border-red-100 rounded-3xl font-black text-xs uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        >
                            <AlertTriangle className="w-4 h-4" /> SOS Alert
                        </button>
                        <button className="flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-indigo-100">
                            <Share2 className="w-4 h-4" /> Share Link
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* SOS Overlay Modal */}
            <AnimatePresence>
                {showSOS && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-red-600/90 backdrop-blur-xl flex items-center justify-center p-8"
                    >
                        <div className="text-center max-w-sm">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-red-600 mx-auto mb-8 shadow-2xl animate-pulse">
                                <AlertTriangle className="w-12 h-12" />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Emergency Protocol!</h2>
                            <p className="text-red-100 font-medium mb-12">System will notify Admin and Local Authorities with your live location. Do you wish to proceed?</p>
                            <div className="space-y-4">
                                <button className="w-full py-6 bg-white text-red-600 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-100">CONFIRM EMERGENCY</button>
                                <button onClick={() => setShowSOS(false)} className="w-full py-6 bg-white/10 text-white border border-white/20 rounded-[2rem] font-black uppercase tracking-widest">CANCEL</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rating Modal */}
            <AnimatePresence>
                {ratingModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-8"
                    >
                        <div className="bg-white rounded-[4rem] p-12 max-w-md w-full text-center shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-slate-100 relative">
                            <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-8">
                                <ThumbsUp className="w-10 h-10" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Ride Finished!</h2>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 mb-10">Rate your experience with {ride?.captain?.fullname?.firstname || "Jack"}</p>

                            <div className="flex justify-center gap-3 mb-12">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s} onClick={() => setRating(s)}
                                        className={`transition-all ${rating >= s ? 'text-yellow-400 scale-125' : 'text-slate-100'}`}
                                    >
                                        <Star className="w-10 h-10 fill-current" />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => router.push('/home')}
                                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl"
                            >
                                Submit & Exit
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Noise Layer */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default Riding;
