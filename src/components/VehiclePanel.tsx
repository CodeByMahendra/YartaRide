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
            {/* Header */}
            <div className="flex flex-col pt-2 pb-3 px-5">
                <div className="w-full flex justify-between items-center mb-3">
                    <div>
                        <h3 className='text-lg font-bold text-slate-900 tracking-tight'>Select Your Ride</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">Route optimized</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                            <span className="text-xs font-semibold text-indigo-500">{fare?.duration?.text || 'Detecting...'}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setVehiclePanel(false)}
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                    >
                        <ChevronRight className="w-5 h-5 rotate-90" />
                    </button>
                </div>

                {/* Ride Type Selector */}
                <div className="w-full bg-slate-100 p-1 rounded-2xl flex gap-1">
                    <button
                        onClick={() => setRideType('private')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${rideType === 'private' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        Private
                    </button>
                    <button
                        onClick={() => setRideType('shared')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${rideType === 'shared' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        Shared
                    </button>
                </div>

                {rideType === 'shared' && (
                    <div className="w-full mt-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Seats needed</span>
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            {[1, 2].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setSeatsRequired(num)}
                                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${seatsRequired === num ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Vehicle List */}
            <div className="space-y-2 px-4 flex-1 overflow-y-auto no-scrollbar pb-4">
                {vehicles.map((v, idx) => (
                    <motion.div
                        key={v.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        onClick={() => {
                            if (v.price !== undefined && !isNaN(v.price)) {
                                setConfirmRidePanel(true);
                                selectVehicle(v.id);
                            }
                        }}
                        className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${v.price !== undefined && !isNaN(v.price) ? 'bg-white border-slate-100 hover:border-indigo-500 hover:shadow-md active:scale-[0.98]' : 'bg-slate-50 border-transparent opacity-50 grayscale cursor-not-allowed'}`}
                    >
                        {/* Badge */}
                        {v.tag && v.price !== undefined && !isNaN(v.price) && (
                            <div className={`absolute -top-2 left-4 px-2.5 py-0.5 ${v.color || 'bg-slate-800'} text-white text-[9px] font-bold uppercase tracking-wide rounded-full z-10`}>
                                {v.tag}
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <div className="w-16 h-14 bg-slate-50 rounded-xl flex items-center justify-center p-2 group-hover:bg-indigo-50 transition-colors">
                                <img
                                    src={v.image}
                                    alt={v.name}
                                    className="max-h-full max-w-full object-contain drop-shadow-sm"
                                />
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                    {v.name}
                                    {v.id === 'car' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded-md">
                                        <User className="w-2.5 h-2.5 text-slate-400" />
                                        <span className="text-[10px] font-semibold text-slate-500">{v.capacity}</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 rounded-md">
                                        <Timer className="w-2.5 h-2.5 text-emerald-500" />
                                        <span className="text-[10px] font-semibold text-emerald-600">{v.eta}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            {v.price !== undefined && !isNaN(v.price) ? (
                                <>
                                    {v.price === 0 && fare?.passUsed ? (
                                        <>
                                            <div className="text-base font-bold text-emerald-500">FREE</div>
                                            <div className="text-[9px] text-emerald-400 uppercase tracking-wide mt-0.5">Pass Applied</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-base font-bold text-slate-900">₹{v.price}</div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Base fare</div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg"></div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Safety Footer */}
            <div className="px-4 pb-4 pt-2">
                <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Safety Certified</h5>
                        <p className="text-xs text-white/70 leading-tight">
                            Every trip is backed by <span className="text-indigo-400">Guardian Protocol</span>. 24/7 support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehiclePanel;
