'use client';
import React from 'react';
import { User, ChevronRight, Zap, Info, ShieldCheck, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface VehiclePanelProps {
    setVehiclePanel: (val: boolean) => void;
    setConfirmRidePanel: (val: boolean) => void;
    selectVehicle: (val: string) => void;
    fare: any;
    rideType: 'private' | 'shared';
    setRideType: (val: 'private' | 'shared') => void;
    seatsRequired: number;
    setSeatsRequired: (val: number) => void;
}

const VehiclePanel = ({
    setVehiclePanel,
    setConfirmRidePanel,
    selectVehicle,
    fare,
    rideType,
    setRideType,
    seatsRequired,
    setSeatsRequired
}: VehiclePanelProps) => {
    const vehicles = [
        {
            id: 'car',
            name: 'Yatra Luxe',
            desc: 'Top-tier comfort, dual-zone AC',
            capacity: 4,
            image: '/images/homePage.png',
            price: rideType === 'shared' ? Math.round((fare?.fares?.car || 0) * 0.75) : (fare?.fares?.car || 0),
            tag: rideType === 'shared' ? '25% Discount' : 'Most Chosen',
            color: 'bg-indigo-600',
            eta: '4 min'
        },
        {
            id: 'auto',
            name: 'Yatra Auto',
            desc: 'Economical city commute',
            capacity: 3,
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
            price: rideType === 'shared' ? Math.round((fare?.fares?.auto || 0) * 0.75) : (fare?.fares?.auto || 0),
            tag: rideType === 'shared' ? 'Eco-Shared' : null,
            eta: '6 min'
        },
        ...(rideType === 'private' ? [{
            id: 'moto',
            name: 'Yatra Moto',
            desc: 'Fastest through heavy traffic',
            capacity: 1,
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
            price: fare?.fares?.moto || 0,
            tag: 'Eco-Fast',
            color: 'bg-emerald-500',
            eta: '2 min'
        }] : [])
    ];

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header / Handle Area */}
            <div className="flex flex-col items-center pt-3 pb-4 px-8">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-8"></div>
                <div className="w-full flex justify-between items-start">
                    <div>
                        <h3 className='text-3xl font-black text-slate-900 tracking-tighter leading-none'>Select Mission.</h3>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Optimized</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{fare?.duration?.text || 'Detecting...'}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setVehiclePanel(false)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                    >
                        <ChevronRight className="w-6 h-6 rotate-90" />
                    </button>
                </div>

                {/* Ride Type Selector */}
                <div className="w-full mt-6 bg-slate-50 p-1.5 rounded-[2rem] flex gap-1.5 border border-slate-100 shadow-inner">
                    <button
                        onClick={() => setRideType('private')}
                        className={`flex-1 py-4 px-6 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${rideType === 'private' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Private Ride
                    </button>
                    <button
                        onClick={() => setRideType('shared')}
                        className={`flex-1 py-4 px-6 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${rideType === 'shared' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Shared Ride
                    </button>
                </div>

                {rideType === 'shared' && (
                    <div className="w-full mt-4 flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seats Required</span>
                        <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                            {[1, 2].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setSeatsRequired(num)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${seatsRequired === num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-white'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

    // Vehicle List
            <div className="space-y-3 px-6 flex-1 overflow-y-auto no-scrollbar pb-8">
                {vehicles.map((v, idx) => (
                    <motion.div
                        key={v.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => {
                            if (v.price !== undefined && !isNaN(v.price)) {
                                setConfirmRidePanel(true);
                                selectVehicle(v.id);
                            }
                        }}
                        className={`group relative flex items-center justify-between p-5 rounded-[2.2rem] border-2 transition-all duration-300 cursor-pointer ${v.price !== undefined && !isNaN(v.price) ? 'bg-white border-slate-50 hover:border-indigo-600 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]' : 'bg-slate-50 border-transparent opacity-50 grayscale cursor-not-allowed'}`}
                    >
                        {/* Status Badge */}
                        {v.tag && v.price !== undefined && !isNaN(v.price) && (
                            <div className={`absolute -top-2.5 left-8 px-4 py-1.5 ${v.color || 'bg-slate-900'} text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg border-2 border-white z-10`}>
                                {v.tag}
                            </div>
                        )}

                        <div className="flex items-center gap-6">
                            <div className="w-24 h-20 bg-slate-50 rounded-[1.8rem] flex items-center justify-center p-3 group-hover:bg-indigo-50 transition-colors relative overflow-hidden">
                                <motion.img
                                    whileHover={{ scale: 1.15, rotate: -3 }}
                                    src={v.image}
                                    alt={v.name}
                                    className="max-h-full max-w-full object-contain relative z-10 drop-shadow-xl"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            <div>
                                <h4 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                                    {v.name}
                                    {v.id === 'car' && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                </h4>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-lg">
                                        <User className="w-3 h-3 text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500">{v.capacity}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-lg">
                                        <Timer className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-600">{v.eta}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right pr-4">
                            {v.price !== undefined && !isNaN(v.price) ? (
                                <>
                                    {v.price === 0 && fare?.passUsed ? (
                                        <>
                                            <div className="text-xl font-black text-emerald-500 tracking-tight">FREE</div>
                                            <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-0.5">Pass Applied</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-2xl font-black text-slate-900 tracking-tight">₹{v.price}</div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Premium Rail</div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="h-10 w-20 bg-slate-100 animate-pulse rounded-2xl"></div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Loyalty / Trust Footer */}
            <div className="px-6 pb-8 pt-4">
                <div className="bg-slate-900 rounded-[2.5rem] p-6 flex items-center gap-5 shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl transition-transform group-hover:scale-150 duration-1000"></div>

                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-inner">
                        <ShieldCheck className="w-7 h-7" />
                    </div>

                    <div className="flex-1">
                        <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Safety Certified</h5>
                        <p className="text-xs font-bold text-white leading-tight">
                            Every trip is backed by <span className="text-indigo-400">Guardian Protocol</span>. 24/7 active response.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehiclePanel;
