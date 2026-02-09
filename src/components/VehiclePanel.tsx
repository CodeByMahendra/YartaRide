'use client';
import React from 'react';
import { User, ChevronRight, Zap, Info, ShieldCheck, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface VehiclePanelProps {
    setVehiclePanel: (val: boolean) => void;
    setConfirmRidePanel: (val: boolean) => void;
    selectVehicle: (val: string) => void;
    fare: any;
}

const VehiclePanel = ({ setVehiclePanel, setConfirmRidePanel, selectVehicle, fare }: VehiclePanelProps) => {
    const vehicles = [
        {
            id: 'car',
            name: 'Yatra Luxe',
            desc: 'Top-tier comfort, dual-zone AC',
            capacity: 4,
            image: '/images/homePage.png',
            price: fare?.fares?.car || 0,
            tag: 'Most Chosen',
            color: 'bg-indigo-600',
            eta: '4 min'
        },
        {
            id: 'moto',
            name: 'Yatra Moto',
            desc: 'Fastest through heavy traffic',
            capacity: 1,
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
            price: fare?.fares?.moto || 0,
            tag: 'Eco-Fast',
            color: 'bg-emerald-500',
            eta: '2 min'
        },
        {
            id: 'auto',
            name: 'Yatra Auto',
            desc: 'Economical city commute',
            capacity: 3,
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
            price: fare?.fares?.auto || 0,
            eta: '6 min'
        }
    ];

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className='text-3xl font-black text-slate-900 tracking-tighter'>Fleet.</h3>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            <Zap className="w-3 h-3 text-indigo-600 fill-indigo-600" />
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{fare?.duration?.text}</span>
                        </div>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{fare?.distance?.text} Total Trip</span>
                    </div>
                </div>
                <button
                    onClick={() => setVehiclePanel(false)}
                    className="p-3 bg-slate-100 rounded-[1.2rem] hover:bg-slate-900 hover:text-white transition-all shadow-lg active:scale-95"
                >
                    <ChevronRight className="w-6 h-6 rotate-90" />
                </button>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar pb-8">
                {vehicles.map((v, idx) => (
                    <motion.div
                        key={v.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        onClick={() => {
                            setConfirmRidePanel(true);
                            selectVehicle(v.id);
                        }}
                        className='group relative flex items-center justify-between p-6 bg-slate-50 border-2 border-transparent hover:border-indigo-600 hover:bg-white rounded-[2.5rem] cursor-pointer transition-all shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10'
                    >
                        {v.tag && (
                            <div className={`absolute -top-2 left-8 px-4 py-1.5 ${v.color || 'bg-slate-900'} text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-indigo-100 z-10`}>
                                {v.tag}
                            </div>
                        )}

                        <div className="flex items-center gap-6">
                            <div className="w-24 h-18 flex items-center justify-center p-3 rounded-3xl bg-white shadow-sm border border-slate-100 group-hover:shadow-xl transition-all relative overflow-hidden">
                                <img className='max-h-full max-w-full object-contain relative z-10' src={v.image} alt={v.name} />
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-white opacity-50"></div>
                            </div>
                            <div>
                                <h4 className='font-black text-xl text-slate-900 flex items-center gap-2 tracking-tight'>
                                    {v.name}
                                </h4>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className='flex items-center gap-1 text-[10px] text-slate-400 font-black uppercase tracking-widest'>
                                        <User className="w-3 h-3" /> {v.capacity} Seats
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className='flex items-center gap-1 text-[10px] text-emerald-500 font-black uppercase tracking-widest'>
                                        <Timer className="w-3 h-3" /> {v.eta} ETA
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className='text-2xl font-black text-slate-900 tracking-tighter'>₹{v.price}</h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">Final Fare</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-auto px-6 py-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-indigo-900 leading-relaxed">
                    All rides are insured via <span className="text-indigo-600 font-black">YatraSafe™</span>. Your safety is our obsession.
                </p>
            </div>
        </div>
    );
};

export default VehiclePanel;
