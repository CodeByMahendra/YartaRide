'use client';
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocketDataContext } from '@/context/SocketContext';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import LiveTracking from '@/components/LiveTracking';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Phone, Navigation, MapPin,
    CheckCircle2, Lock, ArrowRight, User, Star, MessageSquare
} from 'lucide-react';

const CaptainRidingContent = () => {
    const searchParams = useSearchParams();
    const rideId = searchParams.get('rideId');
    const [otp, setOtp] = useState('');
    const [ride, setRide] = useState<any>(null);
    const [rideStatus, setRideStatus] = useState<'approaching' | 'waiting' | 'in-progress'>('approaching');
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const { socket } = useContext(SocketDataContext);
    const { captain } = useContext(CaptainDataContext);
    const router = useRouter();

    useEffect(() => {
        const fetchRide = async () => {
            try {
                if (rideId) {
                    const response = await axios.get(`/api/rides/details?rideId=${rideId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (response.data) {
                        setRide(response.data);
                        if (response.data.status === 'ongoing') {
                            setRideStatus('in-progress');
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching ride:", err);
            }
        };
        fetchRide();

        let watchId: number;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation([latitude, longitude]);
                if (socket) {
                    socket.emit('update-location-captain', {
                        userId: captain?._id,
                        location: { ltd: latitude, lng: longitude }
                    });
                }
            }, (err) => console.error(err), { enableHighAccuracy: true });
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [rideId, socket, captain]);

    const startRide = async () => {
        try {
            const response = await axios.get('/api/rides/start-ride', {
                params: { rideId, otp },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.status === 200) {
                setRideStatus('in-progress');
            }
        } catch (error) {
            console.error("Error starting ride:", error);
            alert("Invalid OTP. Please check with passenger.");
        }
    };

    const endRide = async () => {
        try {
            const response = await axios.post('/api/rides/end-ride', { rideId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.status === 200) {
                alert('Ride completed! Collect cash or confirm online payment.');
                router.push('/captain-home');
            }
        } catch (error) {
            console.error("Error ending ride:", error);
            alert("Error ending ride");
        }
    };

    return (
        <div className='h-screen relative overflow-hidden bg-slate-50 font-sans'>
            {/* Map */}
            <div className='absolute inset-0 z-0 bg-slate-100'>
                <LiveTracking
                    pickupLocation={currentLocation}
                    dropLocation={ride?.destinationLocation?.coordinates ? [ride.destinationLocation.coordinates[1], ride.destinationLocation.coordinates[0]] : null}
                    route={[]}
                />
            </div>

            {/* Top Bar */}
            <header className='absolute top-0 left-0 w-full z-40 p-4 flex justify-between items-center pointer-events-none'>
                <div className='bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200 pointer-events-auto flex items-center gap-2'>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800">
                        {rideStatus === 'approaching' ? 'Pickup Passenger' : 'Trip in Progress'}
                    </span>
                </div>

                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onClick={() => router.push(`/messages?partnerId=${ride?.user?._id}&partnerType=user&partnerName=${ride?.user?.fullname?.firstname}&rideId=${ride?._id}`)}
                        className="bg-white/95 backdrop-blur-md w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-700 border border-slate-200 shadow-md hover:text-indigo-600 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => alert(`Calling passenger at ${ride?.user?.phone || '+91 9876543210'}`)}
                        className="bg-white/95 backdrop-blur-md w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-700 border border-slate-200 shadow-md hover:text-indigo-600 transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Bottom Card */}
            <div className="absolute bottom-0 left-0 w-full z-30 p-2 sm:p-4 pointer-events-none">
                <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl pointer-events-auto p-4 sm:p-5 border border-slate-200">
                    {/* Passenger Header */}
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                                {ride?.user?.profileImage ? (
                                    <img src={ride.user.profileImage} className="w-full h-full object-cover" alt="User" />
                                ) : (
                                    <User className="w-6 h-6 text-slate-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                    {ride?.user?.fullname?.firstname || 'Passenger'}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Verified Customer</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Fare</span>
                            <span className="text-base sm:text-lg font-bold text-slate-900">₹{ride?.fare || '0'}</span>
                        </div>
                    </div>

                    {rideStatus === 'approaching' ? (
                        /* OTP Input Area */
                        <div className="py-4 space-y-3">
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                                <label className="text-xs font-bold text-slate-600 block mb-2">
                                    Ask passenger for 4-digit OTP
                                </label>
                                <div className="flex justify-center">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        className="w-40 text-center text-2xl font-black tracking-[0.3em] py-2 px-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                        maxLength={4}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={startRide}
                                disabled={otp.length !== 4}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-40 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                            >
                                <span>Start Trip</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        /* In Transit view */
                        <div className="py-3 space-y-3">
                            <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                                <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination</span>
                                    <p className="font-semibold text-slate-800 line-clamp-2">{ride?.destination || 'Destination'}</p>
                                </div>
                            </div>

                            <button
                                onClick={endRide}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                            >
                                <span>Complete Trip</span>
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CaptainRiding = () => {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div></div>}>
            <CaptainRidingContent />
        </Suspense>
    );
};

export default CaptainRiding;