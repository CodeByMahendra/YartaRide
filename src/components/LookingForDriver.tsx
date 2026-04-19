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
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header / Handle */}
            <div className="flex flex-col items-center pt-3 pb-6 px-6">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-6"></div>
                <div className="w-full flex justify-between items-start">
                    <div>
                        <h3 className='text-3xl font-black text-slate-900 tracking-tighter leading-none'>Searching.</h3>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="flex gap-1.5 items-center">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [6, 12, 6], opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1 bg-indigo-600 rounded-full"
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Assigning Mission</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setVehicleFound(false)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 relative flex flex-col items-center justify-center px-8">
                {/* Advanced Radar Matrix */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.6, opacity: [0, 0.25, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
                            className="absolute inset-0 border-2 border-indigo-500 rounded-full"
                        />
                    ))}

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-r-4 border-indigo-500/30 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.2)]"
                        style={{ filter: 'blur(20px)' }}
                    />

                    <div className="relative z-10 w-36 h-36 bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex items-center justify-center border border-slate-100 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white"></div>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative z-10"
                        >
                            <Compass className="w-14 h-14 text-indigo-600 drop-shadow-xl" />
                        </motion.div>
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-indigo-600/10">
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="h-full w-1/2 bg-indigo-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12 space-y-4">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Scanning Fleet...</h4>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Optimal Route Detected
                    </p>
                </div>
            </div>

            <div className="p-8 space-y-6">
                {/* Data Transparency Card */}
                <div className="bg-slate-50/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-100 shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 flex-shrink-0">
                                <MapPin className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="min-w-0">
                                <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Target Mission</h5>
                                <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{destination}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h5 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] mb-1">Auth Fare</h5>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{fare?.fares && vehicleType ? fare.fares[vehicleType] : 0}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-200/50">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-white shadow-sm border-2 border-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Fleet Nearby</p>
                        </div>
                        <ShieldCheck className="w-6 h-6 text-emerald-500 opacity-30" />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setVehicleFound(false)}
                    className="w-full bg-slate-900 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-4 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[11px]"
                >
                    <X className="w-5 h-5" />
                    Terminate Request
                </motion.button>
            </div>
        </div>
    );
};

export default LookingForDriver;
