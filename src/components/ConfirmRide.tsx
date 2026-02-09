'use client';
import React from 'react';
import { MapPin, CreditCard, ChevronLeft, ShieldCheck, Zap, Navigation, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmRideProps {
    setConfirmRidePanel: (val: boolean) => void;
    setVehicleFound: (val: boolean) => void;
    createRide: () => void;
    pickup: string;
    destination: string;
    fare: any;
    vehicleType: string | null;
}

const ConfirmRide = ({ setConfirmRidePanel, setVehicleFound, createRide, pickup, destination, fare, vehicleType }: ConfirmRideProps) => {
    const vehicleInfo = {
        car: { name: 'Yatra Luxe', img: '/images/homePage.png', color: 'from-indigo-600 to-indigo-900' },
        moto: { name: 'Yatra Moto', img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png', color: 'from-emerald-500 to-emerald-800' },
        auto: { name: 'Yatra Auto', img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png', color: 'from-amber-500 to-amber-700' }
    };

    const currentV = vehicleType ? (vehicleInfo as any)[vehicleType] : vehicleInfo.car;

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center gap-6 mb-10">
                <button
                    onClick={() => setConfirmRidePanel(false)}
                    className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-90"
                >
                    <ChevronLeft className="w-6 h-6 text-slate-800" />
                </button>
                <div>
                    <h3 className='text-3xl font-black text-slate-900 tracking-tighter leading-none'>Booking.</h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Ready to authorize</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-10">
                {/* Visual Showcase Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`relative flex flex-col items-center justify-center p-10 bg-gradient-to-br ${currentV.color} rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden`}
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                    <img className='h-40 object-contain relative z-10 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]' src={currentV.img} alt={currentV.name} />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                        <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentV.name} Verified</span>
                    </div>
                </motion.div>

                {/* Navigation Track */}
                <div className='relative bg-slate-50 rounded-[3rem] p-8 space-y-8 border border-slate-100'>
                    <div className="absolute left-[38px] top-[48px] bottom-[48px] w-[2px] bg-slate-200 flex flex-col justify-between items-center py-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                    </div>

                    <div className='flex gap-6 items-start'>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-slate-400">
                            <Navigation className="w-6 h-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1'>Departure</h5>
                            <p className='text-sm font-black text-slate-900 leading-tight line-clamp-2'>{pickup}</p>
                        </div>
                    </div>

                    <div className='flex gap-6 items-start'>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-slate-400">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1'>Arrival</h5>
                            <p className='text-sm font-black text-slate-900 leading-tight line-clamp-2'>{destination}</p>
                        </div>
                    </div>
                </div>

                {/* Final Fare Summary */}
                <div className='flex items-center justify-between p-8 bg-black rounded-[2.5rem] text-white overflow-hidden relative'>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-transparent opacity-50"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-4 h-4 text-indigo-400" />
                            <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-white/50'>Authorize Payment</h5>
                        </div>
                        <h3 className='text-4xl font-black tracking-tighter'>₹{fare?.fares && vehicleType ? fare.fares[vehicleType] : 0}</h3>
                    </div>
                    <div className="relative z-10 text-right">
                        <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 group cursor-default shadow-2xl">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 block mb-0.5">Method</span>
                            <span className="text-sm font-black text-white">Cash in Hand</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 flex gap-4">
                <button
                    onClick={() => setConfirmRidePanel(false)}
                    className='flex-1 flex items-center justify-center gap-2 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all border border-slate-200'
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        setVehicleFound(true);
                        setConfirmRidePanel(false);
                        createRide();
                    }}
                    className='flex-[2] group relative bg-indigo-600 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] overflow-hidden'
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-0 group-hover:opacity-100 transition-all"></div>
                    <span className="relative z-10 uppercase tracking-widest">Confirm & Book</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
            </div>
        </div>
    );
};

export default ConfirmRide;
