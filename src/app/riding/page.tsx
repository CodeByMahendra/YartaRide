'use client';
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocketDataContext } from '@/context/SocketContext';
import axios from 'axios';
import LiveTracking from '@/components/LiveTracking';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Phone, MessageSquare, ShieldCheck, MapPin,
   Navigation, Timer, Star, CheckCircle2, ChevronUp,
   Shield, Wallet, ArrowRight, Share2, AlertTriangle,
   X, ThumbsUp
} from 'lucide-react';

const RidingContent = () => {
   const searchParams = useSearchParams();
   const rideId = searchParams.get('rideId');
   const [ride, setRide] = useState<any>(null);
   const [showSOS, setShowSOS] = useState(false);
   const [ratingModal, setRatingModal] = useState(false);
   const [rating, setRating] = useState(0);
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
         } catch (err) {
            console.error("Error fetching ride:", err);
         }
      };
      fetchRide();

      if (socket) {
         socket.on('ride-started', (data: any) => {
            setRide(data);
         });

         socket.on('ride-ended', () => {
            setRatingModal(true);
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
      <div className='h-screen relative overflow-hidden bg-slate-50 font-sans selection:bg-indigo-100'>
         {/* Premium Background Elements */}
         <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none"></div>

         {/* Interactive Map Layer */}
         <div className='absolute inset-0 z-0 bg-slate-100'>
            <LiveTracking
               pickupLocation={captainLocation}
               dropLocation={ride?.destinationLocation?.coordinates ? [ride.destinationLocation.coordinates[1], ride.destinationLocation.coordinates[0]] : null}
               route={[]}
            />
         </div>

         {/* Floating Status Bar */}
         <header className="absolute top-0 left-0 w-full z-[60] p-6 md:p-8 pointer-events-none">
            <motion.div
               initial={{ y: -40, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="mx-auto max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl p-5 flex items-center justify-between pointer-events-auto border border-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)]"
            >
               <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                     <Navigation className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block">Transit Status</span>
                     <p className="text-sm font-black text-slate-900 tracking-tight mt-1">In Real-time Flow</p>
                  </div>
               </div>
               <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 shadow-inner">
                  <span className="text-indigo-600 font-bold text-xs">8 MIN</span>
               </div>
            </motion.div>
         </header>

         {/* Active Session Management */}
         <div className="absolute bottom-0 left-0 w-full z-[50] p-0 md:p-8 pointer-events-none">
            <motion.div
               initial={{ y: 150, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="max-w-xl mx-auto bg-white rounded-t-[3.5rem] md:rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] pointer-events-auto p-10 md:p-12 border border-slate-100 relative overflow-hidden"
            >
               {/* Pulse Progress Stream */}
               <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                  <motion.div
                     initial={{ width: "20%" }}
                     animate={{ width: "75%" }}
                     transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                     className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                  />
               </div>

               <div className="flex justify-between items-start mb-10 mt-2">
                  <div className="space-y-3">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" /> SECURE LINK ACTIVE
                     </div>
                     <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Riding.</h2>
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{ride?.rideType || 'Standard'} Mode Initialized</p>
                  </div>
                  <div className="relative">
                     <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 p-1 border-2 border-slate-100 overflow-hidden shadow-2xl shadow-indigo-100">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop" alt="Captain" className="w-full h-full object-cover rounded-[2rem]" />
                     </div>
                     <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg text-white"
                     >
                        <ThumbsUp className="w-3.5 h-3.5" />
                     </motion.div>
                  </div>
               </div>

               {/* Fleet & Commander Info Grid */}
               <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Fleet Plate</span>
                     <p className="text-slate-900 font-black text-lg tracking-tight leading-none">{ride?.captain?.vehicle?.plate || 'MP09 AB 1234'}</p>
                     <p className="text-[9px] text-indigo-500 font-bold uppercase mt-2 tracking-tight">{ride?.captain?.vehicle?.model || 'Titan Series'}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Commander</span>
                     <div className="flex items-center justify-center gap-2">
                        <p className="text-slate-900 font-black text-lg tracking-tight leading-none">{ride?.captain?.fullname?.firstname || 'Captain'}</p>
                        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-slate-100">
                           <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                           <span className="text-[9px] font-black text-slate-900">4.9</span>
                        </div>
                     </div>
                     <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-tight">Level 5 Pilot</p>
                  </div>
               </div>

               {/* Visual Route Info */}
               <div className="bg-white rounded-[3rem] p-8 border border-slate-100 mb-10 shadow-xl shadow-black/[0.02] relative group">
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-xl shadow-indigo-100">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Primary Objective</span>
                        <p className="text-lg font-black text-slate-900 leading-tight tracking-tighter truncate">{ride?.destination || 'Destination Name'}</p>
                     </div>
                  </div>
                  <div className="h-px bg-slate-50 my-6"></div>
                  <div className="flex justify-between items-center">
                     <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Contract Value</span>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">₹{ride?.fare || '240'}</p>
                     </div>
                     <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest">Cash Sync</span>
                        <Wallet className="w-4 h-4" />
                     </div>
                  </div>
               </div>

               {/* Interaction Control */}
               <div className="space-y-4">
                  <div className="flex gap-4">
                     <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-6 bg-slate-900 text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-2xl transition-all text-[11px] uppercase tracking-widest"
                     >
                        <Phone className="w-5 h-5 text-indigo-400" /> Contact Pilot
                     </motion.button>
                     <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/messages?partnerId=${ride?.captain?._id}&partnerType=captain&partnerName=${ride?.captain?.fullname?.firstname}&rideId=${ride?._id}`)}
                        className="flex-1 py-6 bg-indigo-50 text-indigo-700 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl transition-all text-[11px] uppercase tracking-widest border border-indigo-100"
                     >
                        <MessageSquare className="w-5 h-5" /> Chat
                     </motion.button>
                     <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSOS(true)}
                        className="w-20 py-6 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center border border-rose-100 shadow-lg"
                     >
                        <Shield className="w-6 h-6" />
                     </motion.button>
                  </div>

                  <motion.button
                     whileHover={{ scale: 1.01, backgroundColor: '#4338ca' }}
                     whileTap={{ scale: 0.99 }}
                     className="w-full py-7 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-100 transition-all border border-indigo-500"
                  >
                     Complete Transfer & Exit
                  </motion.button>
               </div>
            </motion.div>
         </div>

         {/* Texture Layer */}
         <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

         {/* Security Alerts */}
         <AnimatePresence>
            {showSOS && (
               <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6"
               >
                  <motion.div
                     initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                     className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 text-center shadow-[0_40px_100px_-20px_rgba(244,63,94,0.3)] border border-rose-50 relative overflow-hidden"
                  >
                     <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-100 shadow-inner">
                        <AlertTriangle className="w-12 h-12 text-rose-500" />
                     </div>
                     <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">SOS Alert</h2>
                     <p className="text-slate-400 text-sm mb-10 font-bold leading-relaxed uppercase tracking-tight">Active mission distress signal. Remote support task-force will be deployed immediately.</p>

                     <div className="space-y-4 relative z-10">
                        <button className="w-full py-5 bg-rose-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-rose-200 transition-all">Invoke Emergency Protocol</button>
                        <button onClick={() => setShowSOS(false)} className="w-full py-5 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all">Disengage Signal</button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

      </div>
   );
};

const Riding = () => {
   return (
      <Suspense fallback={<div className="h-screen w-full bg-slate-50 flex items-center justify-center text-indigo-600"><div className="w-12 h-12 rounded-full border-[6px] border-indigo-600 border-t-transparent animate-spin"></div></div>}>
         <RidingContent />
      </Suspense>
   );
}

export default Riding;
