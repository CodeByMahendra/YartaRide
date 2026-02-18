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
        <div className="flex flex-col flex-1 min-h-0 p-4 md:p-5">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className='text-xl font-black text-slate-900 tracking-tighter'>Fleet.</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100">
                            <Zap className="w-2.5 h-2.5 text-indigo-600 fill-indigo-600" />
                            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{fare?.duration?.text}</span>
                        </div>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{fare?.distance?.text} Trip</span>
                    </div>
                </div>
                <button
                    onClick={() => setVehiclePanel(false)}
                    className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                >
                    <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
            </div>

            <div className="space-y-4 flex-1 min-h-0 overflow-y-auto no-scrollbar pb-6">
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
                        className='group relative flex items-center justify-between p-4 bg-slate-50 border-2 border-transparent hover:border-indigo-600 hover:bg-white rounded-[1.5rem] cursor-pointer transition-all shadow-sm'
                    >
                        {v.tag && (
                            <div className={`absolute -top-2 left-6 px-3 py-1 ${v.color || 'bg-slate-900'} text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg z-10`}>
                                {v.tag}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <div className="w-16 h-12 flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-100 transition-all relative overflow-hidden">
                                <img className='max-h-full max-w-full object-contain relative z-10' src={v.image} alt={v.name} />
                            </div>
                            <div>
                                <h4 className='font-black text-lg text-slate-900 flex items-center gap-1.5 tracking-tight'>
                                    {v.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className='flex items-center gap-1 text-[8px] text-slate-400 font-black uppercase tracking-widest'>
                                        <User className="w-2.5 h-2.5" /> {v.capacity}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className='flex items-center gap-1 text-[8px] text-emerald-500 font-black uppercase tracking-widest'>
                                        <Timer className="w-2.5 h-2.5" /> {v.eta}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className='text-xl font-black text-slate-900 tracking-tighter'>₹{v.price}</h2>
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Fare</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-auto px-4 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-[9px] font-bold text-indigo-900 leading-relaxed">
                    Insured via <span className="text-indigo-600 font-black">YatraSafe™</span>
                </p>
            </div>
        </div>
    );
};

export default VehiclePanel;
