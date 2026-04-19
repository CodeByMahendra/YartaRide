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
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header / Handle */}
            <div className="flex flex-col items-center pt-3 pb-6 px-6">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-6"></div>
                <div className="w-full flex items-center gap-4">
                    <button
                        onClick={() => setConfirmRidePanel(false)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className='text-3xl font-black text-slate-900 tracking-tighter leading-none'>Finalize.</h3>
                        <p className="text-indigo-600 font-bold text-[9px] uppercase tracking-[0.2em] mt-2">Authorization Pending</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 space-y-5">
                {/* Visual Vehicle Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`relative flex flex-col items-center justify-center p-6 bg-gradient-to-br ${currentV.color} rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
                    <img className='h-24 md:h-28 object-contain relative z-10 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]' src={currentV.img} alt={currentV.name} />
                    <div className="relative z-10 mt-2 flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full border border-white/10">
                        <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">High Velocity</span>
                    </div>
                </motion.div>

                {/* Path Logic */}
                <div className='relative bg-slate-50/50 rounded-[2.5rem] p-8 space-y-6 border border-slate-100 shadow-inner'>
                    <div className="absolute left-[34px] top-[45px] bottom-[45px] w-0.5 bg-slate-200 flex flex-col justify-between items-center py-2">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)] ring-4 ring-white"></div>
                        <div className="w-3.5 h-3.5 bg-rose-500 rotate-45 border-2 border-white"></div>
                    </div>

                    <div className='flex gap-5 items-start relative z-10'>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-100">
                            <Navigation className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="flex-1">
                            <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5'>Departure Strategy</h5>
                            <p className='text-sm font-bold text-slate-900 leading-snug break-words'>{pickup}</p>
                        </div>
                    </div>

                    <div className='flex gap-5 items-start relative z-10'>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-100">
                            <MapPin className="w-5 h-5 text-rose-500" />
                        </div>
                        <div className="flex-1">
                            <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5'>Target Destination</h5>
                            <p className='text-sm font-bold text-slate-900 leading-snug break-words'>{destination}</p>
                        </div>
                    </div>
                </div>

                {/* Price Matrix */}
                <div className='flex items-center justify-between p-6 bg-slate-900 rounded-[2.2rem] text-white relative overflow-hidden group shadow-2xl shadow-indigo-200'>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-4 h-4 text-indigo-400" />
                            <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400'>Authorized Fare</h5>
                        </div>
                        <h3 className='text-3xl font-black tracking-tight'>₹{fare?.fares && vehicleType ? fare.fares[vehicleType] : 0}</h3>
                    </div>
                    <div className="relative z-10 text-right">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest block">Standard Cash</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 flex gap-4">
                <button
                    onClick={() => setConfirmRidePanel(false)}
                    className='flex-1 py-6 bg-slate-50 text-slate-500 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-all border border-slate-100'
                >
                    Abort
                </button>
                <button
                    onClick={() => {
                        setVehicleFound(true);
                        setConfirmRidePanel(false);
                        createRide();
                    }}
                    className='flex-[2] group relative bg-indigo-600 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-4 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 overflow-hidden'
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                    <span className="relative z-10 uppercase tracking-[0.2em] text-[11px]">Deploy Ride</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
            </div>
        </div>
    );
};

export default ConfirmRide;
