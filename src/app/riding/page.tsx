'use client';
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocketDataContext } from '@/context/SocketContext';
import axios from 'axios';
import LiveTracking from '@/components/LiveTracking';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Phone, MessageSquare, ShieldCheck, MapPin,
   Navigation, Star, Shield, Wallet, AlertTriangle,
   ThumbsUp, User
} from 'lucide-react';

const RidingContent = () => {
   const searchParams = useSearchParams();
   const rideId = searchParams.get('rideId');
   const [ride, setRide] = useState<any>(null);
   const [showSOS, setShowSOS] = useState(false);
   const [captainLocation, setCaptainLocation] = useState<[number, number] | null>(null);
   const { socket } = useContext(SocketDataContext);
   const router = useRouter();

   useEffect(() => {
      const fetchRide = async () => {
         if (!rideId) return;
         try {
            const res = await axios.get(`/api/rides/details?rideId=${rideId}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRide(res.data);
         } catch (err: any) {
            console.error("Error fetching ride:", err);
         }
      };
      fetchRide();

      if (socket) {
         socket.on('ride-started', (data: any) => {
            setRide(data);
         });

         socket.on('ride-ended', () => {
            alert('Ride ended! Thank you for travelling with YatraRide.');
            router.push('/home');
         });

         socket.on('update-location-captain', (data: any) => {
            if (data.location) {
               setCaptainLocation([data.location.ltd, data.location.lng]);
            }
         });
      }
      return () => {
         socket?.off('ride-started');
         socket?.off('ride-ended');
         socket?.off('update-location-captain');
      };
   }, [socket, router, rideId]);

   return (
      <div className='h-screen relative overflow-hidden bg-slate-50 font-sans'>
         {/* Map Layer */}
         <div className='absolute inset-0 z-0 bg-slate-100'>
            <LiveTracking
               pickupLocation={captainLocation}
               dropLocation={ride?.destinationLocation?.coordinates ? [ride.destinationLocation.coordinates[1], ride.destinationLocation.coordinates[0]] : null}
               route={[]}
            />
         </div>

         {/* Floating Status Bar */}
         <header className="absolute top-0 left-0 w-full z-40 p-4 pointer-events-none">
            <div className="mx-auto max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between pointer-events-auto border border-slate-200 shadow-md">
               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                     <Navigation className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                     <p className="text-xs font-bold text-slate-900">En Route to Destination</p>
                  </div>
               </div>
               <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                  On Trip
               </span>
            </div>
         </header>

         {/* Bottom Ride Card */}
         <div className="absolute bottom-0 left-0 w-full z-30 p-2 sm:p-4 pointer-events-none">
            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl pointer-events-auto p-4 sm:p-5 border border-slate-200">
               {/* Driver Info Header */}
               <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                        {ride?.captain?.profileImage ? (
                           <img src={ride.captain.profileImage} alt="Captain" className="w-full h-full object-cover" />
                        ) : (
                           <User className="w-6 h-6 text-slate-400" />
                        )}
                     </div>
                     <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                           {ride?.captain?.fullname?.firstname || 'Captain'}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                           <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                           <span className="font-semibold text-slate-700">4.9</span>
                           <span>•</span>
                           <span className="uppercase font-semibold">{ride?.captain?.vehicle?.plate || 'DL 01 AB 1234'}</span>
                        </p>
                     </div>
                  </div>

                  <div className="text-right">
                     <span className="text-base sm:text-lg font-bold text-slate-900 block">₹{ride?.fare || '240'}</span>
                     <span className="text-[11px] text-slate-400 font-medium">Cash / Online</span>
                  </div>
               </div>

               {/* Destination */}
               <div className="py-3 flex items-start gap-2.5 text-xs">
                  <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                     <span className="text-[10px] text-slate-400 uppercase font-bold block">Drop Location</span>
                     <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{ride?.destination || 'Destination Address'}</p>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <button
                     onClick={() => alert(`Calling captain at ${ride?.captain?.phone || '+91 9876543210'}`)}
                     className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                     <Phone className="w-3.5 h-3.5 text-indigo-600" /> Call
                  </button>

                  <button
                     onClick={() => router.push(`/messages?partnerId=${ride?.captain?._id}&partnerType=captain&partnerName=${ride?.captain?.fullname?.firstname}&rideId=${ride?._id}`)}
                     className="py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                     <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>

                  <button
                     onClick={() => setShowSOS(true)}
                     className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-200"
                  >
                     <AlertTriangle className="w-3.5 h-3.5" /> SOS
                  </button>
               </div>
            </div>
         </div>

         {/* SOS Modal */}
         <AnimatePresence>
            {showSOS && (
               <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-sm rounded-2xl p-5 text-center shadow-2xl border border-slate-200">
                     <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="w-6 h-6" />
                     </div>
                     <h3 className="text-base font-bold text-slate-900 mb-1">Emergency SOS</h3>
                     <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Do you want to share your live location with emergency contacts and call police emergency (112)?
                     </p>
                     <div className="space-y-2">
                        <button
                           onClick={() => {
                              alert('Emergency alerts dispatched to police and emergency contacts.');
                              setShowSOS(false);
                           }}
                           className="w-full py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-rose-700 transition-colors uppercase tracking-wider"
                        >
                           Confirm Emergency
                        </button>
                        <button
                           onClick={() => setShowSOS(false)}
                           className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                        >
                           Cancel
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

const Riding = () => {
   return (
      <Suspense fallback={<div className="h-screen w-full bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div></div>}>
         <RidingContent />
      </Suspense>
   );
}

export default Riding;