'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Star, Shield, MapPin, ChevronDown, CheckCircle2, Navigation2 } from 'lucide-react';

interface WaitingForDriverProps {
    ride: any;
    setVehicleFound: (val: boolean) => void;
    setWaitingForDriver: (val: boolean) => void;
    waitingForDriver: boolean;
}

const WaitingForDriver = ({ ride, setWaitingForDriver }: WaitingForDriverProps) => {
    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header / Handle */}
            <div className="flex flex-col items-center pt-3 pb-6 px-6">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-6"></div>
                <div className="w-full flex justify-between items-start">
                    <div>
                        <h3 className='text-3xl font-black text-slate-900 tracking-tighter leading-none'>Captain Assigned.</h3>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">In Pursuit</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">4.9 Rated</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setWaitingForDriver(false)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 space-y-6">
                {/* Elite Captain Card (Premium Dark Variant) */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 border border-white/5">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>

                    <div className="flex flex-col items-center relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative mb-6"
                        >
                            <div className="w-28 h-28 rounded-[2rem] bg-indigo-600/20 border border-white/20 p-1.5 ring-8 ring-white/5 overflow-hidden shadow-2xl">
                                <img
                                    className="w-full h-full object-cover rounded-[1.8rem] transition-all duration-700 hover:scale-110"
                                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop"
                                    alt="Captain"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-xl">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                        </motion.div>

                        <h4 className="text-3xl font-black tracking-tighter mb-1">{ride?.captain?.fullname?.firstname}</h4>
                        <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Elite Fleet Commander</p>

                        {/* Vehicle Matrix */}
                        <div className="mt-10 w-full grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                            <div className="text-left">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Identification</h5>
                                <h4 className="text-2xl font-black text-white leading-none tracking-tighter uppercase">{ride?.captain?.vehicle?.plate}</h4>
                            </div>
                            <div className="text-right">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Class Type</h5>
                                <h4 className="text-2xl font-black text-indigo-400 leading-none tracking-tighter uppercase">{ride?.captain?.vehicle?.vehicleType}</h4>
                            </div>
                        </div>
                    </div>

                    {/* Hotkey Actions */}
                    <div className="mt-10 flex gap-4 relative z-10">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 bg-white text-slate-900 rounded-2xl py-4.5 font-black flex items-center justify-center gap-3 text-[11px] shadow-xl uppercase tracking-widest"
                        >
                            <Phone className="w-4 h-4 fill-slate-900" /> Comm
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.href = `/messages?partnerId=${ride?.captain?._id}&partnerType=captain&partnerName=${ride?.captain?.fullname?.firstname}&rideId=${ride?._id}`}
                            className="flex-1 bg-white/10 text-white rounded-2xl py-4.5 font-black flex items-center justify-center gap-3 text-[11px] border border-white/10 uppercase tracking-widest"
                        >
                            <MessageSquare className="w-4 h-4" /> Signal
                        </motion.button>
                    </div>
                </div>

                {/* Authorization Protocol */}
                <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h5 className="text-[10px] font-black uppercase text-white/60 tracking-[0.3em] mb-2">Secure Handshake OTP</h5>
                            <h4 className="text-5xl font-black tracking-tighter leading-none">{ride?.otp}</h4>
                        </div>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                {/* Logistics Trace */}
                <div className='bg-slate-50/80 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-8 space-y-6 shadow-inner'>
                    <div className='flex gap-5 items-start'>
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-indigo-500 border border-slate-100">
                            <Navigation2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5'>Extraction Point</h5>
                            <p className='text-sm font-bold text-slate-900 leading-snug line-clamp-2'>{ride?.pickup}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Guarantee Footer */}
            <div className="px-8 pb-10 pt-4">
                <div className="flex items-center justify-center gap-3 px-6 py-2.5 bg-slate-50 rounded-full border border-slate-100">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Titanium Security Guaranteed</span>
                </div>
            </div>
        </div>
    );
};

export default WaitingForDriver;
