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
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Context Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className='text-3xl font-black text-slate-900 tracking-tighter'>Incoming.</h3>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Captain Arriving</span>
                        </div>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">≈ 4 Mins</span>
                    </div>
                </div>
                <button
                    onClick={() => setWaitingForDriver(false)}
                    className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-lg active:scale-95"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                {/* Elite Captain Card */}
                <div className="bg-[#0a0a0b] rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(79,70,229,0.4)]">
                    {/* Ambient Light Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full -ml-24 -mb-24 blur-[60px]"></div>

                    <div className="flex flex-col items-center relative z-10 text-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 p-1.5 ring-4 ring-white/5 shadow-2xl overflow-hidden">
                                <img
                                    className="w-full h-full object-cover rounded-[2rem] grayscale-[0.2] group-hover:grayscale-0 transition-all"
                                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop"
                                    alt="Captain"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-black shadow-lg">
                                <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-black border-2 border-emerald-500 rounded-full" />
                            </div>
                        </div>

                        <h4 className="text-3xl font-black tracking-tight">{ride?.captain?.fullname?.firstname}</h4>
                        <div className="flex items-center gap-3 mt-2 text-yellow-400">
                            <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                <Star className="w-3 h-3 fill-yellow-400" />
                                <span className="text-xs font-black">4.9</span>
                            </div>
                            <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Verified Elite</span>
                        </div>

                        {/* Vehicle Identity Line */}
                        <div className="mt-10 w-full grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                            <div className="text-left border-r border-white/5 pr-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">License Plate</h5>
                                <h4 className="text-xl font-black text-white leading-none tracking-tighter uppercase">{ride?.captain?.vehicle?.plate}</h4>
                            </div>
                            <div className="text-right pl-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Car Model</h5>
                                <h4 className="text-lg font-black text-indigo-400 leading-none truncate">{ride?.captain?.vehicle?.color} {ride?.captain?.vehicle?.vehicleType}</h4>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="mt-10 flex gap-4 relative z-10">
                        <button className="flex-1 bg-white text-[#0a0a0b] rounded-[2rem] py-5 font-black flex items-center justify-center gap-3 hover:bg-slate-100 transition-all border border-white active:scale-95 shadow-xl shadow-white/5">
                            <Phone className="w-4 h-4 fill-current" /> Call
                        </button>
                        <button className="flex-1 bg-white/5 text-white rounded-[2rem] py-5 font-black flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/10 active:scale-95">
                            <MessageSquare className="w-4 h-4" /> Message
                        </button>
                    </div>
                </div>

                {/* Ride Security Protocol */}
                <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h5 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mb-1">Your Mission Code</h5>
                            <h4 className="text-4xl font-black tracking-tighter">OTP: {ride?.otp}</h4>
                        </div>
                        <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-indigo-400 shadow-2xl">
                            <Navigation2 className="w-8 h-8 rotate-45" />
                        </div>
                    </div>
                    <p className="mt-6 text-white/40 text-[10px] font-bold leading-relaxed">Share this only with your verified captain at the start of the trip.</p>
                </div>

                {/* Tracking Timeline */}
                <div className='bg-slate-50 border border-slate-100 rounded-[3rem] p-8 space-y-8'>
                    <div className='flex gap-6 items-start'>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-indigo-600 border border-slate-100">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1'>Boarding Point</h5>
                            <p className='text-sm font-black text-slate-900 leading-tight line-clamp-2'>{ride?.pickup}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Safety Footer */}
            <div className="mt-8 py-6 border-t border-slate-100 flex items-center justify-center gap-4 text-slate-300">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">24/7 Security Operations Center Assigned</span>
            </div>
        </div>
    );
};

export default WaitingForDriver;
