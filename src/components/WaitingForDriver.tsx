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
        <div className="flex flex-col flex-1 min-h-0 font-sans p-4 md:p-5">
            {/* Context Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className='text-xl font-black text-slate-900 tracking-tighter'>Incoming.</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Nearing</span>
                        </div>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">4 Mins</span>
                    </div>
                </div>
                <button
                    onClick={() => setWaitingForDriver(false)}
                    className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                >
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4">
                {/* Elite Captain Card */}
                <div className="bg-[#0a0a0b] rounded-[2rem] p-5 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                    <div className="flex flex-col items-center relative z-10 text-center">
                        <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 p-1 ring-2 ring-white/5 overflow-hidden">
                                <img
                                    className="w-full h-full object-cover rounded-xl"
                                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop"
                                    alt="Captain"
                                />
                            </div>
                        </div>

                        <h4 className="text-xl font-black tracking-tight">{ride?.captain?.fullname?.firstname}</h4>
                        <div className="flex items-center gap-3 mt-1.5 text-yellow-400">
                            <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                <Star className="w-2.5 h-2.5 fill-yellow-400" />
                                <span className="text-[10px] font-black">4.9</span>
                            </div>
                            <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">Elite Verified</span>
                        </div>

                        {/* Vehicle Identity Line */}
                        <div className="mt-6 w-full grid grid-cols-2 gap-3 border-t border-white/5 pt-5">
                            <div className="text-left border-r border-white/5 pr-3">
                                <h5 className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Plate</h5>
                                <h4 className="text-base font-black text-white leading-none tracking-tighter uppercase">{ride?.captain?.vehicle?.plate}</h4>
                            </div>
                            <div className="text-right pl-3">
                                <h5 className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Model</h5>
                                <h4 className="text-sm font-black text-indigo-400 leading-none truncate">{ride?.captain?.vehicle?.vehicleType}</h4>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="mt-6 flex gap-3 relative z-10">
                        <button className="flex-1 bg-white text-black rounded-xl py-4 font-black flex items-center justify-center gap-2 text-[10px] active:scale-95 shadow-lg">
                            <Phone className="w-3.5 h-3.5 fill-current" /> Call
                        </button>
                        <button className="flex-1 bg-white/5 text-white rounded-xl py-4 font-black flex items-center justify-center gap-2 text-[10px] border border-white/10 active:scale-95">
                            <MessageSquare className="w-3.5 h-3.5" /> Text
                        </button>
                    </div>
                </div>

                {/* Ride Security Protocol */}
                <div className="bg-slate-900 rounded-[2rem] p-5 text-white relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h5 className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">Mission Code</h5>
                            <h4 className="text-2xl font-black tracking-tighter uppercase">OTP: {ride?.otp}</h4>
                        </div>
                        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-indigo-400">
                            <Navigation2 className="w-6 h-6 rotate-45" />
                        </div>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div className='bg-slate-50 border border-slate-100 rounded-[1.5rem] p-4 space-y-4'>
                    <div className='flex gap-4 items-start'>
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-indigo-600 border border-slate-100">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h5 className='text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5'>Boarding</h5>
                            <p className='text-[12px] font-black text-slate-900 leading-tight line-clamp-2'>{ride?.pickup}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Safety Footer */}
            <div className="mt-4 py-3 border-t border-slate-100 flex items-center justify-center gap-3 text-slate-300">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">24/7 Security Active</span>
            </div>
        </div>
    );
};

export default WaitingForDriver;
