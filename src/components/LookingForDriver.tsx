'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Compass, ShieldCheck, Zap } from 'lucide-react';

interface LookingForDriverProps {
    setVehicleFound: (val: boolean) => void;
    pickup: string;
    destination: string;
    fare: any;
    vehicleType: string | null;
}

const LookingForDriver = ({ setVehicleFound, pickup, destination, fare, vehicleType }: LookingForDriverProps) => {
    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden font-sans">

            {/* Background Atmosphere - Sophisticated Glows */}
            <div className="absolute top-[-5%] right-[-10%] w-[70%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-5%] left-[-10%] w-[60%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]"></div>

            <div className="flex items-start justify-between mb-12 relative z-10">
                <div className="space-y-1">
                    <h3 className='text-[34px] font-black text-slate-900 tracking-tighter leading-none'>Seeking.</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                    className="w-1 h-3 bg-indigo-600 rounded-full"
                                />
                            ))}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Contacting Elite Captains</span>
                    </div>
                </div>
                <button
                    onClick={() => setVehicleFound(false)}
                    className="group relative h-12 w-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-900 transition-all active:scale-95 overflow-hidden"
                >
                    <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors relative z-10" />
                    <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-4">
                {/* Refined Signal Radar */}
                <div className="relative w-72 h-72 flex items-center justify-center mb-10">
                    <div className="absolute inset-0 border border-slate-100 rounded-full opacity-50 scale-[1.1]"></div>
                    <div className="absolute inset-0 border border-slate-100 rounded-full opacity-30 scale-[1.3]"></div>

                    <motion.div
                        animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 bg-indigo-500/10 rounded-full"
                    />

                    <div className="relative z-10 w-36 h-36 bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] flex items-center justify-center border border-slate-50 group">
                        <div className="absolute inset-2 border-2 border-dashed border-indigo-100 rounded-[2.5rem] group-hover:rotate-45 transition-transform duration-1000"></div>
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200"
                        >
                            <Compass className="w-8 h-8 text-white" />
                        </motion.div>

                        {/* Orbiting Elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                        </motion.div>
                    </div>

                    {/* Technical HUD Elements */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-4 h-1 bg-slate-900/5 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                    className="h-full bg-indigo-600 rounded-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center space-y-4 mb-12">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">THE MAGIC IS HAPPENING.</h4>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em]">
                        Syncing Fleet <span className="mx-2 text-slate-200">|</span>
                        <span className="text-indigo-600">Optimal Route Locked</span>
                    </p>
                </div>

                {/* Exclusive Trip Summary Pass */}
                <div className="w-full relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition-opacity blur-lg"></div>
                    <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm flex flex-col gap-6 overflow-hidden">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Destination Reach</h5>
                                    <p className="text-sm font-black text-slate-800 truncate max-w-[140px]">{destination}</p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <h5 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-0.5">Priority Fare</h5>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[10px] font-black text-slate-400">₹</span>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                        {fare?.fares && vehicleType ? fare.fares[vehicleType] : 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dashed Separator */}
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                            <div className="h-[1px] flex-1 border-t border-dashed border-slate-200"></div>
                            <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-300">
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-yellow-400" /> Secure Encryption Active
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Premium Insurance
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 flex flex-col gap-6 relative z-10">
                <button
                    onClick={() => setVehicleFound(false)}
                    className="w-full bg-slate-900 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] uppercase tracking-widest text-xs group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">Cancel Request</span>
                </button>

                <div className="flex items-center justify-center gap-4 text-slate-200 px-8">
                    <div className="h-[1px] flex-1 bg-slate-100"></div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">YatraRide Identity Protection</span>
                    <div className="h-[1px] flex-1 bg-slate-100"></div>
                </div>
            </div>
        </div>
    );
};

export default LookingForDriver;
