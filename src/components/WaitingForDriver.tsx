'use client';
import React from 'react';
import { Phone, MessageSquare, Star, MapPin, ChevronDown, User } from 'lucide-react';

interface WaitingForDriverProps {
    ride: any;
    setVehicleFound: (val: boolean) => void;
    setWaitingForDriver: (val: boolean) => void;
    waitingForDriver: boolean;
}

const WaitingForDriver = ({ ride, setWaitingForDriver }: WaitingForDriverProps) => {
    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between pt-2 pb-3 px-4 border-b border-slate-100">
                <div>
                    <h3 className='text-base font-bold text-slate-900'>Captain Assigned</h3>
                    <p className="text-xs text-emerald-600 font-semibold">Driver is on the way to your pickup</p>
                </div>
                <button
                    onClick={() => setWaitingForDriver(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {/* Driver Info Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                            {ride?.captain?.profileImage ? (
                                <img
                                    className="w-full h-full object-cover"
                                    src={ride.captain.profileImage}
                                    alt="Captain"
                                />
                            ) : (
                                <User className="w-6 h-6 text-slate-400" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">{ride?.captain?.fullname?.firstname || 'Captain'}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="font-semibold text-slate-700">4.9</span>
                                <span>•</span>
                                <span className="uppercase font-semibold text-slate-700">{ride?.captain?.vehicle?.plate}</span>
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicle</span>
                        <span className="text-xs font-bold text-indigo-600 uppercase">{ride?.captain?.vehicle?.vehicleType}</span>
                    </div>
                </div>

                {/* OTP Box */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide block">
                            Start Ride OTP
                        </span>
                        <p className="text-xs text-slate-500">Share this code with captain on arrival</p>
                    </div>
                    <div className="bg-indigo-600 text-white font-extrabold text-2xl tracking-widest px-4 py-1.5 rounded-xl shadow-xs">
                        {ride?.otp || '----'}
                    </div>
                </div>

                {/* Pickup details */}
                <div className='bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs flex items-start gap-2.5'>
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className='text-[10px] font-bold uppercase text-slate-400 block'>Pickup Location</span>
                        <p className='text-slate-800 font-semibold line-clamp-2'>{ride?.pickup}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 flex gap-2.5">
                <button
                    onClick={() => alert(`Calling driver at ${ride?.captain?.phone || '+91 9876543210'}`)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
                >
                    <Phone className="w-3.5 h-3.5" /> Call Driver
                </button>
                <button
                    onClick={() => window.location.href = `/messages?partnerId=${ride?.captain?._id}&partnerType=captain&partnerName=${ride?.captain?.fullname?.firstname}&rideId=${ride?._id}`}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider shadow-sm"
                >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                </button>
            </div>
        </div>
    );
};

export default WaitingForDriver;