'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Compass } from 'lucide-react';

interface LookingForDriverProps {
    setVehicleFound: (val: boolean) => void;
    pickup: string;
    destination: string;
    fare: any;
    vehicleType: string | null;
}

const LookingForDriver = ({ setVehicleFound, pickup, destination, fare, vehicleType }: LookingForDriverProps) => {
    const finalFare = fare?.fares && vehicleType ? fare.fares[vehicleType] : 0;

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between pt-2 pb-3 px-4 border-b border-slate-100">
                <div>
                    <h3 className='text-base font-bold text-slate-900'>Searching for Captain</h3>
                    <p className="text-xs text-slate-500">Connecting you to nearby drivers...</p>
                </div>
                <button
                    onClick={() => setVehicleFound(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Radar / Animation */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="relative w-36 h-36 flex items-center justify-center mb-5">
                    <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-indigo-100 border border-indigo-300"
                    />
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-inner">
                        <Compass className="w-9 h-9 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900">Looking for nearby drivers...</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Please hold on while drivers in your area accept your ride request.
                </p>
            </div>

            {/* Trip Details Card */}
            <div className="p-4 border-t border-slate-100 space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{destination}</span>
                    </div>
                    <span className="font-bold text-slate-900 flex-shrink-0 ml-2">₹{finalFare}</span>
                </div>

                <button
                    onClick={() => setVehicleFound(false)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                    Cancel Request
                </button>
            </div>
        </div>
    );
};

export default LookingForDriver;