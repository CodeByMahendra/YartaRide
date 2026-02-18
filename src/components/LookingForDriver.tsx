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
        <div className="flex flex-col flex-1 min-h-0 relative overflow-hidden font-sans p-4 md:p-5">
            {/* Background Atmosphere */}
            <div className="absolute top-[-5%] right-[-10%] w-[60%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]"></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="space-y-0.5">
                    <h3 className='text-[28px] font-black text-slate-900 tracking-tighter leading-none'>Seeking.</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="w-1 h-2.5 bg-indigo-600 rounded-full opacity-60"></div>
                            ))}
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contacting Captains</span>
                    </div>
                </div>
                <button
                    onClick={() => setVehicleFound(false)}
                    className="h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl active:scale-95 transition-all"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar relative z-10 py-1">
                {/* Compact Signal Radar */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-6 mx-auto">
                    <div className="absolute inset-0 border border-slate-100 rounded-full opacity-30"></div>
                    <div className="absolute inset-4 border border-slate-100 rounded-full opacity-20"></div>

                    <div className="relative z-10 w-24 h-24 bg-white rounded-[2rem] shadow-lg flex items-center justify-center border border-slate-50">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center"
                        >
                            <Compass className="w-6 h-6 text-white" />
                        </motion.div>
                    </div>
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
                <div className="text-center space-y-2 mb-6">
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">Finding your ride...</h4>
                    <p className="text-slate-400 font-bold text-[8px] uppercase tracking-widest leading-none">
                        Syncing Fleet <span className="mx-2 opacity-50">|</span> <span className="text-indigo-600">Route Locked</span>
                    </p>
                </div>

                {/* Exclusive Trip Summary Pass */}
                <div className="w-full relative">
                    <div className="relative bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm flex flex-col gap-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <h5 className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Arrival</h5>
                                    <p className="text-[12px] font-black text-slate-800 truncate max-w-[120px]">{destination}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h5 className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Priority Fare</h5>
                                <p className="text-xl font-black text-slate-900 tracking-tighter leading-none mt-0.5">₹{fare?.fares && vehicleType ? fare.fares[vehicleType] : 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-5 flex flex-col gap-4 relative z-10">
                <button
                    onClick={() => setVehicleFound(false)}
                    className="w-full bg-slate-900 text-white rounded-[1.25rem] py-5 font-black flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] shadow-lg uppercase tracking-widest text-[9px]"
                >
                    Cancel Request
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
