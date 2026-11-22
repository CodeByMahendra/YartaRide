'use client';
import React from 'react';
import { MapPin, ChevronLeft, Navigation, ArrowRight } from 'lucide-react';

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
        car: { name: 'Yatra Car', img: '/images/homePage.png' },
        moto: { name: 'Yatra Bike', img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png' },
        auto: { name: 'Yatra Auto', img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png' }
    };

    const currentV = vehicleType ? (vehicleInfo as any)[vehicleType] || vehicleInfo.car : vehicleInfo.car;
    const finalFare = fare?.fares && vehicleType ? fare.fares[vehicleType] : 0;

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 pt-2 pb-3 px-4 border-b border-slate-100">
                <button
                    onClick={() => setConfirmRidePanel(false)}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h3 className='text-base font-bold text-slate-900'>Confirm Your Ride</h3>
                    <p className="text-xs text-slate-500">Review trip details before booking</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {/* Vehicle Preview Card */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 border border-slate-200/60">
                            <img className='max-h-full max-w-full object-contain' src={currentV.img} alt={currentV.name} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">{currentV.name}</h4>
                            <p className="text-xs text-slate-500">Fast arrival • Professional driver</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-slate-900">₹{finalFare}</span>
                        <span className="text-[10px] text-slate-400 block">Total Fare</span>
                    </div>
                </div>

                {/* Route */}
                <div className='bg-slate-50 rounded-2xl p-3.5 space-y-3 border border-slate-100 text-xs'>
                    <div className='flex gap-2.5 items-start'>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                            <span className='text-[10px] font-bold uppercase text-slate-400 block'>Pickup Location</span>
                            <p className='text-slate-800 font-semibold truncate'>{pickup}</p>
                        </div>
                    </div>

                    <div className='flex gap-2.5 items-start pt-2 border-t border-slate-200/50'>
                        <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                            <span className='text-[10px] font-bold uppercase text-slate-400 block'>Drop Location</span>
                            <p className='text-slate-800 font-semibold truncate'>{destination}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Option */}
                <div className='flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700'>
                    <span className="font-semibold">Payment Method:</span>
                    <span className="font-bold text-indigo-600">Cash / Online at Drop</span>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 flex gap-2.5">
                <button
                    onClick={() => setConfirmRidePanel(false)}
                    className='py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider'
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        setVehicleFound(true);
                        setConfirmRidePanel(false);
                        createRide();
                    }}
                    className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-bold text-xs flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider'
                >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ConfirmRide;